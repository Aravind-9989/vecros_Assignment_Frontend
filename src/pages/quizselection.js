import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const QuizSelection = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/quiz/getquiz`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setQuizzes(res.data.quizzes);
      } catch (error) {
        console.error("Failed to load quizzes:", error);
        let errorMessage = "Failed to load quizzes. Please try again.";
        if (error.response) {
          console.error(
            "Server responded with error:",
            error.response.status,
            error.response.data
          );
          errorMessage = `Failed to load quizzes (Server Error ${error.response.status}). Please try again.`;
        } else if (error.request) {
          console.error("No response received from server:", error.request);
          errorMessage =
            "Failed to load quizzes. No response from the server. Please try again later.";
        } else {
          console.error("Error setting up the request:", error.message);
          errorMessage =
            "An unexpected error occurred while fetching quizzes. Please try again.";
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading)
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading quizzes...</p>
      </div>
    );

  if (error)
    return (
      <div className="container text-center mt-5">
        <p className="text-danger">{error}</p>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Select a Quiz</h2>
        <p className="text-muted">Choose a quiz to begin your journey!</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="alert alert-warning text-center">
          No quizzes available.
        </div>
      ) : (
        <div className="row justify-content-center gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="col-12 col-md-6 col-lg-5 mb-4">
              <div className="card quiz-card shadow-lg border-0 rounded-4 p-4 d-flex flex-column h-100">
                <div className="card-body text-center">
                  <h5 className="card-title text-dark fw-bold">{quiz.title}</h5>
                </div>
                <button
                  className="btn btn-primary w-100 mt-auto"
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizSelection;
