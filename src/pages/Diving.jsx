import React from 'react';
import '../styles/DivingInfo.css';
import { divingInfo } from '../data/diving';
import { Card, CardGrid, PageHeader } from '../components';

function Diving() {
  const { hero, highlights, gear, plans, cta } = divingInfo;

  return (
    <div className="diving-info-page">
      <header className="hero">
        <div className="hero-text">
          <PageHeader eyebrow={hero.eyebrow} title={hero.title} subtitle={hero.lede} className="hero-text" />
        </div>
        <Card className="hero-card" title="At a glance">
          <ul>
            {hero.atAGlance.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.value}
              </li>
            ))}
          </ul>
        </Card>
      </header>

      <section className="grid">
        <CardGrid className="grid">
          {highlights.map((section) => (
            <Card key={section.title} title={section.title}>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </CardGrid>
      </section>

      <section className="split">
        <CardGrid className="split">
          <Card title="Kit I rely on">
            <ul>
              {gear.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
          <Card title="What’s next">
            <ul>
              {plans.map((plan) => (
                <li key={plan}>{plan}</li>
              ))}
            </ul>
          </Card>
        </CardGrid>
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
