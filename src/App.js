import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LogSignPage from './pages/LogSignPage';
import AddPage from './pages/AddPage';
import MvchoPage from './pages/MvchoPage';
import RecomPage from './pages/RecomPage';
import MvdetailPage from './pages/MvdetailPage';
import MyalrPage from './pages/MyalrPage';
import MywishPage from './pages/MywishPage';
import MycalPage from './pages/MycalPage';
import MvsrchPage from './pages/MvsrchPage';
import { AuthProvider } from './context/AuthContext';

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/log-sign" element={<LogSignPage />} />
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
);

export default App;
