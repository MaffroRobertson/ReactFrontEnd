import React from 'react';
import { FormField } from '../index';

function DiveSiteForm({
  values,
  errors = {},
  experienceLevels = [],
  onChange,
  onSubmit,
  submitLabel = 'Save',
  onDelete,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit}>
      <FormField label="Site Name" required htmlFor="name" error={errors.name}>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Enter site name"
          required
        />
      </FormField>

      <FormField label="Location" required htmlFor="location" error={errors.location}>
        <input
          type="text"
          id="location"
          name="location"
          value={values.location}
          onChange={onChange}
          placeholder="Country, Region"
          required
        />
      </FormField>

      <FormField
        label="Experience Level"
        required
        htmlFor="experienceLevelId"
        error={errors.experienceLevelId}
      >
        <select
          id="experienceLevelId"
          name="experienceLevelId"
          value={values.experienceLevelId}
          onChange={onChange}
          required
        >
          <option value="">Select experience level</option>
          {experienceLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={onChange}
          placeholder="Describe the dive site..."
          rows="4"
        />
      </FormField>
      <div className="form-actions">
        {onDelete && (
          <button type="button" className="delete-btn" onClick={onDelete}>
            Delete dive site
          </button>
        )}

        <div className="action-buttons">
          {onCancel && (
            <button type="button" className="secondary-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="submit-btn">{submitLabel}</button>
        </div>
      </div>
    </form>
  );
}

export default DiveSiteForm;
