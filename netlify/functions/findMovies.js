import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// ✅ Safe debug logs
console.log("🔍 Checking environment variables...");
console.log("OPENAI_API_KEY exists?", !!process.env.OPENAI_API_KEY);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY exists?", !!process.env.SUPABASE_ANON_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const handler = async (event) => {
  try {
    // 🧠 Quick route to check function is working
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "✅ findMovies function is working!",
          openaiKey: !!process.env.OPENAI_API_KEY,
          supabaseUrl: process.env.SUPABASE_URL,
        }),
      };
    }

    const body = JSON.parse(event.body);
    const { favorite, mood, tone } = body;

    const combined = `${favorite}. Mood: ${mood}. Tone: ${tone}.`;

    // 1️⃣ Create embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: combined,
    });
    const userEmbedding = embeddingResponse.data[0].embedding;

    // 2️⃣ Search Supabase
    const { data: matches, error } = await supabase.rpc("match_movies", {
      query_embedding: userEmbedding,
      match_threshold: 0.1,
      match_count: 1,
    });

    if (error) throw error;
    if (!matches || matches.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No movie matches found." }),
      };
    }

    const bestMatch = matches[0];

    // 3️⃣ Generate explanation
    const prompt = `User is in the mood for: ${combined}. Recommend the movie "${bestMatch.title}" and explain why in one friendly sentence.`;

    const explanationRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const explanation = explanationRes.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({
        movie: bestMatch,
        explanation,
      }),
    };
  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
