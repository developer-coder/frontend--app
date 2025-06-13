import React, { useState } from "react";
import { Link} from "react-router-dom";


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

//const navigate = useNavigate(); // used to navigate after login

  const validateInputs = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      const text = await response.text();

      if (response.ok) {
        setMessage("✅ Login successful");
        // Navigate to product page after 1 second
       
		setTimeout(() => {
    const productPort = 3002;
    const targetUrl = `${window.location.protocol}//${window.location.hostname}:${productPort}`;
    window.location.href = targetUrl;
      } else {
        setMessage(`❌ ${text}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {usernameError && <div style={{ color: "red" }}>{usernameError}</div>}
      <br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
      <br /><br />
      <button onClick={handleLogin}>Login</button>
      <br /><br />
      {message && <div>{message}</div>}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
