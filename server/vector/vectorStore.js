// Pantry Chef - Vector Store (FAISS-style in-memory DB)

import { createEmbedding } from "./embeddingService.js";

class VectorStore {
  constructor() {
    this.vectors = [];
  }

  add(id, embedding, metadata = {}) {
    this.vectors.push({ id, embedding, metadata });
  }

  // cosine similarity
  similarity(a, b) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
  }

  search(queryEmbedding, topK = 5) {
    return this.vectors
      .map(v => ({
        id: v.id,
        score: this.similarity(queryEmbedding, v.embedding),
        metadata: v.metadata
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

export const vectorStore = new VectorStore();