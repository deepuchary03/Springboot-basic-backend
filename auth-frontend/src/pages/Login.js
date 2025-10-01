import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiRequest } from "../api/config";
import "./Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Login response:", data);
        
        // Store the JWT token
        localStorage.setItem("authToken", data.token);
        
        setMessage("Login successful! Redirecting...");
        setMessageType("success");
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMessage("Invalid username or password");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              className="auth-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <input
              className="auth-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={
                messageType === "error" ? "error-message" : "success-message"
              }
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className={`auth-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="auth-link">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
