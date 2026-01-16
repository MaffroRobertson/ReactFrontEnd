import React, { useState, useEffect } from 'react';
import '../styles/Diving.css';
import { login, fetchDives, fetchDiveSites, fetchExperienceLevels, createDiveSite } from '../utils/api';

function DiveLog() {
  const [dives, setDives] = useState([]);
  const [diveSites, setDiveSites] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [activeTab, setActiveTab] = useState('dives');
  const [showAddDiveForm, setShowAddDiveForm] = useState(false);
  const [showAddSiteForm, setShowAddSiteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [siteErrors, setSiteErrors] = useState({});
  
  const [diveForm, setDiveForm] = useState({
    date: '',
    site: '',
    depth: '',
    duration: '',
    temperature: '',
    visibility: '',
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
    alert('Add dive functionality requires POST endpoint implementation on the API side.');
    // TODO: Implement POST to API_ENDPOINTS.dives when backend is ready
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
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
      alert('Dive site added successfully');
    } catch (submitError) {
      console.error('Error adding dive site:', submitError);
      alert(`Failed to add dive site: ${submitError.message}`);
    }
  };

  const handleDiveInputChange = (e) => {
    setDiveForm({
      ...diveForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSiteInputChange = (e) => {
    const { name, value } = e.target;
    setSiteForm((prev) => ({
      ...prev,
      [name]: name === 'experienceLevelId' ? value : value
    }));
    if (siteErrors[name]) {
      setSiteErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const enrichDiveWithSiteInfo = (dive) => {
    if (!diveSites || diveSites.length === 0) return { ...dive, siteName: dive.site || 'Unknown site' };
    const site = diveSites.find((s) => s.id === dive.diveSiteId || s.name === dive.site);
    return {
      ...dive,
      siteName: site?.name || dive.site || 'Unknown site',
    };
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
          onClick={() => { setActiveTab('dives'); setShowAddDiveForm(false); }}
        >
          Dives ({dives.length})
        </button>
        <button 
          className={activeTab === 'diveSites' ? 'tab active' : 'tab'}
          onClick={() => { setActiveTab('diveSites'); setShowAddSiteForm(false); }}
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
                <div className="list-header">
                  <h2>Your Dives</h2>
                  <button type="button" className="submit-btn" onClick={() => setShowAddDiveForm((prev) => !prev)}>
                    {showAddDiveForm ? 'Close form' : 'Add Dive'}
                  </button>
                </div>

                {showAddDiveForm && (
                  <div className="form-container" style={{ marginTop: '1.5rem' }}>
                    <form onSubmit={handleDiveSubmit}>
                      <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={diveForm.date}
                          onChange={handleDiveInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="site">Dive Site</label>
                        <input
                          type="text"
                          id="site"
                          name="site"
                          value={diveForm.site}
                          onChange={handleDiveInputChange}
                          placeholder="Enter dive site name"
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="depth">Max Depth (m)</label>
                          <input
                            type="number"
                            id="depth"
                            name="depth"
                            value={diveForm.depth}
                            onChange={handleDiveInputChange}
                            placeholder="0"
                            step="0.1"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="duration">Duration (min)</label>
                          <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={diveForm.duration}
                            onChange={handleDiveInputChange}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="temperature">Water Temp (°C)</label>
                          <input
                            type="number"
                            id="temperature"
                            name="temperature"
                            value={diveForm.temperature}
                            onChange={handleDiveInputChange}
                            placeholder="0"
                            step="0.1"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="visibility">Visibility (m)</label>
                          <input
                            type="number"
                            id="visibility"
                            name="visibility"
                            value={diveForm.visibility}
                            onChange={handleDiveInputChange}
                            placeholder="0"
                            step="0.1"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={diveForm.notes}
                          onChange={handleDiveInputChange}
                          placeholder="Add any notes about the dive..."
                          rows="4"
                        />
                      </div>

                      <button type="submit" className="submit-btn">Add Dive</button>
                    </form>
                  </div>
                )}

                {dives.length === 0 ? (
                  <p className="empty-state">No dives logged yet. {error ? 'Check API connection.' : 'Add your first dive!'}</p>
                ) : (
                  <div className="cards-grid">
                    {dives.map((dive) => {
                      const enrichedDive = enrichDiveWithSiteInfo(dive);
                      const diveDate = dive.date ? new Date(dive.date) : null;
                      const formattedDate = diveDate && !isNaN(diveDate.getTime()) 
                        ? diveDate.toLocaleDateString() 
                        : 'Date not available';
                      return (
                        <div key={dive.id} className="dive-card">
                          <h3>{enrichedDive.siteName}</h3>
                          <div className="dive-details">
                            <p><strong>Date:</strong> {formattedDate}</p>
                            <p><strong>Max Depth:</strong> {dive.maxDepth}m</p>
                            <p><strong>Duration:</strong> {dive.duration} min</p>
                            {dive.notes && <p><strong>Notes:</strong> {dive.notes}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'diveSites' && (
              <div className="list-container">
                <div className="list-header">
                  <h2>Dive Sites</h2>
                  <button type="button" className="submit-btn" onClick={() => setShowAddSiteForm((prev) => !prev)}>
                    {showAddSiteForm ? 'Close form' : 'Add Dive Site'}
                  </button>
                </div>

                {showAddSiteForm && (
                  <div className="form-container" style={{ marginTop: '1.5rem' }}>
                    <form onSubmit={handleSiteSubmit}>
                      <div className="form-group">
                        <label htmlFor="name">Site Name <span className="required-asterisk">*</span></label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={siteForm.name}
                          onChange={handleSiteInputChange}
                          placeholder="Enter site name"
                          required
                          className={siteErrors.name ? 'error' : ''}
                        />
                        {siteErrors.name && <p className="error-text">{siteErrors.name}</p>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="location">Location <span className="required-asterisk">*</span></label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={siteForm.location}
                          onChange={handleSiteInputChange}
                          placeholder="Country, Region"
                          required
                          className={siteErrors.location ? 'error' : ''}
                        />
                        {siteErrors.location && <p className="error-text">{siteErrors.location}</p>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="experienceLevelId">Experience Level <span className="required-asterisk">*</span></label>
                        <select
                          id="experienceLevelId"
                          name="experienceLevelId"
                          value={siteForm.experienceLevelId}
                          onChange={handleSiteInputChange}
                          required
                          className={siteErrors.experienceLevelId ? 'error' : ''}
                        >
                          <option value="">Select experience level</option>
                          {experienceLevels.map((level) => (
                            <option key={level.id} value={level.id}>
                              {level.name}
                            </option>
                          ))}
                        </select>
                        {siteErrors.experienceLevelId && <p className="error-text">{siteErrors.experienceLevelId}</p>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          value={siteForm.description}
                          onChange={handleSiteInputChange}
                          placeholder="Describe the dive site..."
                          rows="4"
                        />
                      </div>

                      <button type="submit" className="submit-btn">Add Dive Site</button>
                    </form>
                  </div>
                )}

                {diveSites.length === 0 ? (
                  <p className="empty-state">No dive sites added yet. {error ? 'Check API connection.' : 'Add your first site!'}</p>
                ) : (
                  <div className="cards-grid">
                    {diveSites.map((site) => {
                      const experienceLevelName = site.experienceLevel 
                        ? (typeof site.experienceLevel === 'object' && site.experienceLevel.name 
                          ? site.experienceLevel.name 
                          : typeof site.experienceLevel === 'string' ? site.experienceLevel : 'Unknown')
                        : null;
                      return (
                        <div key={site.id} className="dive-card">
                          <h3>{site.name}</h3>
                          <div className="dive-details">
                            <p><strong>Location:</strong> {site.location}</p>
                            {experienceLevelName && (
                              <p><strong>Experience Level:</strong> {experienceLevelName}</p>
                            )}
                            {site.description && <p><strong>Description:</strong> {site.description}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
