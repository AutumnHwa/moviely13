import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/MyalrPage.css';
import logoImage from '../logo.png';
import MvBanner from './MvBanner';
import { useAuth } from '../context/AuthContext';

function MyalrPage() {
  const { authToken, user, logout } = useAuth(); 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        const response = await fetch(`https://moviely.duckdns.org/api/watched?userId=${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching watched movies:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchWatchedMovies();
    }
  }, [authToken, user]);

  const handleAuthButtonClick = () => {
    if (authToken) {
      logout();
    } else {
      navigate('/log-sign');
    }
  };

  return (
    <div className="myalrPage">
      <header className="pageHeader">
        <Link to="/">
          <img src={logoImage} alt="Logo" className="myPageLogo" />
        </Link>
        <div className="authButtons">
          <button className="authButton" onClick={handleAuthButtonClick}>
            {authToken ? '로그아웃' : '로그인'}
          </button>
        </div>
      </header>
      <div className="myPageTitle">마이페이지</div>
      <div className="navButtons">
        <Link to="/my/watched" className="navButton active">이미 본 영화</Link>
        <Link to="/my/wishlist" className="navButton">보고싶은 영화</Link>
        <Link to="/my/calendar" className="navButton">MOVIELY 캘린더</Link>
      </div>
      <div className="movieGrid">
        {loading ? <div className="loading">로딩 중...</div> : 
          movies.length > 0 ? (
            movies.map((movie, index) => (
              <MvBanner
                key={index}
                title={movie.title}
                poster={movie.poster_path}
                flatrate={movie.flatrate.join(', ')}
                movieId={movie.id || movie.movie_id}
                userId={user?.id}
              />
            ))
          ) : (
            <div className="noMovies">본 영화가 없습니다.</div>
          )}
      </div>
    </div>
  );
}

export default MyalrPage;
