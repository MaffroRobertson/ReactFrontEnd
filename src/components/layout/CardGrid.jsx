import React from 'react';

function CardGrid({ className = '', children }) {
  return <div className={`cards-grid ${className}`.trim()}>{children}</div>;
}

export default CardGrid;
