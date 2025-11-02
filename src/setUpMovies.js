import "dotenv/config";
import { openai, supabase } from "./lib/config.js";
import movies from "./lib/content.js";

async function setupMovies() {
  for (const movie of movies) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: movie.content,
    });

    const embedding = embeddingResponse.data[0].embedding;

    const { error } = await supabase.from("movies").insert({
      title: movie.title,
      release_year: movie.releaseYear,
      content: movie.content,
      embedding,
    });

    if (error) console.error("Error inserting movie:", error);
    else console.log(`Inserted ${movie.title}`);
  }

  console.log("✅ Movies setup complete!");
}

setupMovies();
