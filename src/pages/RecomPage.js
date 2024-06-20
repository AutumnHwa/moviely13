import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Papa from 'papaparse';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import MvBanner from './MvBanner';
import '../css/RecomPage.css';
import logoImage from '../logo.png';
import moviesCSV from '../movie.csv';

const genreMapping = {
  '28': '액션',
  '12': '모험',
  '16': '애니메이션',
  '35': '코미디',
  '80': '범죄',
  '99': '다큐멘터리',
  '18': '드라마',
  '10751': '가족',
  '14': '판타지',
  '36': '역사',
  '27': '공포',
  '10402': '음악',
  '9648': '미스터리',
  '10749': '로맨스',
  '878': 'SF',
  '10770': 'TV 영화',
  '53': '스릴러',
  '10752': '전쟁',
  '37': '서부'
};

function RecomPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');
  const [randomMovies, setRandomMovies] = useState([]);
  const [topMovie, setTopMovie] = useState(null);
  const [movieItems, setMovieItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = 1; // 하드코딩된 사용자 ID

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('https://moviely.duckdns.org/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched recommendations:', data);

          data.forEach((movie, index) => {
            console.log(`Movie ${index}:`, movie);
          });

          if (data.length > 0) {
            setTopMovie(data[0]);
            setMovieItems(data.slice(1, 6));
          }
        } else {
          console.error('Failed to fetch recommendations:', response.statusText);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    fetchRecommendations();

    Papa.parse(moviesCSV, {
      download: true,
      header: true,
      complete: (result) => {
        console.log('Parsed CSV data:', result.data);
        const processedData = result.data.map(movie => ({
          ...movie,
          flatrate: movie.flatrate ? movie.flatrate.split(', ') : [],
          genre: movie.genre ? movie.genre.split(', ').map(g => genreMapping[g.trim()]).filter(Boolean) : [], // genre 필드 처리 및 매핑
        }));
        setRandomMovies(shuffleArray(processedData).slice(0, 10));
      },
    });
  }, [userId]);

  const shuffleArray = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleSearchClick = () => {
    navigate('/movie-search', { state: { searchTerm } });
  };

  return (
    <div className="RecomPage">
      <Link to="/" className="logo">
        <img src={logoImage} alt="Logo" />
      </Link>
      <div className="searchContainer">
        <input
          type="text"
          className="searchInput"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="searchButton" onClick={handleSearchClick}>
          검색
        </button>
      </div>
      <div className="greetingText">Autumn님을 위한 취향저격 영화를 찾아봤어요.</div>
      <div className="tabButtons">
        <button
          className={activeTab === 'recommendations' ? 'tabButton active' : 'tabButton'}
          onClick={() => setActiveTab('recommendations')}
        >
          내 취향 영화 추천받기
        </button>
        <button
          className={activeTab === 'platforms' ? 'tabButton active' : 'tabButton'}
          onClick={() => setActiveTab('platforms')}
        >
          내 맞춤 플랫폼 찾아보기
        </button>
      </div>
      <div className="tabContent">
        {activeTab === 'recommendations' && (
          <>
            <div className="topMovieAndListContainer">
              <div className="topMovieContainer">
                {loading ? (
                  <div>Loading top movie...</div>
                ) : (
                  topMovie && (
                    <div className="topMovie">
                      <MvBanner
                        title={topMovie.title}
                        poster={topMovie.poster_path}
                        flatrate={Array.isArray(topMovie.flatrate) ? topMovie.flatrate.join(', ') : topMovie.flatrate}
                        userId={userId} // 사용자 ID 전달
                        movieId={topMovie.movie_id} // 영화 ID 전달
                      />
                    </div>
                  )
                )}
              </div>
              <div className="movieListContainer">
                {loading ? (
                  <div>Loading movies...</div>
                ) : (
                  movieItems.map((movie, index) => {
                    const genreList = movie.genre ? movie.genre.split(',').map(g => genreMapping[g.trim()]).filter(Boolean) : [];
                    const posterUrl = movie.poster_path ? `http://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/70x105?text=No+Image';
                    console.log('Movie Data:', movie); // Movie 데이터 로그 출력
                    return (
                      <div key={index} className="movieItem">
                        <img
                          src={posterUrl}
                          alt={movie.title}
                          className="moviePoster"
                        />
                        <div className="movieDetails">
                          <div className="movieTitle">{movie.title}</div>
                          <div className="movieReleaseDate">{new Date(movie.release_date).toLocaleDateString()}</div>
                          <div className="movieGenre">{genreList.length ? genreList.join(', ') : 'No Genre'}</div>
                          <div className="movieOverview">{movie.overview}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="randomMoviesContainer">
              <Swiper
                spaceBetween={0}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
              >
                {randomMovies.map((movie, index) => {
                  const posterUrl = movie.poster_path ? `http://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/70x105?text=No+Image';
                  return (
                    <SwiperSlide key={index}>
                      <div style={{ transform: 'scale(0.8)' }}>
                        <MvBanner
                          title={movie.title}
                          poster={posterUrl}
                          flatrate={Array.isArray(movie.flatrate) ? movie.flatrate.join(', ') : movie.flatrate}
                          userId={userId} // 사용자 ID 전달
                          movieId={movie.movie_id} // 영화 ID 전달
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </>
        )}
        {activeTab === 'platforms' && (
          <div>
            {/* 플랫폼 관련 컨텐츠 */}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecomPage;
