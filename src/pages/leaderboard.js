import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/quiz/leaderboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLeaderboard(res.data);
      } catch (error) {
        if (error.response) {
          console.error(
            "Server responded with error:",
            error.response.status,
            error.response.data
          );
          setError(
            `Failed to fetch leaderboard: Server error (${error.response.status}).`
          );
        } else if (error.request) {
          console.error("No response received from server:", error.request);
          setError("Failed to fetch leaderboard: No response from server.");
        } else {
          console.error("Error setting up the request:", error.message);
          setError("Failed to fetch leaderboard: Request setup error.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg" style={{ width: "50rem" }}>
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">🏆 Leaderboard</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : leaderboard.length === 0 ? (
            <p className="text-muted text-center">No scores available yet.</p>
          ) : (
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Username</th>
                  <th scope="col">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{index + 1}</strong>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.totalScore} Points</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
