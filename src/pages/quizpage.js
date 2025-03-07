import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not logged in! Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/quiz/quizbyid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data.quiz);
        setAnswers(new Array(res.data.quiz.questions.length).fill(null));
        console.log("Quiz data fetched:", res.data.quiz);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        setError("Failed to fetch quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSubmissionError("User not logged in! Please log in again.");
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      setSubmissionError("Invalid session. Please log in again.");
      return;
    }

    if (!userId) {
      setSubmissionError("User ID not found in token. Please log in again.");
      return;
    }

    if (answers.includes(null)) {
      setSubmissionError("Please answer all questions before submitting.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/quiz/submit`,
        { userId, quizId: id, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Quiz submitted successfully!");
      navigate("/leaderboard");
    } catch (error) {
      console.error("Quiz submission failed:", error);
      let errorMessage = "Submission failed. Please try again.";
      if (error.response) {
        console.error(
          "Server responded with error:",
          error.response.status,
          error.response.data
        );
        if (error.response.status === 400) {
          errorMessage = "Invalid submission. Please check your answers.";
        } else {
          errorMessage = `Submission failed with status ${error.response.status}. Please try again.`;
        }
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        errorMessage =
          "Submission failed. No response from server. Please try again later.";
      } else {
        console.error("Error setting up the request:", error.message);
        errorMessage =
          "An unexpected error occurred during submission. Please try again.";
      }

      setSubmissionError(errorMessage);
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5 text-center">
        <p className="text-danger fw-bold">{error}</p>
      </div>
    );

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: "50rem" }}>
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">📝 {quiz.title}</h2>
        </div>
        <div
          className="card-body"
          style={{ overflow: "visible", maxHeight: "80vh", overflowY: "auto" }}
        >
          {quiz.questions.length > 0 ? (
            quiz.questions.map((q, index) => (
              <div key={index} className="mb-4 border-bottom pb-3">
                <h5 className="fw-bold">
                  {index + 1}. {q.questionText}
                </h5>
                {q.options.map((option, i) => (
                  <div key={i} className="form-check">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      className="form-check-input"
                      onChange={() => {
                        const newAnswers = [...answers];
                        newAnswers[index] = option;
                        setAnswers(newAnswers);
                      }}
                    />
                    <label className="form-check-label">{option}</label>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-danger text-center fw-bold">
              No questions available in this quiz.
            </p>
          )}

          {submissionError && (
            <p className="text-danger text-center fw-bold">{submissionError}</p>
          )}

          <div className="text-center">
            <button
              className="btn btn-success px-4 py-2"
              onClick={handleSubmit}
              disabled={answers.includes(null)}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
