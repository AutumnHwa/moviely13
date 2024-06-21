import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'; // 수정된 부분
import SignUpPage from './pages/SignupPage'; // 수정된 부분
import AddPage from './pages/AddPage';
import MvchoPage from './pages/MvchoPage';
import RecomPage from './pages/RecomPage';
import MvdetailPage from './pages/MvdetailPage';
import MyalrPage from './pages/MyalrPage';
import MywishPage from './pages/MywishPage';
import MycalPage from './pages/MycalPage';
import MvsrchPage from './pages/MvsrchPage';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '13094654813-nqglekemv1iff66rsq4luqftbfgv51hi.apps.googleusercontent.com';

const App = () => (
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} /> {/* 수정된 부분 */}
          <Route path="/signup" element={<SignUpPage />} /> {/* 수정된 부분 */}
          <Route path="/add" element={<AddPage />} />
          <Route path="/movie-select" element={<MvchoPage />} />
          <Route path="/recommendations" element={<RecomPage />} />
          <Route path="/movie/:id" element={<MvdetailPage />} />
          <Route path="/my/watched" element={<MyalrPage />} />
          <Route path="/my/wishlist" element={<MywishPage />} />
          <Route path="/my/calendar" element={<MycalPage />} />
          <Route path="/movie-search" element={<MvsrchPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  </GoogleOAuthProvider>
);

export default App;
