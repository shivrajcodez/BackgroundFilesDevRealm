import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Engineering from './pages/Engineering';
import GuestBook from './pages/GuestBook';
import CustomCursor from './components/CustomCursor';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CustomCursor />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/engineering" element={<Engineering />} />
        <Route path="/guestbook"   element={<GuestBook />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
