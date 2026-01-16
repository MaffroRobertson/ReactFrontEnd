import React, { useState, useEffect } from 'react';
import '../styles/Diving.css';
import { login, fetchDives, fetchDiveSites, fetchExperienceLevels, createDiveSite, createDive } from '../utils/api';
import { ListHeader, EmptyState, ComboBox, Card, CardGrid, FormField, FormRow } from '../components';

function DiveLog() {
  const [dives, setDives] = useState([]);
  const [diveSites, setDiveSites] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [activeTab, setActiveTab] = useState('dives');
  const [showAddDiveForm, setShowAddDiveForm] = useState(false);
  const [showAddSiteForm, setShowAddSiteForm] = useState(false);
  const [showInlineSiteForm, setShowInlineSiteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [siteErrors, setSiteErrors] = useState({});
  const [diveErrors, setDiveErrors] = useState({});
  const [siteSearch, setSiteSearch] = useState('');
  
  const [diveForm, setDiveForm] = useState({
    diveSiteId: '',
    date: '',
    duration: '',
    maxDepth: '',
    notes: ''
  });

  const [siteForm, setSiteForm] = useState({
    name: '',
    location: '',
    experienceLevelId: '',
    description: ''
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await login();
        const results = await Promise.allSettled([
          fetchDives(),
          fetchDiveSites(),
          fetchExperienceLevels()
        ]);

        if (results[0].status === 'fulfilled') {
          setDives(results[0].value);
        } else {
          console.error('Failed to fetch dives:', results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          setDiveSites(results[1].value);
        } else {
          console.error('Failed to fetch dive sites:', results[1].reason);
        }

        if (results[2].status === 'fulfilled') {
          setExperienceLevels(results[2].value);
        } else {
          console.error('Failed to fetch experience levels:', results[2].reason);
        }

        if (
          results[0].status === 'rejected' &&
          results[1].status === 'rejected' &&
          results[2].status === 'rejected'
        ) {
          setError('Failed to fetch data from the server');
        }
      } catch (err) {
        console.error('Error initializing data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleDiveSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!diveForm.diveSiteId) errors.diveSiteId = 'Dive site is required';
    if (!diveForm.date) errors.date = 'Date is required';
    if (!diveForm.duration || Number(diveForm.duration) <= 0) errors.duration = 'Duration must be greater than 0';
    if (!diveForm.maxDepth || Number(diveForm.maxDepth) < 1 || Number(diveForm.maxDepth) > 500)
      errors.maxDepth = 'Max depth must be between 1 and 500';

    setDiveErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      diveSiteId: Number(diveForm.diveSiteId),
      date: diveForm.date,
      duration: Number(diveForm.duration),
      maxDepth: Number(diveForm.maxDepth),
      notes: diveForm.notes || '',
    };

    try {
      const newDive = await createDive(payload);
  setDives((prev) => [...prev, newDive]);
  setDiveForm({ diveSiteId: '', date: '', duration: '', maxDepth: '', notes: '' });
  setSiteSearch('');
  setDiveErrors({});
  setShowAddDiveForm(false);
  setShowInlineSiteForm(false);
      alert('Dive added successfully');
    } catch (submitError) {
      console.error('Error adding dive:', submitError);
      alert(`Failed to add dive: ${submitError.message}`);
    }
  };

  const validateAndSubmitSite = async (onSuccess) => {
    const errors = {};
    if (!siteForm.name.trim()) errors.name = 'Name is required';
    if (!siteForm.location.trim()) errors.location = 'Location is required';
    if (!siteForm.experienceLevelId) errors.experienceLevelId = 'Experience level is required';

    setSiteErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      name: siteForm.name,
      location: siteForm.location,
      experienceLevelId: Number(siteForm.experienceLevelId),
      description: siteForm.description || null,
    };

    try {
      const newSite = await createDiveSite(payload);
      setDiveSites((prev) => [...prev, newSite]);
      setSiteForm({
        name: '',
        location: '',
        experienceLevelId: '',
        description: ''
      });
      setSiteErrors({});
      onSuccess(newSite);
    } catch (submitError) {
      console.error('Error adding dive site:', submitError);
      alert(`Failed to add dive site: ${submitError.message}`);
    }
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    await validateAndSubmitSite(() => {
      setShowAddSiteForm(false);
      alert('Dive site added successfully');
    });
  };

  const handleDiveInputChange = (e) => {
    const { name, value } = e.target;
    setDiveForm((prev) => ({
      ...prev,
      [name]: value
    }));
    if (diveErrors[name]) {
      setDiveErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSiteInputChange = (e) => {
    const { name, value } = e.target;
    setSiteForm((prev) => ({
      ...prev,
      [name]: value
    }));
    if (siteErrors[name]) {
      setSiteErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const enrichDiveWithSiteInfo = (dive) => {
    const siteIdFromDive = dive.diveSiteId ?? dive.diveSite?.id ?? dive.siteId ?? dive.site?.id;
    const siteNameFromDive =
      typeof dive.diveSite === 'string'
        ? dive.diveSite
        : dive.diveSite?.name || dive.siteName || dive.site;

    if (!diveSites || diveSites.length === 0) {
      return { ...dive, siteName: siteNameFromDive || 'Unknown site' };
    }

    const site = diveSites.find((s) => {
      if (siteIdFromDive !== undefined && siteIdFromDive !== null) {
        return String(s.id) === String(siteIdFromDive);
      }
      if (siteNameFromDive) {
        return s.name?.toLowerCase() === siteNameFromDive.toLowerCase();
      }
      return false;
    });

    return {
      ...dive,
      siteName: site?.name || siteNameFromDive || 'Unknown site',
    };
  };

  const filteredDiveSites = siteSearch
    ? diveSites.filter((site) => site.name.toLowerCase().includes(siteSearch.toLowerCase().trim()))
    : diveSites;

  const handleSiteSelect = (site) => {
    setDiveForm((prev) => ({ ...prev, diveSiteId: site.id.toString() }));
    setSiteSearch(site.name);
    if (diveErrors.diveSiteId) {
      setDiveErrors((prev) => ({ ...prev, diveSiteId: undefined }));
    }
  };

  return (
    <div className="diving-page">
      <div className="diving-header">
        <h1>🤿 Dive Log</h1>
        <p>Track your dives and manage dive sites</p>
      </div>

      {isLoading && (
        <div className="loading-message">
          <p>Loading data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ Error: {error}</p>
          <p>Using local storage mode. Data will not be persisted to the server.</p>
        </div>
      )}

      <div className="tabs">
        <button 
          className={activeTab === 'dives' ? 'tab active' : 'tab'}
          onClick={() => { setActiveTab('dives'); setShowAddDiveForm(false); setShowInlineSiteForm(false); }}
        >
          Dives ({dives.length})
        </button>
        <button 
          className={activeTab === 'diveSites' ? 'tab active' : 'tab'}
          onClick={() => { setActiveTab('diveSites'); setShowAddSiteForm(false); setShowInlineSiteForm(false); }}
        >
          Dive Sites ({diveSites.length})
        </button>
      </div>

      <div className="tab-content">
        {isLoading ? (
          <div className="loading-state">
            <p>🌊 Loading diving data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dives' && (
              <div className="list-container">
                <ListHeader
                  title="Your Dives"
                  actionLabel={showAddDiveForm ? 'Close form' : 'Add Dive'}
                  onAction={() => setShowAddDiveForm((prev) => !prev)}
                />

                {showAddDiveForm && (
                  <div className="form-container" style={{ marginTop: '1.5rem' }}>
                    <form onSubmit={handleDiveSubmit}>
                      <FormField
                        label="Dive Site"
                        required
                        error={diveErrors.diveSiteId}
                        htmlFor="diveSiteId"
                      >
                        <div className="form-row" style={{ gridTemplateColumns: '1fr auto' }}>
                          <ComboBox
                            value={siteSearch}
                            onChange={(val) => {
                              setSiteSearch(val);
                              setDiveForm((prev) => ({ ...prev, diveSiteId: '' }));
                              if (diveErrors.diveSiteId) {
                                setDiveErrors((prev) => ({ ...prev, diveSiteId: undefined }));
                              }
                            }}
                            options={filteredDiveSites}
                            onSelect={handleSiteSelect}
                            placeholder="Search and select dive site..."
                            getKey={(site) => site.id}
                            getLabel={(site) => site.name}
                            getSubLabel={(site) => site.location}
                            error={diveErrors.diveSiteId}
                            inputProps={{ id: 'diveSiteId', name: 'diveSiteId' }}
                          />
                          <button
                            type="button"
                            className="submit-btn"
                            style={{ padding: '0.8rem 1rem', whiteSpace: 'nowrap' }}
                            onClick={() => setShowInlineSiteForm((prev) => !prev)}
                          >
                            {showInlineSiteForm ? 'Close new site' : 'Add new site'}
                          </button>
                        </div>
                      </FormField>

                      {showInlineSiteForm && (
                        <div className="nested-form">
                          <FormField
                            label="Site Name"
                            required
                            htmlFor="inline-name"
                            error={siteErrors.name}
                          >
                            <input
                              type="text"
                              id="inline-name"
                              name="name"
                              value={siteForm.name}
                              onChange={handleSiteInputChange}
                              placeholder="Enter site name"
                              required
                            />
                          </FormField>

                          <FormField
                            label="Location"
                            required
                            htmlFor="inline-location"
                            error={siteErrors.location}
                          >
                            <input
                              type="text"
                              id="inline-location"
                              name="location"
                              value={siteForm.location}
                              onChange={handleSiteInputChange}
                              placeholder="Country, Region"
                              required
                            />
                          </FormField>

                          <FormField
                            label="Experience Level"
                            required
                            htmlFor="inline-experienceLevelId"
                            error={siteErrors.experienceLevelId}
                          >
                            <select
                              id="inline-experienceLevelId"
                              name="experienceLevelId"
                              value={siteForm.experienceLevelId}
                              onChange={handleSiteInputChange}
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

                          <FormField
                            label="Description"
                            htmlFor="inline-description"
                          >
                            <textarea
                              id="inline-description"
                              name="description"
                              value={siteForm.description}
                              onChange={handleSiteInputChange}
                              placeholder="Describe the dive site..."
                              rows="3"
                            />
                          </FormField>

                          <button
                            type="button"
                            className="submit-btn"
                            onClick={async () => {
                              await validateAndSubmitSite((newSite) => {
                                setShowInlineSiteForm(false);
                                setDiveForm((prev) => ({ ...prev, diveSiteId: newSite.id?.toString() || '' }));
                                setSiteSearch(newSite.name || '');
                                alert('Dive site added and selected');
                              });
                            }}
                            style={{ marginTop: '0.5rem' }}
                          >
                            Save new site
                          </button>
                        </div>
                      )}

                      <FormField label="Date" required htmlFor="date" error={diveErrors.date}>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={diveForm.date}
                          onChange={handleDiveInputChange}
                          required
                        />
                      </FormField>

                      <FormRow>
                        <FormField label="Max Depth (m)" required htmlFor="maxDepth" error={diveErrors.maxDepth}>
                          <input
                            type="number"
                            id="maxDepth"
                            name="maxDepth"
                            value={diveForm.maxDepth}
                            onChange={handleDiveInputChange}
                            placeholder="0"
                            step="1"
                            min="1"
                            max="500"
                            required
                          />
                        </FormField>

                        <FormField label="Duration (min)" required htmlFor="duration" error={diveErrors.duration}>
                          <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={diveForm.duration}
                            onChange={handleDiveInputChange}
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
                          value={diveForm.notes}
                          onChange={handleDiveInputChange}
                          placeholder="Add any notes about the dive..."
                          rows="4"
                        />
                      </FormField>

                      <button type="submit" className="submit-btn">Add Dive</button>
                    </form>
                  </div>
                )}

                {dives.length === 0 ? (
                  <EmptyState
                    message="No dives logged yet."
                    hint={error ? 'Check API connection.' : 'Add your first dive!'}
                  />
                ) : (
                  <CardGrid>
                    {dives.map((dive) => {
                      const enrichedDive = enrichDiveWithSiteInfo(dive);
                      const diveDate = dive.date ? new Date(dive.date) : null;
                      const formattedDate = diveDate && !isNaN(diveDate.getTime())
                        ? diveDate.toLocaleDateString()
                        : 'Date not available';
                      return (
                        <Card key={dive.id} className="dive-card" title={enrichedDive.siteName}>
                          <div className="dive-details">
                            <p><strong>Date:</strong> {formattedDate}</p>
                            <p><strong>Max Depth:</strong> {dive.maxDepth}m</p>
                            <p><strong>Duration:</strong> {dive.duration} min</p>
                            {dive.notes && <p><strong>Notes:</strong> {dive.notes}</p>}
                          </div>
                        </Card>
                      );
                    })}
                  </CardGrid>
                )}
              </div>
            )}

            {activeTab === 'diveSites' && (
              <div className="list-container">
                <ListHeader
                  title="Dive Sites"
                  actionLabel={showAddSiteForm ? 'Close form' : 'Add Dive Site'}
                  onAction={() => setShowAddSiteForm((prev) => !prev)}
                />

                {showAddSiteForm && (
                  <div className="form-container" style={{ marginTop: '1.5rem' }}>
                    <form onSubmit={handleSiteSubmit}>
                      <FormField label="Site Name" required htmlFor="name" error={siteErrors.name}>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={siteForm.name}
                          onChange={handleSiteInputChange}
                          placeholder="Enter site name"
                          required
                        />
                      </FormField>

                      <FormField label="Location" required htmlFor="location" error={siteErrors.location}>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={siteForm.location}
                          onChange={handleSiteInputChange}
                          placeholder="Country, Region"
                          required
                        />
                      </FormField>

                      <FormField
                        label="Experience Level"
                        required
                        htmlFor="experienceLevelId"
                        error={siteErrors.experienceLevelId}
                      >
                        <select
                          id="experienceLevelId"
                          name="experienceLevelId"
                          value={siteForm.experienceLevelId}
                          onChange={handleSiteInputChange}
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
                          value={siteForm.description}
                          onChange={handleSiteInputChange}
                          placeholder="Describe the dive site..."
                          rows="4"
                        />
                      </FormField>

                      <button type="submit" className="submit-btn">Add Dive Site</button>
                    </form>
                  </div>
                )}

                {diveSites.length === 0 ? (
                  <EmptyState
                    message="No dive sites added yet."
                    hint={error ? 'Check API connection.' : 'Add your first site!'}
                  />
                ) : (
                  <CardGrid>
                    {diveSites.map((site) => {
                      const experienceLevelName = site.experienceLevel
                        ? (typeof site.experienceLevel === 'object' && site.experienceLevel.name
                          ? site.experienceLevel.name
                          : typeof site.experienceLevel === 'string' ? site.experienceLevel : 'Unknown')
                        : null;
                      return (
                        <Card key={site.id} className="dive-card" title={site.name}>
                          <div className="dive-details">
                            <p><strong>Location:</strong> {site.location}</p>
                            {experienceLevelName && (
                              <p><strong>Experience Level:</strong> {experienceLevelName}</p>
                            )}
                            {site.description && <p><strong>Description:</strong> {site.description}</p>}
                          </div>
                        </Card>
                      );
                    })}
                  </CardGrid>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DiveLog;
