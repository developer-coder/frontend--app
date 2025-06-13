import React, { useState } from "react";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      return "Username is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!role.trim()) {
      return "Role is required";
    }
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
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, email, role }),
        credentials: "include"
      });

      const text = await response.text();

      if (response.ok) {
        setMessageType("success");
        setMessage(text);
        setUsername("");
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

  return (
    <div style={{ margin: "50px auto", width: "300px", textAlign: "center" }}>
      <h2>User Registration</h2>
      <input
        type="text"
        placeholder="Username" value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
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
      >
        Register
      </button>
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

export default RegisterPage;
