import React, { useState } from 'react';

function ComboBox({
  value,
  onChange,
  options = [],
  onSelect,
  placeholder = 'Search...',
  getKey = (item) => item?.id ?? item?.value ?? item?.label ?? String(item),
  getLabel = (item) => item?.name ?? item?.label ?? String(item),
  getSubLabel,
  error,
  inputProps = {},
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onSelect?.(option);
    setIsOpen(false);
  };

  return (
    <div className="combo-container">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        placeholder={placeholder}
        autoComplete="off"
        className={`combo-input ${error ? 'error' : ''}`}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        {...inputProps}
      />
      {isOpen && options.length > 0 && (
        <div className="combo-list" role="listbox">
          {options.map((option) => (
            <button
              key={getKey(option)}
              type="button"
              className="combo-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(option)}
            >
              <div className="combo-item-title">{getLabel(option)}</div>
              {getSubLabel && <div className="combo-item-sub">{getSubLabel(option)}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComboBox;
