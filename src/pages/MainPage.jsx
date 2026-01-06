import React from 'react';
import '../styles/MainPage.css';

function MainPage() {
  return (
    <div className="main-page">
      <div className="hero-section">
        <h1>Welcome to My Personal Website</h1>
        <p className="subtitle">Dive into my world of technology and underwater adventures</p>
      </div>
      
      <div className="content-grid">
        <div className="card">
          <h2>👨‍💻 About Me</h2>
          <p>Learn more about my background, skills, and experience. Connect with me on various platforms.</p>
        </div>
        
        <div className="card">
          <h2>🤿 Diving</h2>
          <p>Explore my diving adventures and manage dive logs through an interactive API interface.</p>
        </div>
        
        <div className="card">
          <h2>🚀 Projects</h2>
          <p>Check out my latest projects and contributions on GitHub.</p>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
