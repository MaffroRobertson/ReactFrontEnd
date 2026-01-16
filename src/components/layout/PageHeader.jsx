import React from 'react';

function PageHeader({ title, subtitle, eyebrow, className = '' }) {
  return (
    <div className={`page-header ${className}`.trim()}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </div>
  );
}

export default PageHeader;
