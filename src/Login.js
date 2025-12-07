import React, { useState } from "react";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();

      // ⚠️ Adjust the property name if your backend uses something else.
      // e.g., data.token or data.jwtToken
      const token = data.jwt || data.token || data.jwtToken;
      if (!token) {
        throw new Error("JWT not found in response");
      }

      onLoginSuccess(token, username);
      setPassword("");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="username">
            Username:
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password">
            Password:
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8 }}
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
        <p>Test accounts (from hw3):</p>
        <ul>
          <li>user / user</li>
          <li>admin / admin</li>
        </ul>
      </div>
    </div>
  );
}

export default Login;

