import React from 'react';
import '../styles/DivingInfo.css';
import { divingInfo } from '../data/diving';

function Diving() {
  const { hero, highlights, gear, plans, cta } = divingInfo;

  return (
    <div className="diving-info-page">
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="lede">{hero.lede}</p>
        </div>
        <div className="hero-card">
          <h3>At a glance</h3>
          <ul>
            {hero.atAGlance.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.value}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="grid">
        {highlights.map((section) => (
          <div key={section.title} className="card">
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="split">
        <div className="card">
          <h3>Kit I rely on</h3>
          <ul>
            {gear.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>What’s next</h3>
          <ul>
            {plans.map((plan) => (
              <li key={plan}>{plan}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta">
        <div className="cta-card">
          <div>
            <p className="eyebrow">{cta.eyebrow}</p>
            <h3>{cta.title}</h3>
            <p>{cta.body}</p>
          </div>
          <a className="cta-button" href={cta.mailto}>Reach out</a>
        </div>
      </section>
    </div>
  );
}

export default Diving;
