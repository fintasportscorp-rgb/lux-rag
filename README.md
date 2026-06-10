# Finta AI-Benchmark — Lux

**Minimalist RAG prompt engine for AI tool discovery. Build grounded NotebookLM queries across performance, market, traction, and competitive dimensions.**

> Live demo: [fintasportscorp-rgb.github.io/Finta_AI-Benchmark](https://fintasportscorp-rgb.github.io/Finta_AI-Benchmark/)  
> Sports ecosystem: [fintalab.com](https://fintalab.com)

---

## What Is Lux?

Lux is a structured prompt-building interface for NotebookLM. It turns vague research intentions into precise, citation-anchored RAG queries — replacing open-ended questions that invite hallucination with framework-driven prompts that surface real data from your source documents.

Built for analysts evaluating the 2026 AI tools landscape, Lux provides four strategic query frameworks and a tag insertion system that anchors every prompt to the actual fields in your CSV source data.

No benchmarking runs here. No scraping. Lux structures *your thinking* into a prompt that NotebookLM can answer with evidence.

---

## Analysis Frameworks

Four strategic pathways, each targeting a distinct analytical question:

| Framework | Query Logic | Core Question |
|-----------|-------------|---------------|
| **Performance Audit** | `ratings vs features` | Which tools actually deliver on their claims? |
| **Market Gap Scout** | `related_topics + competitor pain points` | Where are the underserved niches? |
| **Traction Reality Check** | `pricing vs real adoption` | What has real users vs just hype? |
| **Competitive Edge Brief** | `pros vs alternatives in same task` | How do I differentiate in a specific use case? |

Each framework button populates the prompt textarea with a pre-structured query template aligned to that strategic lens.

---

## How It Works

**1. Focus Query** *(optional)*  
Enter your specific research context — e.g., *"Which low-cost AI writing tools have the strongest user ratings in 2026?"*

**2. Select a Framework**  
Click one of the four strategy buttons. It populates the prompt textarea with a structured template.

**3. Insert Data Anchors**  
Use the tag insertion system to embed field references into your prompt:

| Tag | Data Field |
|-----|-----------|
| `[ai_name]` | Tool name |
| `[rating]` | User rating |
| `[features]` | Feature list |
| `[pricing_model]` | Pricing structure |
| `[related_topics]` | Category tags |
| `[pros]` / `[cons]` | Stated advantages and limitations |

**4. Export**  
Copy the generated prompt to clipboard, or launch directly in NotebookLM with one click.

---

## Data Source

Built for the **"There Is an AI for That" February 2026 dataset** — a CSV-structured catalog of AI writing tools containing:

- Tool names and descriptions
- User ratings and adoption signals
- Feature lists and task labels
- Pricing models (free / freemium / paid / enterprise)
- Related topics and competitive alternatives
- Pros, cons, and differentiators

Upload this dataset as a NotebookLM source before using Lux prompts.

---

## Project Structure

```
.
├── app/
│   ├── page.tsx            # Main Lux interface — framework buttons, tag system, textarea, export
│   └── layout.tsx          # App shell
├── components/
│   ├── StrategyButtons/    # Four framework selection buttons
│   ├── TagInserter/        # Data anchor tag insertion controls
│   ├── PromptEditor/       # Textarea with generated prompt
│   └── ExportBar/          # Copy + NotebookLM launch actions
├── hooks/                  # Prompt state management hooks
├── lib/                    # Framework templates, tag definitions
├── styles/                 # Global CSS
├── public/                 # Static assets
├── next.config.mjs         # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

---

## Tech Stack

TypeScript · Next.js · React · CSS

---

## Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. Or use the [live deployment](https://fintasportscorp-rgb.github.io/Finta_AI-Benchmark/) directly.

---

## Links

| Resource | URL |
|----------|-----|
| Live app | [fintasportscorp-rgb.github.io/Finta_AI-Benchmark](https://fintasportscorp-rgb.github.io/Finta_AI-Benchmark/) |
| Sports platform | [fintalab.com](https://fintalab.com) |
| GitHub | [fintasportscorp-rgb/Finta_AI-Benchmark](https://github.com/fintasportscorp-rgb/Finta_AI-Benchmark) |
