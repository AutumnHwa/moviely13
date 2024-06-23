import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/MywishPage.css';
import logoImage from '../logo.png';
import MvBanner from './MvBanner';
import { useAuth } from '../context/AuthContext';

function MywishPage() {
  const { authToken, user } = useAuth(); // AuthContext에서 authToken 및 user 가져오기
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistMovies = async () => {
      try {
        const response = await fetch(`https://moviely.duckdns.org/api/wishlist?userId=${user?.id}`, {
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
        console.error('Error fetching wishlist movies:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlistMovies();
    }
  }, [authToken, user]);

  return (
    <div className="mywishPage">
      <Link to="/">
        <img src={logoImage} alt="Logo" className="myPageLogo" />
      </Link>
      <div className="myPageTitle">마이페이지</div>
      <div className="navButtons">
        <Link to="/my/watched" className="navButton">이미 본 영화</Link>
        <Link to="/my/wishlist" className="navButton active">보고싶은 영화</Link>
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
            <div className="noMovies">보고싶은 영화가 없습니다.</div>
          )}
      </div>
    </div>
  );
}

export default MywishPage;
