import React, { useState } from "react";
import QuestionsView from "./components/QuestionsView.js";
import ResultView from "./components/ResultView.js";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (answers) => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://red-night-0dce.muzhdawafa2008.workers.dev/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        setLoading(false);
        return;
      }

      setResult({ movie: data.movie, explanation: data.explanation });
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Network error — check your Worker URL");
    }

    setLoading(false);
  };

  return (
    <div>
      {!result ? (
        <QuestionsView onSubmit={handleSubmit} loading={loading} />
      ) : (
        <ResultView
          movie={result.movie}
          explanation={result.explanation}
          onReset={() => setResult(null)}
        />
      )}
    </div>
  );
}

export default App;
