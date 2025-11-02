import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

console.log("🟢 Netlify function starting up...");

export const handler = async (event) => {
  try {
    console.log("➡️ Event received:", event.httpMethod);

    // Debug GET
    if (event.httpMethod === "GET") {
      console.log("✅ Health check route hit");
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: "Function running fine." }),
      };
    }

    // Parse body
    const body = JSON.parse(event.body || "{}");
    console.log("📦 Request body:", body);

    // Check env
    console.log("🔍 Env vars:", {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasSupabaseURL: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
    });

    // Initialize clients
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Simple embedding test
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "test",
    });

    console.log("✅ Embedding created successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
