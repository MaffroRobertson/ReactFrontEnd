import React from 'react';

function Card({ title, subtitle, className = '', children, footer, actions }) {
  const classes = [`card`, className, actions ? 'has-actions' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3>{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
}

export default Card;
