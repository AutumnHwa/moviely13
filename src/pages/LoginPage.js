import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../css/LoginPage.css'; 
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    console.log("Google Login Success, credential:", credential);

    try {
      const res = await fetch('https://moviely.duckdns.org/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });
      const data = await res.json();

      console.log("Backend response data:", data);

      if (data.jwtToken) {
        login(data.jwtToken, data.user);
        navigate('/movie-select'); // 로그인 성공 시 영화 선택 페이지로 이동
      } else {
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Backend redirection failed:', error);
      alert('백엔드 처리에 실패했습니다.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Login Failed:', error);
    alert('Google 로그인에 실패했습니다.');
  };

  return (
    <div className="loginPage">
      <Link to="/" className="login-logo">
        <img src={logoImage} alt="Logo" />
      </Link>
      <div className="loginBox">
        <h2>로그인 및 회원가입</h2>
        <p>소셜 로그인 및 회원가입으로<br />MOVIELY의 모든 서비스를 이용하실 수 있습니다.</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
        <p className="redirect-text">
          아직 MOVIELY 계정이 없으신가요? <Link to="/signup" className="redirect-link">회원가입하러가기</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
