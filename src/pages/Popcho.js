import React, { useState } from 'react';
import '../css/Popcho.css';

function Popcho({ onClose, movieId, userId }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSaveClick = async () => {
    if (!selectedOption) {
      alert('옵션을 선택해주세요.');
      return;
    }

    const saveData = {
      user_id: userId,
      movie_id: movieId,
    };

    const endpoint = selectedOption === 'mywish' ? 'wish_list' : 'watched_list';

    try {
      const response = await fetch(`https://moviely.duckdns.org/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('영화가 저장되었습니다!');
      } else {
        console.error('Failed to save movie:', responseData);
        alert('영화 저장에 실패했습니다: ' + (responseData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('영화 저장에 실패했습니다.');
    }

    onClose();
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="modalHeader">마이페이지에 저장하기</div>
        <div className="radioGroup">
          <div className="radioOption">
            <input
              type="radio"
              id="option1"
              name="options"
              value="mywish"
              onChange={handleOptionChange}
            />
            <label htmlFor="option1" className="radioLabel">보고싶은 영화</label>
          </div>
          <div className="radioOption">
            <input
              type="radio"
              id="option2"
              name="options"
              value="myalr"
              onChange={handleOptionChange}
            />
            <label htmlFor="option2" className="radioLabel">이미 본 영화</label>
          </div>
        </div>
        <div className="modalButtons">
          <button onClick={onClose} className="closeButton">닫기</button>
          <button onClick={handleSaveClick} className="saveButton">저장</button>
        </div>
      </div>
    </div>
  );
}

export default Popcho;
