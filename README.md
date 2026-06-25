# Fridge Ingredient Matcher 🍳🥦

### A client-side ingredient intelligence engine engineered to optimize household resource management and minimize food waste.

![License](https://shields.io)
![Build](https://shields.io)
![JavaScript](https://shields.io)
![Architecture](https://shields.io)

---

## 1. Title & Value Proposition

**Fridge Ingredient Matcher** is a high-utility, framework-agnostic web utility designed to solve a universal modern problem: resource optimization in the household kitchen. 

By evaluating real-time user inventory against a structured relational dataset, the application functions as a deterministic matching matrix. It provides immediate, actionable cooking solutions without the overhead of heavy server-side processing, tracking, or tracking cookies. 

This project rejects the modern trend of software over-engineering. It achieves smooth performance, strict security, and responsive styling entirely on the client side using optimized web standard mechanics.

---

## 2. Key Architectural Features

- **Decoupled Architecture**: Logic layers are divided across discrete functional modules using ES6 import/export rules. This ensures long-term system maintainability and separates concerns cleanly.
- **Algorithmic Search Optimization**: Runs an efficient matching loop optimized via full text-token normalization. This protects the pipeline against user string irregularities (like capitalization, extra whitespace, or trailing commas).
- **Reactive UI Rendering**: Employs structural elements using Tailwind CSS grid systems. It alters live browser nodes dynamically via vanilla DOM mapping, avoiding unnecessary web framework redraw cycles.
- **Zero-Backend Footprint**: Operates with a local static database to allow instantaneous deployment across serverless hosting solutions.

---

## 3. System Architecture & File Tree

```text
fridge-ingredient-matcher/
├── .gitignore          # Prevents local operational cache and system pollution
├── LICENSE             # Legal framework parameters defining open-source usage
├── README.md           # Technical documentation and architecture layout
├── index.html          # Base DOM entry matrix and static semantic viewport layout
└── src/
    └── js/
        ├── app.js      # Controller layer managing DOM operations and event listeners
        ├── matcher.js  # Main functional computing pipeline handling sorting algorithms
        └── recipes.js  # Schema structure containing localized recipe database array
```

---

## 4. Core Algorithm Breakdown

The sorting and filtering logic runs inside `matcher.js` as an immutable data pipeline divided into three distinct execution phases:

1. **Token Ingestion & Normalization**: User text input is split across string comma parameters, stripped of white-space fragments via `.trim()`, and mapped using `.toLowerCase()` rules to enforce exact array-index matching.
2. **Subset Intersection Evaluation**: The computational logic intersects user tokens against the recipe array, calculating match statistics dynamically:
   $$\text{Match Percentage} = \left( \frac{\text{Matching Ingredients Count}}{\text{Total Recipe Ingredients Count}} \right) \times 100$$
3. **Multi-Tier Priority Sort**: Recipes scaling below a 1% threshold are purged instantly. Surviving data items are organized using multi-tier sorting parameters: results are sorted by highest matching percentage first. In the event of an identical percentage match, a secondary tier rule pushes the recipe requiring the higher raw volume of matching ingredients to the top.

---

## 5. Local Setup Instructions

Because this codebase is built using modular modern ECMAScript standards (`type="module"`), browser security policies require sandboxed local network rules to load internal dependencies.

### Installation
1. Clone the public master repository string into your workspace directory:
   ```bash
   git clone https://github.com
   ```
2. Navigate directly into the freshly generated root source folder path:
   ```bash
   cd fridge-ingredient-matcher
   ```

### Local Server Launch
- **Option A (VS Code Visual Workflow)**: Install the **Live Server** extension. Right-click your `index.html` file template from your navigation tree view and select **"Open with Live Server"**.
- **Option B (Python Terminal Command)**: Run Python's native network server module directly from your workspace folder terminal prompt:
  ```bash
  python -m http.server 8000
  ```
3. Open your browser window and navigate to the active local host portal: `http://localhost:8000`.

---

## 6. Demonstrated Engineering Competencies

This project demonstrates a clear grasp of production-grade software engineering fundamentals:

- **System Separation of Concerns**: Isolating algorithmic computational layers from UI layout engines to allow parallel testability.
- **Asynchronous & Responsive DOM Design**: Directly altering document nodes, styling injection points, and state changes via native browser tools.
- **Data Integrity Safeguards**: Handling erratic human inputs using normalization filters to protect matching arrays against processing bugs.
- **Git Commit Discipline**: Documenting the software build using clear, step-by-step commit stages that reflect real software development habits.

---

## 7. License

This repository is completely open-source and available for extension under the explicit permissions parameters dictated by the terms of the [MIT License](LICENSE).
