import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { LRUCache } from "lru-cache";
import { openai, supabase } from "./config.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- CONFIG ---------------- */

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 10,
});

const sessions = new Map();

/* ---------------- HELPERS ---------------- */

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, [
      {
        role: "system",
        content: `
You are Movie Recommedation Helper, an advanced AI movie recommendation assistant.

Your job:
- Recommend movies intelligently
- Use retrieved context as primary knowledge
- Infer similarities using:
  - genre
  - emotional tone
  - themes
  - atmosphere
  - pacing
  - directors
  - actors
  - story structure

Rules:
- If exact movie isn't found, still recommend similar movies from retrieved context
- Explain WHY each recommendation matches
- Be conversational
- Never say "I don't know" unless absolutely nothing is relevant
- Never invent fake movies
- Prefer concise but helpful answers
`,
      },
    ]);
  }

  return sessions.get(sessionId);
}

/* ---------------- QUERY REWRITING ---------------- */

async function rewriteQuery(query) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    messages: [
      {
        role: "system",
        content: `
You are a semantic search optimizer.

Your task:
- Rewrite user movie queries for vector search
- Preserve original meaning
- Keep important movie keywords
- Keep years, genres, actors, directors
- NEVER ask follow-up questions
- NEVER answer the user
- Return ONLY the rewritten search query

Examples:

User:
best sci fi movies

Output:
best science fiction movies

User:
movies like inception

Output:
mind bending thriller movies similar to inception
`,
      },

      {
        role: "user",
        content: query,
      },
    ],

    temperature: 0.2,
    max_tokens: 40,
  });

  return completion.choices[0].message.content.trim();
}

/* ---------------- EMBEDDINGS ---------------- */

async function createEmbedding(input) {
  const cached = cache.get(input);

  if (cached) {
    return cached;
  }

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  const embedding = response.data[0].embedding;

  cache.set(input, embedding);

  return embedding;
}

/* ---------------- VECTOR SEARCH ---------------- */

async function retrieveDocuments(embedding) {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.08,
    match_count: 8,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return {
      found: false,
      context: "",
      documents: [],
    };
  }

  return {
    found: true,
    context: data.map((obj) => obj.content).join("\n"),
    documents: data,
  };
}

/* ---------------- RERANKING ---------------- */

function rerankDocuments(documents, query) {
  const q = query.toLowerCase();

  return documents
    .map((doc) => {
      let boost = 0;

      const text = doc.content.toLowerCase();

      /* SCI-FI */

      if (q.includes("sci fi") || q.includes("science fiction")) {
        if (
          text.includes("sci") ||
          text.includes("space") ||
          text.includes("alien") ||
          text.includes("future") ||
          text.includes("robot")
        ) {
          boost += 0.25;
        }
      }

      /* SPACE */

      if (q.includes("space")) {
        if (
          text.includes("space") ||
          text.includes("nasa") ||
          text.includes("astronaut")
        ) {
          boost += 0.2;
        }
      }

      /* THRILLER */

      if (q.includes("thriller")) {
        if (text.includes("thriller") || text.includes("mystery")) {
          boost += 0.15;
        }
      }

      return {
        ...doc,
        finalScore: doc.similarity + boost,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 5);
}

/* ---------------- CONTEXT COMPRESSION ---------------- */

function buildContext(documents) {
  return documents
    .map((doc, index) => {
      return `
Movie ${index + 1}:
${doc.content}
`;
    })
    .join("\n");
}

/* ---------------- CHAT ENDPOINT ---------------- */

app.post("/chat", async (req, res) => {
  try {
    const query = req.body.message;

    let sessionId = req.body.sessionId;

    if (!sessionId) {
      sessionId = uuidv4();
    }

    const messages = getSession(sessionId);

    /* QUERY REWRITE */

    const rewrittenQuery = await rewriteQuery(query, messages);

    console.log("REWRITTEN:", rewrittenQuery);

    /* EMBEDDING */

    const embedding = await createEmbedding(rewrittenQuery);

    /* RETRIEVAL */

    const retrieval = await retrieveDocuments(embedding);

    /* NO RESULTS */

    if (!retrieval.found) {
      return res.json({
        sessionId,
        reply: `
## No movie matches found 🎬

Try searching with:
- movie genres
- actor names
- directors
- release years
- similar movies

### Examples:
- sci fi movies like interstellar
- best Christopher Nolan movies
- emotional space movies
`,
        sources: [],
      });
    }

    /* RERANK */

    const rankedDocs = rerankDocuments(retrieval.documents, rewrittenQuery);

    /* CONTEXT */

    const context = buildContext(rankedDocs);

    /* USER MESSAGE */

    messages.push({
      role: "user",
      content: `
Context:
${context}

Question:
${query}
`,
    });

    /* TOKEN CONTROL */

    const recentMessages = messages.slice(-10);

    /* GENERATION */

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      messages: recentMessages,

      temperature: 0.6,

      max_tokens: 400,
    });

    const answer = completion.choices[0].message.content;

    /* MEMORY */

    messages.push({
      role: "assistant",
      content: answer,
    });

    /* RESPONSE */

    res.json({
      sessionId,
      reply: answer,
      sources: rankedDocs.map((doc) => ({
        id: doc.id,
        similarity: doc.similarity,
      })),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

/* ---------------- START SERVER ---------------- */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
