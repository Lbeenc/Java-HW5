// src/Login.js
import React, { useState } from "react";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        // 401 or 403, etc.
        throw new Error("Invalid username or password");
      }

      const data = await response.json();

      // Adjust "data.jwt" if your backend uses a different property name.
      if (!data.jwt) {
        throw new Error("No JWT found in response");
      }

      onLoginSuccess(data.jwt, username);
      setPassword("");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>
        </div>

        {errorMsg && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{errorMsg}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <p>Test users (from hw3):</p>
        <ul>
          <li>user / user</li>
          <li>admin / admin</li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
