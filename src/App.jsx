import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainPage from './pages/MainPage';
import AboutMe from './pages/AboutMe';
import Diving from './pages/Diving';
import DiveLog from './pages/DiveLog';
import './App.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <Router>
      <div
        className="app-container"
        style={{ '--sidebar-width': isSidebarCollapsed ? '64px' : '250px' }}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/dive-log" element={<DiveLog />} />
            <Route path="/diving" element={<Diving />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
