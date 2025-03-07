import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/authRoutes/register`, formData);
      alert("Registration Successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);

      let errorMessage = "Registration failed. Please try again.";
      if (error.response) {
        console.error(
          "Server responded with error:",
          error.response.status,
          error.response.data
        );
        errorMessage =
          error.response.data.message ||
          `Registration failed with status ${error.response.status}.`; // More verbose error message
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        errorMessage =
          "Registration failed. No response from server. Please try again later.";
      } else {
        console.error("Error setting up the request:", error.message);
        errorMessage =
          "An unexpected error occurred during registration. Please try again.";
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
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
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
