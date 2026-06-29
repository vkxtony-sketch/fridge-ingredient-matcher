// Pantry Chef - Vector Store (FAISS-style + Persistence Layer)

import fs from "fs";
import path from "path";
import { createEmbedding } from "./embeddingService.js";

const SAVE_PATH = path.resolve("server/vector/vectorStoreData.json");

class VectorStore {
  constructor() {
    this.vectors = this.load() || [];
  }

  add(id, embedding, metadata = {}) {
    this.vectors.push({ id, embedding, metadata });
    this.save();
  }

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

  save() {
    try {
      fs.writeFileSync(SAVE_PATH, JSON.stringify(this.vectors, null, 2));
    } catch (e) {
      console.error("Vector store save failed:", e);
    }
  }

  load() {
    try {
      if (!fs.existsSync(SAVE_PATH)) return [];
      const raw = fs.readFileSync(SAVE_PATH, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Vector store load failed:", e);
      return [];
    }
  }
}

export const vectorStore = new VectorStore();