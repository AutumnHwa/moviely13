import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Mvbanner.css';
import Popcho from '../pages/Popcho';

import watchaLogo from '../watcha.png';
import netflixLogo from '../netflix.png';
import disneyPlusLogo from '../disneyplus.png';
import wavveLogo from '../wavve.png';

const flatrateLogos = {
  'disney plus': disneyPlusLogo,
  'netflix': netflixLogo,
  'watcha': watchaLogo,
  'wavve': wavveLogo
};

const MvBanner = ({ title, poster, flatrate, movieId, userId }) => {
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleStarClick = async (index) => {
    const newRating = index + 1;
    setRating(newRating);

    const ratingData = {
      user_id: userId,
      movie_id: movieId,
      rating: parseFloat(newRating)
    };

    try {
      const response = await fetch('https://moviely.duckdns.org/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });

      const responseData = await response.text();

      try {
        const jsonResponse = JSON.parse(responseData);
        if (response.ok) {
          setMessage('Rating submitted successfully!');
        } else {
          console.error('Rating submission failed:', jsonResponse);
          setMessage('Failed to submit rating: ' + (jsonResponse.message || 'Unknown error'));
        }
      } catch (e) {
        console.error('JSON parsing error:', responseData);
        setMessage('Failed to submit rating: Invalid JSON response.');
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to submit rating.');
    }

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveModal = async (option) => {
    const saveData = {
      user_id: userId,
      movie_id: movieId,
      option: option
    };

    try {
      const response = await fetch(`https://moviely.duckdns.org/api/${option}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage('영화가 저장되었습니다!');
      } else {
        console.error('Failed to save movie:', responseData);
        setMessage('영화 저장에 실패했습니다: ' + (responseData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('영화 저장에 실패했습니다.');
    }

    setShowModal(false);

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handlePosterClick = () => {
    console.log('Navigating to movie detail page with movieId:', movieId);
    navigate(`/movie/${movieId}`);
  };

  const validFlatrate = typeof flatrate === 'string' ? flatrate.split(', ').map(service => service.trim().toLowerCase()).filter(Boolean) : [];

  console.log('Poster URL:', poster ? `https://image.tmdb.org/t/p/w500${poster}` : 'https://via.placeholder.com/154x231?text=No+Image');

  validFlatrate.forEach(service => {
    console.log(`Service: ${service}, URL: ${flatrateLogos[service]}`);
  });

  const posterUrl = poster ? `https://image.tmdb.org/t/p/w500${poster}` : 'https://via.placeholder.com/154x231?text=No+Image';

  return (
    <div className="movie-banner">
      <img
        src={posterUrl}
        alt={title}
        className="movie-poster"
        style={{ width: '154px', height: '231px' }}
        onClick={handlePosterClick}
        onError={(e) => e.target.src = 'https://via.placeholder.com/154x231?text=No+Image'}
      />
      <div className="movie-info">
        <div className="movie-title">{title}</div>
        <div className="flatrate-logos">
          {validFlatrate.map((service, index) => (
            <img
              key={service}
              src={flatrateLogos[service]}
              alt={`${service} 로고`}
              className="flatrate-logo"
              onError={(e) => e.target.src = 'https://via.placeholder.com/18x18?text=No+Logo'}
            />
          ))}
        </div>
        <div className="movie-rating">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`star ${rating > index ? 'filled' : ''}`}
              onClick={() => handleStarClick(index)}
            >
              ★
            </span>
          ))}
        </div>
        <button onClick={handleAddClick} className="add-button">+</button>
      </div>
      {showModal && <Popcho onClose={handleCloseModal} onSave={handleSaveModal} movieId={movieId} userId={userId} />}
      {message && <div className="popupContainer">
        <div className="popupContent">
          <p>{message}</p>
          <button onClick={() => setMessage('')}>닫기</button>
        </div>
      </div>}
    </div>
  );
};

export default MvBanner;
