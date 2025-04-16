import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClubList from './pages/ClubList';
import ClubForm from './pages/ClubForm';
import ClubDetail from './pages/ClubDetail';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<ClubList />} />
          <Route path="/add" element={<ClubForm />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
