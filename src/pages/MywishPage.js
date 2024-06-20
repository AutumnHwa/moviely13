import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MywishPage.css'; 
import logoImage from '../logo.png'; 

function MywishPage() {
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
      {}
    </div>
  );
}

export default MywishPage;
