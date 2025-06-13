import React, { useState, useEffect } from "react";
import keycloak from "./keycloak"; // Ensure you have this file configured correctly

function AdminRegisterPage() {
  const [adminName, setadminName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (keycloak.authenticated) {
      setAuthenticated(true);
    }
  }, []);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!adminName.trim()) return "Admin name is required";
    if (!emailRegex.test(email)) return "Enter a valid email address";
    if (password.length < 6) return "Password must be at least 6 characters long";
    if (!role.trim()) return "Role is required";

    return null;
  };

  const handleRegister = async () => {
    const error = validateInputs();
    if (error) {
      setMessageType("error");
      setMessage(error);
      return;
    }

    try {
      const token = keycloak.token;
      if (!token) {
        setMessageType("error");
        setMessage("You must be logged in to register an admin.");
        return;
      }

      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminName, password, email, role })
      });

      const text = await response.text();

      if (response.ok) {
        setMessageType("success");
        setMessage(text);
        setadminName("");
        setPassword("");
        setEmail("");
        setRole("");
      } else {
        setMessageType("error");
        setMessage(text);
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Registration failed. Please try again.");
    }
  };

  const handleLogin = () => keycloak.login();
  const handleLogout = () => keycloak.logout({ redirectUri: window.location.origin });

  return (
    <div style={{ margin: "50px auto", width: "300px", textAlign: "center" }}>
      <h2>Admin Registration</h2>

      {!authenticated && (
        <button onClick={handleLogin} style={{ marginBottom: "20px" }}>
          Login with Keycloak to Register Admin
        </button>
      )}

      <input
        type="text"
        placeholder="Admin Name"
        value={adminName}
        onChange={(e) => setadminName(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        disabled={!authenticated}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        disabled={!authenticated}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        disabled={!authenticated}
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        disabled={!authenticated}
      />
      <button
        onClick={handleRegister}
        style={{
          padding: "10px",
          width: "100%",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
        disabled={!authenticated}
      >
        Register
      </button>

      {authenticated && (
        <button
          onClick={handleLogout}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      )}

      {message && (
        <div
          style={{
            marginTop: "15px",
            color: messageType === "success" ? "green" : "red",
            fontWeight: "bold"
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default AdminRegisterPage;
