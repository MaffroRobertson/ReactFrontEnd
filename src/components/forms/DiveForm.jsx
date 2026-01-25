import React from 'react';
import { FormField, FormRow } from '../index';

function DiveForm({ values, errors = {}, onChange, onSubmit, siteSelector, submitLabel = 'Add Dive', onDelete, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      {siteSelector}

      <FormField label="Date" required htmlFor="date" error={errors.date}>
        <input
          type="date"
          id="date"
          name="date"
          value={values.date}
          onChange={onChange}
          required
        />
      </FormField>

      <FormRow>
        <FormField label="Max Depth (m)" required htmlFor="maxDepth" error={errors.maxDepth}>
          <input
            type="number"
            id="maxDepth"
            name="maxDepth"
            value={values.maxDepth}
            onChange={onChange}
            placeholder="0"
            step="1"
            min="1"
            max="500"
            required
          />
        </FormField>

        <FormField label="Duration (min)" required htmlFor="duration" error={errors.duration}>
          <input
            type="number"
            id="duration"
            name="duration"
            value={values.duration}
            onChange={onChange}
            placeholder="0"
            min="1"
            step="1"
            required
          />
        </FormField>
      </FormRow>

      <FormField label="Notes" htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          value={values.notes}
          onChange={onChange}
          placeholder="Add any notes about the dive..."
          rows="4"
        />
      </FormField>

      <div className="form-actions">
        {onDelete && (
          <button type="button" className="delete-btn" onClick={onDelete}>
            Delete dive
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

export default DiveForm;
