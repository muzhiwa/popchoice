import React from "react";
import logo from "../assets/logo.png";

export default function ResultView({ movie, explanation, onReset }) {
  return (
    <div className="container">
      <img src={logo} alt="PopChoice Logo" className="logo" />
      <h1 className="app-name"> PopChoice</h1>
      <h2>
        {movie.title} ({movie.release_year})
      </h2>
      <p>{movie.content}</p>
      <div className="ai-explanation">
        <strong className="why"> Why we picked it:</strong>
        <p>{explanation}</p>
      </div>
      <button onClick={onReset} className="reset">
        Go Again
      </button>
    </div>
  );
}
