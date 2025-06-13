// src/CustomLoginPage.js
import React from "react";
import keycloak from "./keycloak";


const CustomLoginPage = () => {
  const login = () => {
    keycloak.login(); // redirect to Keycloak login
  };

  return (
    <div className="login-container">
      <h1>Welcome to My App</h1>
      <p>Secure login with Keycloak</p>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default CustomLoginPage;
