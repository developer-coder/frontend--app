import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import keycloak from "./keycloak";

function AdminLoginPage() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [roles, setRoles] = useState([]);

  const requiredRole = "admin-login-access";

  useEffect(() => {
    if (keycloak.authenticated) {
      const preferredUsername = keycloak.tokenParsed?.preferred_username || "Unknown";
      const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
      setUsername(preferredUsername);
      setRoles(userRoles);
    }
  }, []);

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const fetchAdminProfile = async () => {
    if (roles.includes(requiredRole)) {
      setTimeout(() => {
        const productPort = 3000;
        const targetUrl = `${window.location.protocol}//${window.location.hostname}:${productPort}`;
        window.location.href = targetUrl;
      }, 1000);
    } else {
      setMessage("Access denied: You do not have permission to view this page.");
    }
  };

  if (keycloak.authenticated && !roles.includes(requiredRole)) {
    return (
      <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", color: "red" }}>
        <h2>Unauthorized</h2>
        <p>Sorry, you do not have permission to access the admin panel.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {keycloak.authenticated ? (
        <>
          <p><strong>Username:</strong> {username}</p>

          <div style={{ marginBottom: "10px", color: "green" }}>{message}</div>

          {roles.includes(requiredRole) && (
            <>
              <button onClick={fetchAdminProfile}>Add Product and Fetch Product List</button>
              <br /><br />
            </>
          )}

          <button onClick={handleLogout}>Logout</button>

          {products.length > 0 && (
            <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <button onClick={handleLogin}>Login with Keycloak</button>
      )}

      <br /><br />
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default AdminLoginPage;
