# Pantry Chef 🍲🧠

## Next-Gen Recipe Intelligence System (Yummly++ Architecture)

Pantry Chef is a full redesign of the original Fridge Ingredient Matcher, rebuilt into a production-grade, AI-enhanced culinary recommendation engine inspired by Yummly—but significantly more advanced.

---

## 🚀 Vision

Pantry Chef transforms simple ingredient matching into a **personalized food intelligence system** that:
- Understands your pantry in real time
- Learns your taste preferences over time
- Recommends recipes using multi-factor AI ranking
- Optimizes for speed, nutrition, and ingredient efficiency

---

## 🧠 Core Features

### 1. Smart Pantry System
- Track ingredients you actually have
- Normalize ingredient variants (milk vs oat milk, etc.)
- Detect missing ingredients instantly

### 2. AI Recipe Matching Engine
Replaces basic filtering with weighted scoring:
- Ingredient overlap score
- Missing ingredient penalty system
- Cooking time efficiency
- User preference history weighting

### 3. Recommendation Feed (Yummly-style)
- Ranked recipe feed instead of static search results
- Continuous learning from clicks, saves, and views
- Personalized “For You” cooking suggestions

### 4. Recipe Intelligence Layer
- Substitution suggestions (AI-driven swaps)
- Difficulty estimation
- Nutrition estimation (future upgrade)

---

## 🏗️ New Architecture

```
fridge-ingredient-matcher/
│
├── index.html
├── src/
│   └── js/
│       ├── app.js              # UI controller layer
│       ├── matcher.js          # upgraded AI matching engine
│       ├── recommender.js      # NEW: ranking + personalization engine
│       ├── scoring.js          # NEW: scoring logic utilities
│       └── recipes.js          # recipe dataset
│
├── assets/
│   └── styles.css
│
└── README.md
```

---

## ⚙️ Core Algorithm (Upgrade)

score = 
  ingredient_match * 0.5 +
  user_preference * 0.3 +
  cooking_efficiency * 0.2

---

## 🔥 Key Upgrades

- Static matcher → intelligent ranking system
- Single output → personalized feed
- Manual selection → adaptive recommendation engine

---

## 🌍 Goal

"Spotify, but for food decisions."
