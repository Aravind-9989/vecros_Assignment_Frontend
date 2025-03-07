import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/authRoutes/login`,
        formData
      );
      localStorage.setItem("token", res.data.token);
      alert("Login Successful!");
      navigate("/quizzes");
    } catch (error) {
      console.error("Login failed:", error);

      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      if (error.response) {
        console.error(
          "Server responded with error:",
          error.response.status,
          error.response.data
        );

        if (error.response.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.response.status === 400) {
          errorMessage = "The request was invalid. Please check your input.";
        } else {
          errorMessage = `Login failed with status ${error.response.status}. Please try again.`;
        }
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        errorMessage =
          "Login failed. The server did not respond. Please try again later.";
      } else {
        console.error("Error setting up the request:", error.message);
        errorMessage = "An unexpected error occurred. Please try again.";
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
