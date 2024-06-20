import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MyalrPage.css'; // 이 페이지의 CSS를 임포트합니다.
import logoImage from '../logo.png'; // 로고 이미지 경로를 가정합니다.

function MyalrPage() {
  return (
    <div className="myalrPage">
      <Link to="/">
        <img src={logoImage} alt="Logo" className="myPageLogo" />
      </Link>
      <div className="myPageTitle">마이페이지</div>
      <div className="navButtons">
        <Link to="/my/watched" className="navButton active">이미 본 영화</Link>
        <Link to="/my/wishlist" className="navButton">보고싶은 영화</Link>
        <Link to="/my/calendar" className="navButton">MOVIELY 캘린더</Link>
      </div>
      {/* 나머지 페이지 콘텐츠를 여기에 추가하세요 */}
    </div>
  );
}

export default MyalrPage;
