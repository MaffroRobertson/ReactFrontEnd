import React from 'react';

function ListHeader({ title, actionLabel, onAction, actionProps = {}, children }) {
  return (
    <div className="list-header">
      <h2>{title}</h2>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {children}
        {actionLabel && (
          <button type="button" className="submit-btn" onClick={onAction} {...actionProps}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default ListHeader;
