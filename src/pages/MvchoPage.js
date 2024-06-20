import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MvBanner from './MvBanner';
import '../css/MvchoPage.css';
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext'; // AuthContext import

function MvchoPage() {
  const { authToken, user, logout } = useAuth(); // AuthContext에서 authToken, user 및 logout 함수 가져오기
  const navigate = useNavigate();
  const genreMapping = useMemo(() => ({
    '장르 전체': 'All',
    '액션': '28',
    '모험': '12',
    '애니메이션': '16',
    '코미디': '35',
    '범죄': '80',
    '다큐멘터리': '99',
    '드라마': '18',
    '가족': '10751',
    '판타지': '14',
    '역사': '36',
    '공포': '27',
    '음악': '10402',
    '미스터리': '9648',
    '로맨스': '10749',
    'SF': '878',
    'TV 영화': '10770',
    '스릴러': '53',
    '전쟁': '10752',
    '서부': '37'
  }), []);

  const genres = useMemo(() => Object.keys(genreMapping), [genreMapping]);
  const [selectedGenre, setSelectedGenre] = useState('장르 전체');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log('Fetching movies...');
        const response = await fetch('https://moviely.duckdns.org/api/movies?size=1000', { mode: 'cors' });
        console.log('API 요청 성공:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API 응답 데이터:', data);

        if (data && data.content) {
          const processedData = data.content.map(movie => ({
            ...movie,
            flatrate: movie.flatrate ? movie.flatrate.split(', ') : [],
            genre: movie.genre ? movie.genre.split(', ') : [] // 장르 필드를 배열로 변환
          }));
          setMovies(processedData);
          console.log('Processed Data:', processedData); 
        } else {
          console.error('Unexpected response format:', data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = selectedGenre === '장르 전체' ? movies : movies.filter(movie =>
    movie.genre.includes(genreMapping[selectedGenre])
  );

  const banners = filteredMovies.map((movie, index) => (
    <MvBanner
      key={index}
      title={movie.title}
      poster={movie.poster_path}
      flatrate={movie.flatrate.join(', ')}
      rating={Math.round(movie.vote_average / 2)}
      movieId={movie.id} // 영화 ID 전달
      userId={user?.id} // 사용자 ID 전달
    />
  ));

  const handleAuthButtonClick = () => {
    if (authToken) {
      logout();
    } else {
      navigate('/log-sign');
    }
  };

  return (
    <div className="MvchoPage">
      <header className="pageHeader">
        <Link to="/" className="logo">
          <img src={logoImage} alt="Logo" />
        </Link>
        <button className="authButton" onClick={handleAuthButtonClick}>
          {authToken ? '로그아웃' : '로그인'}
        </button>
      </header>
      <div className="mainText">재미있게 봤거나 눈길이 가는 영화들을 평가해주세요.</div>
      <div className="subText">찜한 영화들을 바탕으로 MOVIELY가 취향저격 영화들을 추천해 드려요.</div>
      <div className="stickyTop">
        <Link to="/recommendations">
          <button className="recommendButton">영화 추천 받기 &gt;</button>
        </Link>
        <div className="genreButtons">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genreButton1 ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      <div className="bannerGrid">
        {loading ? <div className="loading">로딩 중...</div> : (banners.length > 0 ? banners : <div className="noMovies">선택하신 장르의 영화가 없습니다.</div>)}
      </div>
    </div>
  );
}

export default MvchoPage;
