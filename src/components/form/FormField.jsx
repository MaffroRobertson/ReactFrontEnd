import React from 'react';

function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
  className = '',
}) {
  const child = React.Children.only(children);
  const childProps = error
    ? { className: `${child.props.className || ''} error`.trim() }
    : {};

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={htmlFor || child.props.id || child.props.name}>
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      {React.cloneElement(child, childProps)}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default FormField;
