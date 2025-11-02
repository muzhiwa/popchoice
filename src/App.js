import React, { useState } from "react";
import { openai, supabase } from "./lib/config.js";
import QuestionsView from "./components/QuestionsView.js";
import ResultView from "./components/ResultView.js";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (answers) => {
    setLoading(true);
    const combined = `${answers.favorite}. Mood: ${answers.mood}. Tone: ${answers.tone}.`;

    // 1️⃣ Create embedding for user answers
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: combined,
    });
    const userEmbedding = embeddingResponse.data[0].embedding;

    // 2️⃣ Search Supabase for the closest movie
    const { data: matches, error } = await supabase.rpc("match_movies", {
      query_embedding: userEmbedding,
      match_threshold: 0.1,
      match_count: 1,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      alert("There was a problem searching for your movie.");
      setLoading(false);
      return;
    }

    if (!matches || matches.length === 0) {
      alert(
        "No movie matches found. Please describe your favorite movie differently!"
      );
      setLoading(false);
      return;
    }

    const bestMatch = matches[0];
    console.log(" Best match:", bestMatch);

    // 3️⃣ Generate explanation
    const prompt = `User is in the mood for: ${combined}. Recommend the movie "${bestMatch.title}" and explain in one friendly sentence why it's a great fit.`;

    const explanationRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const explanation = explanationRes.choices[0].message.content;

    setResult({ movie: bestMatch, explanation });
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
