import React from 'react';

function FormRow({ children, className = '' }) {
  return <div className={`form-row ${className}`.trim()}>{children}</div>;
}

export default FormRow;
