import React from 'react';
import '../styles/MainPage.css';
import { Card, CardGrid, PageHeader } from '../components';

function MainPage() {
  return (
    <div className="main-page">
      <PageHeader
        title="Welcome to My Personal Website"
        subtitle="Dive into my world of technology and underwater adventures"
        className="hero-section"
      />

      <CardGrid className="content-grid">
        <Card title="👨‍💻 About Me">
          <p>Learn more about my background, skills, and experience. Connect with me on various platforms.</p>
        </Card>

        <Card title="🤿 Diving">
          <p>Explore my diving adventures and manage dive logs through an interactive API interface.</p>
        </Card>

        <Card title="🚀 Projects">
          <p>Check out my latest projects and contributions on GitHub.</p>
        </Card>
      </CardGrid>
    </div>
  );
}

export default MainPage;
