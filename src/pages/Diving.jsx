import React, { useState, useEffect } from 'react';
import '../styles/Diving.css';
import { login, fetchDives, fetchDiveSites } from '../utils/apiService';

function Diving() {
  const [dives, setDives] = useState([]);
  const [diveSites, setDiveSites] = useState([]);
  const [activeTab, setActiveTab] = useState('addDive');
  const [isLoading, setIsLoading] = useState(true);
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

  // Effect to handle authentication and initial data fetching
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Login to get authentication token
        await login();
        
        // Fetch dives and dive sites
        const [divesData, sitesData] = await Promise.all([
          fetchDives(),
          fetchDiveSites()
        ]);
        
        setDives(divesData);
        setDiveSites(sitesData);
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
    
    // TODO: Replace with your actual API endpoint
    // Example: const response = await fetch('YOUR_API_ENDPOINT/dives', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(diveForm)
    // });
    
    // For now, just add to local state
    setDives([...dives, { ...diveForm, id: Date.now() }]);
    
    // Reset form
    setDiveForm({
      date: '',
      site: '',
      depth: '',
      duration: '',
      temperature: '',
      visibility: '',
      notes: ''
    });
    
    alert('Dive added successfully! (Connect to your API for persistent storage)');
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    
    // TODO: Replace with your actual API endpoint
    // Example: const response = await fetch('YOUR_API_ENDPOINT/divesites', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(siteForm)
    // });
    
    // For now, just add to local state
    setDiveSites([...diveSites, { ...siteForm, id: Date.now() }]);
    
    // Reset form
    setSiteForm({
      name: '',
      location: '',
      maxDepth: '',
      description: '',
      coordinates: ''
    });
    
    alert('Dive site added successfully! (Connect to your API for persistent storage)');
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
      </div>

      <div className="tab-content">
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

        {activeTab === 'viewDives' && (
          <div className="list-container">
            <h2>Your Dives</h2>
            {dives.length === 0 ? (
              <p className="empty-state">No dives logged yet. Add your first dive!</p>
            ) : (
              <div className="cards-grid">
                {dives.map((dive) => (
                  <div key={dive.id} className="dive-card">
                    <h3>{dive.site}</h3>
                    <div className="dive-details">
                      <p><strong>Date:</strong> {dive.date}</p>
                      <p><strong>Max Depth:</strong> {dive.depth}m</p>
                      <p><strong>Duration:</strong> {dive.duration} min</p>
                      {dive.temperature && <p><strong>Temperature:</strong> {dive.temperature}°C</p>}
                      {dive.visibility && <p><strong>Visibility:</strong> {dive.visibility}m</p>}
                      {dive.notes && <p><strong>Notes:</strong> {dive.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'viewSites' && (
          <div className="list-container">
            <h2>Dive Sites</h2>
            {diveSites.length === 0 ? (
              <p className="empty-state">No dive sites added yet. Add your first site!</p>
            ) : (
              <div className="cards-grid">
                {diveSites.map((site) => (
                  <div key={site.id} className="dive-card">
                    <h3>{site.name}</h3>
                    <div className="dive-details">
                      <p><strong>Location:</strong> {site.location}</p>
                      <p><strong>Max Depth:</strong> {site.maxDepth}m</p>
                      {site.coordinates && <p><strong>Coordinates:</strong> {site.coordinates}</p>}
                      {site.description && <p><strong>Description:</strong> {site.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="api-note">
        <h3>🔧 API Integration</h3>
        <p>
          This UI is ready for your API integration. Update the fetch calls in the component
          to connect to your diving API endpoints for persistent data storage.
        </p>
        <ul>
          <li>POST endpoint for adding dives</li>
          <li>POST endpoint for adding dive sites</li>
          <li>GET endpoints for retrieving dives and sites</li>
          <li>Optional: PUT/DELETE endpoints for editing and removing entries</li>
        </ul>
      </div>
    </div>
  );
}

export default Diving;
