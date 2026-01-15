import React from 'react';
import '../styles/AboutMe.css';
import { aboutMe } from '../data/aboutMe';

function AboutMe() {

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About Me</h1>
        <p className="tagline">{aboutMe.tagline}</p>
      </div>
      
      <div className="about-content">
        <section className="bio-section">
          <h2>Bio</h2>
          {aboutMe.bio.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </section>

        <section className="skills-section">
          <h2>Skills & Expertise</h2>
          <div className="skills-grid">
            {aboutMe.skills.map((skill) => (
              <div className="skill-item" key={skill}>{skill}</div>
            ))}
          </div>
        </section>

        <section className="links-section">
          <h2>Connect With Me</h2>
          <div className="social-links">
            <a href={aboutMe.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="icon">�</span>
              <span>LinkedIn</span>
            </a>
            <a href={`mailto:${aboutMe.links.email}`} className="social-link">
              <span className="icon">📧</span>
              <span>Email</span>
            </a>
            <a href={aboutMe.links.cv} target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="icon">�</span>
              <span>Download CV</span>
            </a>
          </div>
        </section>

        <section className="links-section">
          <h2>Projects</h2>
          <div className="social-links">
            <a href={aboutMe.links.github} target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="icon">�</span>
              <span>GitHub</span>
            </a>
            <a href={aboutMe.links.soundcloud} target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="icon">🎵</span>
              <span>SoundCloud</span>
            </a>
          </div>
        </section>

        <section className="interests-section">
          <h2>Interests & Hobbies</h2>
          <ul>
            {aboutMe.interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AboutMe;
