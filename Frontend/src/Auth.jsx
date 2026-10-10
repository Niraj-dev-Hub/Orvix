import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/axios";
import { useAuth } from "./context/useAuth";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin
        ? "/auth/login"
        : "/auth/register";

      const data = isLogin
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password
          };

      const response = await api.post(endpoint, data);

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        navigate("/");
      } else {
        setError(response.data.message || "Unable to sign in. Please try again.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span>O</span>
          <h1>Orvix AI</h1>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>

          <p>
            {isLogin
              ? "Sign in to continue to Orvix AI"
              : "Start your journey with Orvix AI"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="input-group">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign in"
              : "Create account"}
          </button>

        </form>

        {/* Switch Login / Signup */}
        <div className="auth-switch">

          <span>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Auth;