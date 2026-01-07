import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import '../styles/Diving.css';

function Diving() {
  const [dives, setDives] = useState([]);
  const [diveSites, setDiveSites] = useState([]);
  const [activeTab, setActiveTab] = useState('viewDives');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states for adding dives
  const [diveForm, setDiveForm] = useState({
    date: '',
    site: '',
    depth: '',
    duration: '',
    temperature: '',
    visibility: '',
    notes: ''
  });

  // Form states for adding dive sites
  const [siteForm, setSiteForm] = useState({
    name: '',
    location: '',
    maxDepth: '',
    description: '',
    coordinates: ''
  });

  // Fetch dives and dive sites on component mount
  useEffect(() => {
    fetchDives();
    fetchDiveSites();
  }, []);

  const fetchDives = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.dives);
      if (!response.ok) {
        throw new Error(`Failed to fetch dives: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setDives(data);
    } catch (error) {
      console.error('Error fetching dives:', error);
      setError(`Failed to load dives: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDiveSites = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.diveSites);
      if (!response.ok) {
        throw new Error(`Failed to fetch dive sites: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setDiveSites(data);
    } catch (error) {
      console.error('Error fetching dive sites:', error);
      setError(`Failed to load dive sites: ${error.message}`);
    }
  };

  // Helper function to get dive site name by ID
  const getDiveSiteName = (diveSiteId) => {
    const site = diveSites.find(s => s.id === diveSiteId);
    return site ? site.name : 'Unknown Site';
  };

  // Helper function to enrich dive with dive site information
  const enrichDiveWithSiteInfo = (dive) => {
    // If the dive already has diveSite populated, use it
    if (dive.diveSite && dive.diveSite.name) {
      return { ...dive, siteName: dive.diveSite.name };
    }
    // Otherwise, look it up from diveSites array
    return { ...dive, siteName: getDiveSiteName(dive.diveSiteId) };
  };

  const handleDiveSubmit = async (e) => {
    e.preventDefault();
    alert('Add dive functionality requires POST endpoint implementation on the API side.');
    // TODO: Implement POST to API_ENDPOINTS.dives when backend is ready
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    alert('Add dive site functionality requires POST endpoint implementation on the API side.');
    // TODO: Implement POST to API_ENDPOINTS.diveSites when backend is ready
  };

  const handleDiveInputChange = (e) => {
    setDiveForm({
      ...diveForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSiteInputChange = (e) => {
    setSiteForm({
      ...siteForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="diving-page">
      <div className="diving-header">
        <h1>🤿 Diving Log Manager</h1>
        <p>Track your dives and manage dive sites</p>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <p>Make sure the Diving API is running at http://localhost:5093</p>
        </div>
      )}

      <div className="tabs">
        <button 
          className={activeTab === 'viewDives' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('viewDives')}
        >
          View Dives ({dives.length})
        </button>
        <button 
          className={activeTab === 'viewSites' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('viewSites')}
        >
          View Sites ({diveSites.length})
        </button>
        <button 
          className={activeTab === 'addDive' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('addDive')}
        >
          Add Dive
        </button>
        <button 
          className={activeTab === 'addSite' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('addSite')}
        >
          Add Dive Site
        </button>
      </div>

      <div className="tab-content">
        {isLoading ? (
          <div className="loading-state">
            <p>🌊 Loading diving data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'viewDives' && (
              <div className="list-container">
                <h2>Your Dives</h2>
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

            {activeTab === 'viewSites' && (
              <div className="list-container">
                <h2>Dive Sites</h2>
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
        {activeTab === 'addDive' && (
          <div className="form-container">
            <h2>Add New Dive</h2>
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

        {activeTab === 'addSite' && (
          <div className="form-container">
            <h2>Add New Dive Site</h2>
            <form onSubmit={handleSiteSubmit}>
              <div className="form-group">
                <label htmlFor="name">Site Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={siteForm.name}
                  onChange={handleSiteInputChange}
                  placeholder="Enter site name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={siteForm.location}
                  onChange={handleSiteInputChange}
                  placeholder="Country, Region"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxDepth">Maximum Depth (m)</label>
                <input
                  type="number"
                  id="maxDepth"
                  name="maxDepth"
                  value={siteForm.maxDepth}
                  onChange={handleSiteInputChange}
                  placeholder="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="coordinates">GPS Coordinates</label>
                <input
                  type="text"
                  id="coordinates"
                  name="coordinates"
                  value={siteForm.coordinates}
                  onChange={handleSiteInputChange}
                  placeholder="e.g., 25.7617° N, 80.1918° W"
                />
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
      </div>
    </div>
  );
}

export default Diving;
