import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Login() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const resetForm = () => setForm({ name: "", email: "", password: "" });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setMsg("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      console.log("Attempting:", isLogin ? "login" : "signup", "with data:", { 
        name: form.name, 
        email: form.email, 
        password: form.password ? "***" : "missing" 
      });

      const res = await fetch(
        `${API_BASE}/api/auth/${isLogin ? "login" : "signup"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("Success response:", data);
      
      if (!data.user) {
        throw new Error("No user data received");
      }
      
      login(data.user);
      setMsg(isLogin ? "Login successful!" : "Signup successful!");
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1100);
    } catch (err) {
      console.error("Login/Signup error:", err);
      setMsg(err.message || "Network error - please try again");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className={`card${isLogin ? "" : " flipped"}`}>
        {/* Login page */}
        <div className="card-face card-front">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} autoComplete="on">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {msg && isLogin && <p className="error-msg">{msg}</p>}
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => {
                setIsLogin(false);
                setMsg("");
                resetForm();
              }}
              style={{ color: "#6843c6", cursor: "pointer" }}
            >
              Sign Up
            </span>
          </p>
        </div>
        {/* Signup page */}
        <div className="card-face card-back">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} autoComplete="on">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          {msg && !isLogin && <p className="error-msg">{msg}</p>}
          <p>
            Already have an account?{" "}
            <span
              onClick={() => {
                setIsLogin(true);
                setMsg("");
                resetForm();
              }}
              style={{ color: "#6843c6", cursor: "pointer" }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
