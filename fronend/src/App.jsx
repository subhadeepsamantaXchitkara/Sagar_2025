// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IntroAnimation from './Anima';
import BirthdayPage from './BP';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroAnimation />} />
        <Route path="/birthday" element={<BirthdayPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;