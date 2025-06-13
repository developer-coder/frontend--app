import React, { useEffect, useState } from 'react';
import keycloak from './keycloak';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (keycloak.authenticated) {
      fetch("http://localhost:4323/api/hello", {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
           "Content-Type": "application/json"
        }
      })
      .then(response => {
        if (!response.ok) throw new Error("Backend request failed");
        return response.text();
      })
      .then(data => setMessage(data))
      .catch(async error => {
  if (error instanceof Response) {
    const errorText = await error.text();
    console.error("API error response:", error.status, error.statusText, errorText);
  } else {
    console.error("Unexpected error:", error);
  }
  setMessage("Error contacting backend");
});
    }
  }, []);

  return (
    <div>
      <h1>Hello {keycloak.tokenParsed?.preferred_username}</h1>
      <p>{message}</p>
      <button onClick={() => keycloak.logout()}>Logout</button>
    </div>
  );
};

export default App;
