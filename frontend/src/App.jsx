import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the server URL from the environment or use a default
    const apiUrl = 'http://localhost:5000/api/hello';
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
      });
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>Simple React App</h1>
      
      {error ? (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h2>Error:</h2>
          <p>{error}</p>
          <p>Make sure the Rails server is running on port 5000</p>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <h2>Message from API:</h2>
          <p style={{ 
            padding: '10px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '5px',
            fontSize: '18px'
          }}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;