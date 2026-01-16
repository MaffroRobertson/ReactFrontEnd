import React from 'react';

function EmptyState({ message, hint }) {
  return (
    <p className="empty-state">
      {message}
      {hint ? ` ${hint}` : ''}
    </p>
  );
}

export default EmptyState;
