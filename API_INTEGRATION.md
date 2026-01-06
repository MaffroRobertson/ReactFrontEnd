# API Integration Guide

This document provides guidance on how to integrate your diving API with the Diving Log Manager UI.

## Current State

The UI currently stores data in local React state, which means:
- Data is lost when the page is refreshed
- Data is not shared between users or devices
- No persistent storage

## Integration Steps

### 1. Set Up API Endpoints

You'll need the following endpoints in your API:

#### Dives
- `POST /api/dives` - Create a new dive
- `GET /api/dives` - Get all dives
- `GET /api/dives/:id` - Get a specific dive
- `PUT /api/dives/:id` - Update a dive (optional)
- `DELETE /api/dives/:id` - Delete a dive (optional)

#### Dive Sites
- `POST /api/divesites` - Create a new dive site
- `GET /api/divesites` - Get all dive sites
- `GET /api/divesites/:id` - Get a specific dive site
- `PUT /api/divesites/:id` - Update a dive site (optional)
- `DELETE /api/divesites/:id` - Delete a dive site (optional)

### 2. Update the Diving.jsx Component

Find the TODO comments in `/src/pages/Diving.jsx` and replace them with actual API calls:

#### Example: Adding a Dive

```javascript
const handleDiveSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://your-api-url.com/api/dives', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Add authentication header if needed
        // 'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify(diveForm)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add dive');
    }
    
    const newDive = await response.json();
    setDives([...dives, newDive]);
    
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
    
    alert('Dive added successfully!');
  } catch (error) {
    console.error('Error adding dive:', error);
    alert('Failed to add dive. Please try again.');
  }
};
```

#### Example: Fetching Dives on Component Mount

Add this useEffect hook to fetch data when the component loads:

```javascript
import React, { useState, useEffect } from 'react';

function Diving() {
  // ... existing state

  useEffect(() => {
    fetchDives();
    fetchDiveSites();
  }, []);

  const fetchDives = async () => {
    try {
      const response = await fetch('https://your-api-url.com/api/dives');
      if (!response.ok) throw new Error('Failed to fetch dives');
      const data = await response.json();
      setDives(data);
    } catch (error) {
      console.error('Error fetching dives:', error);
    }
  };

  const fetchDiveSites = async () => {
    try {
      const response = await fetch('https://your-api-url.com/api/divesites');
      if (!response.ok) throw new Error('Failed to fetch dive sites');
      const data = await response.json();
      setDiveSites(data);
    } catch (error) {
      console.error('Error fetching dive sites:', error);
    }
  };

  // ... rest of component
}
```

### 3. Environment Variables

Store your API URL in an environment variable for security and flexibility:

Create a `.env` file in the root directory:
```
VITE_API_URL=https://your-api-url.com
```

Then use it in your code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;

const response = await fetch(`${API_URL}/api/dives`, {
  // ...
});
```

### 4. Error Handling

Add proper error handling for:
- Network failures
- API errors (4xx, 5xx status codes)
- Validation errors
- Authentication issues

### 5. Loading States

Consider adding loading indicators:

```javascript
const [isLoading, setIsLoading] = useState(false);

const handleDiveSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    // ... API call
  } catch (error) {
    // ... error handling
  } finally {
    setIsLoading(false);
  }
};

// In your JSX
<button type="submit" disabled={isLoading}>
  {isLoading ? 'Adding...' : 'Add Dive'}
</button>
```

### 6. Authentication

If your API requires authentication, you'll need to:
1. Add a login page/component
2. Store the auth token (in localStorage, sessionStorage, or a state management solution)
3. Include the token in API request headers
4. Handle token expiration and refresh

### 7. Testing

Test your integration with:
- Valid data
- Invalid data (to test validation)
- Network errors (disconnect internet)
- API errors (wrong endpoint URLs)

## Recommended Libraries

Consider using these libraries to simplify API integration:

- **Axios**: More feature-rich than fetch, better error handling
- **React Query** or **SWR**: Advanced data fetching, caching, and synchronization
- **Redux** or **Zustand**: If you need global state management

## Example with Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add authentication token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleDiveSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const { data } = await api.post('/api/dives', diveForm);
    setDives([...dives, data]);
    // ... reset form
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

## Additional Features to Consider

1. **Search and Filter**: Add ability to search/filter dives by date, site, depth, etc.
2. **Edit Functionality**: Allow users to edit existing dives and sites
3. **Delete Functionality**: Allow users to delete dives and sites
4. **Sorting**: Sort dives by date, depth, duration, etc.
5. **Pagination**: For large datasets
6. **Image Upload**: Add photos to dive logs
7. **Statistics Dashboard**: Show dive statistics (total dives, deepest dive, etc.)
8. **Export Data**: Export dive logs to CSV or PDF

## Support

For questions or issues with the UI, please open an issue on the GitHub repository.
For API-specific questions, consult your API documentation.
