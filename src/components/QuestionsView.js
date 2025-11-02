import React, { useState } from "react";
import logo from "../assets/logo.png";

export default function QuestionsView({ onSubmit, loading }) {
  const [answers, setAnswers] = useState({
    favorite: "",
    mood: "",
    tone: "",
  });

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <div className="container">
      <img src={logo} alt="PopChoice Logo" className="logo" />
      <h1 className="app-name"> PopChoice</h1>
      <form onSubmit={handleSubmit}>
        <label>What’s your favorite movie and why?</label>
        <input
          name="favorite"
          value={answers.favorite}
          onChange={handleChange}
          required
          className="movie-input"
        />

        <label>Are you in the mood for something new or classic?</label>
        <input
          name="mood"
          value={answers.mood}
          onChange={handleChange}
          required
          className="movie-input"
        />

        <label>Do you want to have fun, or something more serious?</label>
        <input
          name="tone"
          value={answers.tone}
          onChange={handleChange}
          required
          className="movie-input"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Finding your movie..." : "Let's Go"}
        </button>
      </form>
    </div>
  );
}
