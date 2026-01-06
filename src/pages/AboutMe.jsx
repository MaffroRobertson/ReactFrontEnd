import React from 'react';
import '../styles/AboutMe.css';

function AboutMe() {
  // Replace these placeholder values with your actual information
  const socialLinks = {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'your.email@example.com',
    cv: '/path-to-your-cv.pdf'
  };

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About Me</h1>
        <p className="tagline">Developer | Diver | Explorer</p>
      </div>
      
      <div className="about-content">
        <section className="bio-section">
          <h2>Bio</h2>
          <p>
            Welcome! I'm a passionate developer with a love for creating innovative solutions
            and exploring the underwater world. This is your space to share your story.
          </p>
          <p>
            Add your background, education, career highlights, and what drives you.
          </p>
        </section>

        <section className="skills-section">
          <h2>Skills & Expertise</h2>
          <div className="skills-grid">
            <div className="skill-item">JavaScript / React</div>
            <div className="skill-item">Node.js</div>
            <div className="skill-item">API Development</div>
            <div className="skill-item">Database Management</div>
            <div className="skill-item">Scuba Diving</div>
            <div className="skill-item">Photography</div>
          </div>
        </section>

        <section className="links-section">
          <h2>Connect With Me</h2>
          <div className="social-links">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="icon">🐙</span>
              <span>GitHub</span>
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="icon">💼</span>
              <span>LinkedIn</span>
            </a>
            <a href={`mailto:${socialLinks.email}`} className="social-link">
              <span className="icon">📧</span>
              <span>Email</span>
            </a>
            <a href={socialLinks.cv} target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="icon">📄</span>
              <span>Download CV</span>
            </a>
          </div>
        </section>

        <section className="interests-section">
          <h2>Interests & Hobbies</h2>
          <ul>
            <li>💻 Software Development & Open Source</li>
            <li>🤿 Scuba Diving & Marine Life</li>
            <li>📸 Underwater Photography</li>
            <li>🌍 Travel & Exploration</li>
            <li>📚 Continuous Learning</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AboutMe;
