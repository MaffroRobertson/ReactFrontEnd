import React from 'react';

function Card({ title, subtitle, className = '', children, footer, headingLevel = 'h2' }) {
  const HeadingTag = headingLevel;
  return (
    <div className={`card ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <HeadingTag>{title}</HeadingTag>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

export default Card;
