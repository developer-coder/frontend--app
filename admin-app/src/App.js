// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLoginPage from "./AdminLoginPage";
import AdminRegisterPage from "./AdminRegisterPage";
import keycloak from "./keycloak";


function App() {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      keycloak
        .init({
           onLoad: "check-sso",
          checkLoginIframe: false,
         //  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
        })
        .then((auth) => {
          console.log("Authenticated:", auth);
          setAuthenticated(auth);
          setInitialized(true);
        })
        .catch((err) => {
          console.error("Keycloak init error:", err);
        });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, []);

    const handleLogin = () => {
    keycloak.login(); // redirect to Keycloak login page
  };

 
  if (!initialized) {
    return <div>Initializing Keycloak...</div>;
  }

  if (!authenticated) {
    return(
     <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Welcome to Admin Panel</h2>
        <p>You need to log in to continue.</p>
        <button onClick={handleLogin}>Login</button>
      </div>
      );
  }

  return (
    
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/register" element={<AdminRegisterPage />} />
       
      </Routes>
    
  );
}

export default App; // ✅ This was missing!
