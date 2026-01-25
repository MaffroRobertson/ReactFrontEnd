import React, { useState, useEffect } from 'react';
import '../styles/Diving.css';
import {
  login,
  fetchDives,
  fetchDiveSites,
  fetchExperienceLevels,
  createDiveSite,
  updateDiveSite,
  deleteDiveSite,
  createDive,
  updateDive,
  deleteDive,
} from '../utils/api';
import { ListHeader, EmptyState, ComboBox, Card, CardGrid, FormField, DiveSiteForm, DiveForm } from '../components';

function DiveLog() {
  const [dives, setDives] = useState([]);
  const [diveSites, setDiveSites] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [activeTab, setActiveTab] = useState('dives');
  const [showAddDiveForm, setShowAddDiveForm] = useState(false);
  const [showAddSiteForm, setShowAddSiteForm] = useState(false);
  const [showInlineSiteForm, setShowInlineSiteForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [editingDive, setEditingDive] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [siteErrors, setSiteErrors] = useState({});
  const [diveErrors, setDiveErrors] = useState({});
  const [siteSearch, setSiteSearch] = useState('');
  const [inlineSiteForm, setInlineSiteForm] = useState({
    name: '',
    location: '',
    experienceLevelId: '',
    description: '',
  });
  const [inlineSiteErrors, setInlineSiteErrors] = useState({});
  
  const emptyDiveForm = {
    diveSiteId: '',
    date: '',
    duration: '',
    maxDepth: '',
    notes: ''
  };

  const [diveForm, setDiveForm] = useState(emptyDiveForm);

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

  const resetDiveForm = () => {
    setEditingDive(null);
    setDiveForm(emptyDiveForm);
    setDiveErrors({});
    setSiteSearch('');
    setShowInlineSiteForm(false);
  };

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

    if (editingDive) {
      try {
        const updatedDive = await updateDive(editingDive.id, payload);
        const nextDive = updatedDive || { ...editingDive, ...payload };
        setDives((prev) => prev.map((d) => (String(d.id) === String(editingDive.id) ? { ...d, ...nextDive } : d)));
        resetDiveForm();
        setShowAddDiveForm(false);
        alert('Dive updated successfully');
      } catch (submitError) {
        console.error('Error updating dive:', submitError);
        alert(`Failed to update dive: ${submitError.message}`);
      }
      return;
    }

    try {
      const newDive = await createDive(payload);
      setDives((prev) => [...prev, newDive]);
      resetDiveForm();
      setShowAddDiveForm(false);
      alert('Dive added successfully');
    } catch (submitError) {
      console.error('Error adding dive:', submitError);
      alert(`Failed to add dive: ${submitError.message}`);
    }
  };

  const emptySiteForm = {
    name: '',
    location: '',
    experienceLevelId: '',
    description: ''
  };

  const resetSiteForm = () => {
    setEditingSite(null);
    setSiteForm(emptySiteForm);
    setSiteErrors({});
  };

  const buildSitePayload = () => {
    const errors = {};
    if (!siteForm.name.trim()) errors.name = 'Name is required';
    if (!siteForm.location.trim()) errors.location = 'Location is required';
    if (!siteForm.experienceLevelId) errors.experienceLevelId = 'Experience level is required';

    setSiteErrors(errors);
    if (Object.keys(errors).length > 0) return null;

    return {
      name: siteForm.name,
      location: siteForm.location,
      experienceLevelId: Number(siteForm.experienceLevelId),
      description: siteForm.description || null,
    };
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    const payload = buildSitePayload();
    if (!payload) return;

    if (editingSite) {
      try {
        const updatedSite = await updateDiveSite(editingSite.id, payload);
        const nextSite = updatedSite || { ...editingSite, ...payload };
        setDiveSites((prev) => prev.map((site) => (String(site.id) === String(editingSite.id) ? { ...site, ...nextSite } : site)));
        resetSiteForm();
        setShowAddSiteForm(false);
        alert('Dive site updated successfully');
      } catch (submitError) {
        console.error('Error updating dive site:', submitError);
        alert(`Failed to update dive site: ${submitError.message}`);
      }
      return;
    }

    try {
      const newSite = await createDiveSite(payload);
      setDiveSites((prev) => [...prev, newSite]);
      resetSiteForm();
      setShowAddSiteForm(false);
      alert('Dive site added successfully');
    } catch (submitError) {
      console.error('Error adding dive site:', submitError);
      alert(`Failed to add dive site: ${submitError.message}`);
    }
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

  const handleInlineSiteInputChange = (e) => {
    const { name, value } = e.target;
    setInlineSiteForm((prev) => ({ ...prev, [name]: value }));
    if (inlineSiteErrors[name]) {
      setInlineSiteErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const buildInlineSitePayload = () => {
    const errors = {};
    if (!inlineSiteForm.name.trim()) errors.name = 'Name is required';
    if (!inlineSiteForm.location.trim()) errors.location = 'Location is required';
    if (!inlineSiteForm.experienceLevelId) errors.experienceLevelId = 'Experience level is required';

    setInlineSiteErrors(errors);
    if (Object.keys(errors).length > 0) return null;

    return {
      name: inlineSiteForm.name,
      location: inlineSiteForm.location,
      experienceLevelId: Number(inlineSiteForm.experienceLevelId),
      description: inlineSiteForm.description || null,
    };
  };

  const resetInlineSiteForm = () => {
    setInlineSiteForm({ name: '', location: '', experienceLevelId: '', description: '' });
    setInlineSiteErrors({});
    setShowInlineSiteForm(false);
  };

  const handleInlineSiteSubmit = async (e) => {
    e.preventDefault();
    const payload = buildInlineSitePayload();
    if (!payload) return;

    try {
      const newSite = await createDiveSite(payload);
      setDiveSites((prev) => [...prev, newSite]);
      setDiveForm((prev) => ({ ...prev, diveSiteId: newSite.id?.toString() || prev.diveSiteId }));
      setSiteSearch(newSite.name || '');
      resetInlineSiteForm();
      alert('Dive site added and selected');
    } catch (submitError) {
      console.error('Error adding inline dive site:', submitError);
      alert(`Failed to add dive site: ${submitError.message}`);
    }
  };

  const startEditSite = (site) => {
    const derivedExperienceLevelId =
      site.experienceLevelId ??
      (typeof site.experienceLevel === 'object' && site.experienceLevel?.id ? site.experienceLevel.id : '') ??
      '';

    setSiteForm({
      name: site.name || '',
      location: site.location || '',
      experienceLevelId: derivedExperienceLevelId?.toString() || '',
      description: site.description || '',
    });
    setEditingSite(site);
    setSiteErrors({});
    setShowAddSiteForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelSiteForm = () => {
    resetSiteForm();
    setShowAddSiteForm(false);
  };

  const handleDeleteSite = async (siteId) => {
    const confirmed = window.confirm('Are you sure you want to delete this dive site? This cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteDiveSite(siteId);
      setDiveSites((prev) => prev.filter((site) => String(site.id) !== String(siteId)));
      if (editingSite && String(editingSite.id) === String(siteId)) {
        handleCancelSiteForm();
      }
      alert('Dive site deleted successfully');
    } catch (err) {
      console.error('Error deleting dive site:', err);
      alert(`Failed to delete dive site: ${err.message}`);
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

  const startEditDive = (dive) => {
    const enrichedDive = enrichDiveWithSiteInfo(dive);
    const siteId = dive.diveSiteId ?? dive.diveSite?.id ?? dive.siteId ?? dive.site?.id ?? '';
    setDiveForm({
      diveSiteId: siteId ? String(siteId) : '',
      date: dive.date ? dive.date.slice(0, 10) : '',
      duration: dive.duration ?? '',
      maxDepth: dive.maxDepth ?? '',
      notes: dive.notes || '',
    });
    setSiteSearch(enrichedDive.siteName || '');
    setEditingDive(dive);
    setDiveErrors({});
    setActiveTab('dives');
    setShowAddDiveForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelDiveForm = () => {
    resetDiveForm();
    setShowAddDiveForm(false);
  };

  const handleDeleteDive = async (diveId) => {
    const confirmed = window.confirm('Are you sure you want to delete this dive? This cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteDive(diveId);
      setDives((prev) => prev.filter((d) => String(d.id) !== String(diveId)));
      if (editingDive && String(editingDive.id) === String(diveId)) {
        handleCancelDiveForm();
      }
      alert('Dive deleted successfully');
    } catch (err) {
      console.error('Error deleting dive:', err);
      alert(`Failed to delete dive: ${err.message}`);
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
                    actionLabel={showAddDiveForm ? (editingDive ? 'Cancel edit' : 'Close form') : 'Add Dive'}
                    onAction={() => {
                      setShowAddDiveForm((prev) => {
                        const next = !prev;
                        if (!next) {
                          handleCancelDiveForm();
                        } else {
                          resetDiveForm();
                        }
                        return next;
                      });
                    }}
                />

                {showAddDiveForm && (
                  <div className="form-container" style={{ marginTop: '1.5rem' }}>
                      {editingDive ? <h3>Editing dive</h3> : <h3>Add a new dive</h3>}

                    {showInlineSiteForm && (
                      <div className="nested-form" style={{ marginTop: '0.75rem' }}>
                        <h4 style={{ marginTop: 0 }}>Quick add dive site</h4>
                        <DiveSiteForm
                          values={inlineSiteForm}
                          errors={inlineSiteErrors}
                          experienceLevels={experienceLevels}
                          onChange={handleInlineSiteInputChange}
                          onSubmit={handleInlineSiteSubmit}
                          submitLabel="Save site"
                          onCancel={resetInlineSiteForm}
                        />
                      </div>
                    )}

                    <DiveForm
                      values={diveForm}
                      errors={diveErrors}
                      onChange={handleDiveInputChange}
                      onSubmit={handleDiveSubmit}
                      submitLabel={editingDive ? 'Update Dive' : 'Add Dive'}
                      onDelete={editingDive ? () => handleDeleteDive(editingDive.id) : undefined}
                      onCancel={handleCancelDiveForm}
                      siteSelector={(
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
                      )}
                    />
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
                        <Card
                          key={dive.id}
                          className="dive-card"
                          title={enrichedDive.siteName}
                          actions={(
                            <>
                              <button
                                type="button"
                                className="icon-btn secondary-btn"
                                onClick={() => startEditDive(dive)}
                                aria-label="Edit dive"
                                title="Edit"
                              >
                                <span aria-hidden="true">✏️</span>
                              </button>
                              <button
                                type="button"
                                className="icon-btn delete-btn"
                                onClick={() => handleDeleteDive(dive.id)}
                                aria-label="Delete dive"
                                title="Delete"
                              >
                                <span aria-hidden="true">🗑️</span>
                              </button>
                            </>
                          )}
                        >
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
                  actionLabel={showAddSiteForm ? (editingSite ? 'Cancel edit' : 'Close form') : 'Add Dive Site'}
                  onAction={() => {
                    setShowAddSiteForm((prev) => {
                      const next = !prev;
                      resetSiteForm();
                      return next;
                    });
                  }}
                />

                {showAddSiteForm && (
                  <div className="form-container" style={{ marginTop: '1.5rem' }}>
                    {editingSite ? <h3>Editing: {editingSite.name}</h3> : <h3>Add a new dive site</h3>}
                    <DiveSiteForm
                      values={siteForm}
                      errors={siteErrors}
                      experienceLevels={experienceLevels}
                      onChange={handleSiteInputChange}
                      onSubmit={handleSiteSubmit}
                      submitLabel={editingSite ? 'Update Dive Site' : 'Add Dive Site'}
                      onDelete={editingSite ? () => handleDeleteSite(editingSite.id) : undefined}
                      onCancel={handleCancelSiteForm}
                    />
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
                        <Card
                          key={site.id}
                          className="dive-card"
                          title={site.name}
                          actions={(
                            <>
                              <button
                                type="button"
                                className="icon-btn secondary-btn"
                                onClick={() => startEditSite(site)}
                                aria-label="Edit dive site"
                                title="Edit"
                              >
                                <span aria-hidden="true">✏️</span>
                              </button>
                              <button
                                type="button"
                                className="icon-btn delete-btn"
                                onClick={() => handleDeleteSite(site.id)}
                                aria-label="Delete dive site"
                                title="Delete"
                              >
                                <span aria-hidden="true">🗑️</span>
                              </button>
                            </>
                          )}
                        >
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
