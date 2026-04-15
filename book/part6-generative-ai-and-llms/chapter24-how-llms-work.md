# Chapter 24: How LLMs Work

> *"Language is the dress of thought."* — Samuel Johnson

---

## 🎯 CONCEPT

A **Large Language Model (LLM)** is a neural network trained on vast quantities of text with one deceptively simple objective: predict the next token. From that humble goal emerges the ability to write code, reason through problems, translate languages, summarise documents, and hold conversations.

This chapter demystifies the entire pipeline — from the moment raw text enters the system to the moment a response token is produced — covering tokenisation, the Transformer architecture, attention mechanisms, training phases, and the practical quirks (context windows, temperature, hallucinations) that every practitioner must understand.

```
HIGH-LEVEL LLM PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Raw Text
     │
     ▼
  Tokeniser ──────────── splits text into tokens (sub-words)
     │
     ▼
  Token IDs ──────────── integers representing each token
     │
     ▼
  Embedding Layer ─────── maps each ID to a dense vector
     │
     ▼
  Positional Encoding ─── adds position information
     │
     ▼
  Transformer Blocks ──── N × (Self-Attention + Feed-Forward)
     │
     ▼
  Output Head ────────── projects to vocabulary probabilities
     │
     ▼
  Sampling Strategy ───── picks the next token (greedy/top-p/temp)
     │
     ▼
  Generated Token ──────── appended to context; loop repeats
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🧑‍🏫 TEACH (Feynman Style)

### Tokens: The Alphabet of LLMs

Before an LLM reads a single word it must convert text into numbers. It does this via **tokenisation** — splitting text into chunks called tokens.

Tokens are **not** always whole words. They are sub-word units learned from a large corpus, optimised so that common words become one token and rare words split into pieces:

```
"Hello, world!"
  → ["Hello", ",", " world", "!"]
  → [15496, 11, 995, 0]

"Unbelievably"
  → ["Un", "believ", "ably"]
  → [1844, 12381, 2752]

"GPT-4 is amazing"
  → ["G", "PT", "-", "4", " is", " amazing"]
  → [38, 2898, 12, 19, 318, 6381]
```

Why sub-words? Because:
- Whole-word vocabularies explode with every new word/typo/name
- Character-level models require enormously long sequences
- Sub-words balance vocabulary size (~50,000 tokens) with sequence length

**Rule of thumb:** 1 token ≈ 0.75 words ≈ 4 characters in English.

GPT-4 has a vocabulary of ~100,000 tokens. A 1,000-word essay is roughly 1,300 tokens.

### The Transformer: An Orchestra, Not a Pipeline

Before the Transformer (2017, "Attention Is All You Need"), sequential models like RNNs processed text word by word, struggling to connect information far apart in a sequence. The Transformer abolished the sequential bottleneck by processing **all tokens at once** and letting every token attend to every other token simultaneously.

Think of it like a room full of musicians (tokens) who can all hear each other at the same time, rather than playing telephone one seat at a time.

---

## 🔬 DEEP UNDERSTANDING

### 1. Embeddings and Positional Encoding

Each token ID is mapped to a **dense vector** (e.g., 4096 dimensions in LLaMA 3). This embedding is learned — similar tokens end up near each other in this high-dimensional space.

But the model needs to know *order*. Transformers process tokens in parallel, so positional information must be injected explicitly:

```
Token position 0 1 2 3 4
                │ │ │ │ │
Embedding:    [v0 v1 v2 v3 v4]
                +  +  +  +  +
Positional:   [p0 p1 p2 p3 p4]
                ↓  ↓  ↓  ↓  ↓
Final input:  [e0 e1 e2 e3 e4]  ──▶ Transformer blocks
```

Modern LLMs use **Rotary Positional Encoding (RoPE)** which encodes relative positions, enabling better generalisation to long sequences.

### 2. Self-Attention: "Which Words Matter Most?"

Self-attention is the engine of the Transformer. For each token, it asks: *"Which other tokens in this sequence are most relevant to understanding me?"*

Each token produces three vectors:
- **Q (Query):** "What am I looking for?"
- **K (Key):** "What do I offer?"
- **V (Value):** "What information do I carry?"

```
Sentence: "The bank by the river flooded"
           [0]  [1] [2] [3]  [4]   [5]

Self-attention for token "bank" (idx 1):
  Q_bank · K_The    = low score
  Q_bank · K_by     = low score
  Q_bank · K_the    = low score
  Q_bank · K_river  = HIGH score  ← "river" disambiguates meaning
  Q_bank · K_flooded = high score

Attention weights (after softmax):
  The  bank   by   the  river  flooded
  0.03  —    0.05  0.04  0.52   0.36

Weighted sum of Value vectors → new representation of "bank"
(now clearly a riverbank, not a financial institution)
```

**Scaled Dot-Product Attention formula:**

```
              QKᵀ
Attention  =  ───────  softmax → × V
              √d_k

Where d_k = dimension of keys (scaling prevents vanishing gradients)
```

**Multi-Head Attention** runs this process H times in parallel with different learned Q/K/V projections, letting the model attend to different aspects simultaneously (syntax, semantics, coreference, etc.):

```
┌────────────────────────────────────────────────────────┐
│                  MULTI-HEAD ATTENTION                  │
│                                                        │
│  Input ──┬──▶ Head 1 (Q₁K₁V₁) ──▶ attends to syntax   │
│           ├──▶ Head 2 (Q₂K₂V₂) ──▶ attends to pronouns│
│           ├──▶ Head 3 (Q₃K₃V₃) ──▶ attends to topics  │
│           └──▶ Head H (QₕKₕVₕ) ──▶ attends to ...     │
│                    │                                   │
│              Concatenate + Linear Project              │
│                    │                                   │
│              Rich combined output                      │
└────────────────────────────────────────────────────────┘
```

### 3. A Full Transformer Block

Each of the N Transformer blocks stacks self-attention with a position-wise Feed-Forward Network (FFN):

```
      Input (from previous block or embedding)
            │
            ▼
    ┌─────────────────┐
    │  Layer Norm      │
    └────────┬─────────┘
             │
             ▼
    ┌─────────────────┐
    │ Multi-Head       │
    │ Self-Attention   │
    └────────┬─────────┘
             │
    ┌────────┴─────────┐
    │  Residual Add    │  ← skip connection preserves gradients
    └────────┬─────────┘
             │
             ▼
    ┌─────────────────┐
    │  Layer Norm      │
    └────────┬─────────┘
             │
             ▼
    ┌─────────────────┐
    │  Feed-Forward    │  ← 2 linear layers + activation (e.g., SiLU)
    │  Network         │    (4× wider than attention dimension)
    └────────┬─────────┘
             │
    ┌────────┴─────────┐
    │  Residual Add    │
    └────────┬─────────┘
             │
             ▼
      Output to next block
```

GPT-4 reportedly has ~96 such blocks. LLaMA 3 70B has 80 blocks with 8192-dimensional embeddings.

### 4. Training: Pre-training → Fine-tuning → RLHF

**Phase 1 — Pre-training (Next-Token Prediction)**

The model is trained on trillions of tokens from the internet, books, code, and scientific papers. Given a sequence of tokens, it must predict the next one. This sounds trivial but requires internalising grammar, facts, reasoning patterns, and coding conventions to minimise loss.

```
Input:  "The capital of France is"
Label:  "Paris"

Input:  "def fibonacci(n):\n    if n <= 1:\n        return"
Label:  "n"

Loss = Cross-entropy between predicted distribution and true next token
```

GPT-4 was pre-trained on an estimated 13 trillion tokens. Training required thousands of specialised GPUs for months.

**Phase 2 — Supervised Fine-tuning (SFT)**

The pre-trained model knows *language* but behaves like an autocomplete engine. SFT teaches it to follow *instructions* by training on curated (prompt, ideal response) pairs written by human annotators.

**Phase 3 — RLHF (Reinforcement Learning from Human Feedback)**

SFT still produces outputs that can be unhelpful, harmful, or verbose. RLHF adds a crucial alignment step:

```
Step 1: Human rankers compare multiple model outputs and rank them
Step 2: Train a Reward Model (RM) to predict human preference scores
Step 3: Use PPO (Proximal Policy Optimization) to fine-tune the LLM
        to maximise the reward model's score

                ┌────────────────────────────────┐
                │        RLHF Loop               │
  Prompt ──────▶│  LLM generates response        │
                │  RM scores the response        │
                │  PPO updates LLM weights       │
                └────────────────────────────────┘
                  Repeat until model is aligned
```

This three-phase pipeline (Pre-train → SFT → RLHF) is what turns a language model into a helpful assistant.

### 5. Context Window, Temperature, and Hallucinations

**Context Window**
The maximum number of tokens the model can "see" at once. Everything outside the window is invisible.

| Model | Context Window |
|---|---|
| GPT-3.5 | 16,384 tokens (~12,000 words) |
| GPT-4o | 128,000 tokens (~96,000 words) |
| Claude 3.5 Sonnet | 200,000 tokens (~150,000 words) |
| Gemini 1.5 Pro | 1,000,000 tokens (~750,000 words) |

**Temperature**
Controls randomness in token sampling. After computing probability scores across the vocabulary, temperature T scales the distribution:

```
T = 0.0  → Always pick the highest-probability token (deterministic)
T = 0.7  → Slightly creative, still mostly coherent (typical chat)
T = 1.0  → Raw model distribution
T = 2.0  → Very random, often incoherent

Low temp:  "The sky is blue."
High temp: "The sky whispers cerulean sonnets to the epoch-blind horizon."
```

**Hallucinations**
LLMs sometimes generate confident, fluent, completely false statements. Causes:
- Training data contains errors and contradictions
- Next-token prediction optimises for *plausibility*, not *truthfulness*
- The model cannot distinguish what it "knows" from what it "infers"

Mitigation strategies: RAG (Chapter 25), model uncertainty calibration, fact-checking pipelines, Constitutional AI.

### 6. Major LLM Families

```
┌──────────────────────────────────────────────────────────────────┐
│                    LLM LANDSCAPE (2024–2025)                     │
│                                                                  │
│  CLOSED-SOURCE (API only)          OPEN-WEIGHT                   │
│  ─────────────────────────         ──────────────                │
│  GPT-4o      (OpenAI)              LLaMA 3    (Meta)             │
│  o1/o3       (OpenAI)              Mistral 7B (Mistral AI)       │
│  Claude 3.5  (Anthropic)           Mixtral    (Mistral AI)       │
│  Gemini 1.5  (Google)              Phi-3      (Microsoft)        │
│  Command R+  (Cohere)              Qwen2      (Alibaba)          │
│                                    Falcon     (TII)              │
│                                                                  │
│  Architecture: All are Transformer-based decoder models          │
│  Key differences: Scale, training data, RLHF approach,          │
│                   context length, multimodal capability          │
└──────────────────────────────────────────────────────────────────┘
```

**BERT vs. GPT:** BERT is an *encoder-only* Transformer trained with masked language modelling (fill in the blank), making it excellent for classification and embeddings but not generation. GPT is a *decoder-only* model trained autoregressively for generation.

---

## 🔄 REVIEW

**Core concepts:**

1. LLMs convert text to **tokens** (sub-word units) then to **embedding vectors** before any processing occurs.

2. The **Transformer** processes all tokens simultaneously using **self-attention**, allowing every token to attend to every other token.

3. **Self-attention** uses Query, Key, and Value vectors to compute a weighted blend of contextually relevant information for each token.

4. **Multi-head attention** runs multiple attention operations in parallel, each focusing on different linguistic relationships.

5. Training follows three phases: **pre-training** (next-token prediction at scale) → **SFT** (instruction following) → **RLHF** (human preference alignment).

6. **Context window** limits how much text the model can process at once; **temperature** controls output randomness; **hallucinations** occur because the model optimises plausibility, not truth.

7. GPT-family models are decoder-only (generative); BERT-family models are encoder-only (understanding/classification).

**Self-check questions:**
- What does a token represent, and why are whole words not always a single token?
- Explain Q, K, V in your own words using an analogy.
- Why does RLHF matter — what gap does SFT leave?

---

## ✨ SIMPLIFY

| Technical Term | Plain Language |
|---|---|
| Token | A chunk of text (part of a word, a punctuation mark, a space) |
| Embedding | Turning a word-chunk into a list of numbers that captures meaning |
| Transformer | A neural network that lets all words talk to each other at once |
| Self-attention | Each word deciding which other words to pay attention to |
| Q/K/V | Ask / Lookup / Answer — the three roles in an attention lookup |
| Pre-training | Reading the entire internet and learning to predict the next word |
| Fine-tuning | Specialised study: learning to follow instructions |
| RLHF | Getting human feedback on your writing and learning to do better |
| Context window | Short-term memory — the model forgets anything outside it |
| Temperature | A creativity dial — low for precise answers, high for storytelling |
| Hallucination | When the model confidently makes something up |

**One-sentence summary:**  
LLMs are Transformer-based neural networks that convert text into tokens, build rich contextual representations using self-attention, and learn to generate helpful responses through a three-stage training pipeline of internet-scale pre-training, instruction fine-tuning, and human preference learning.

---

## 🏋️ PRACTICE

### Exercise 1 — Tokenise by Hand
Estimate how many tokens the following strings contain (use the ≈0.75 words/token rule, then verify at [platform.openai.com/tokenizer](https://platform.openai.com/tokenizer)):
- a) `"Hello, how are you today?"`
- b) `"Supercalifragilisticexpialidocious"`
- c) A 500-word paragraph of your choice

### Exercise 2 — Attention Trace
Given the sentence: `"The trophy didn't fit in the suitcase because it was too big."`  
Which token should receive the highest attention score when the model processes `"it"`? Explain your reasoning using the Q/K/V framework.

### Exercise 3 — Temperature Experiment
Using ChatGPT, Claude, or any LLM API with temperature control:
1. Ask `"Write a one-sentence description of the ocean"` at temperature 0
2. Run the same prompt 5 times at temperature 0 — what do you notice?
3. Now run it at temperature 1.2 — how do the outputs differ?
4. What does this tell you about how temperature interacts with token probabilities?

### Exercise 4 — Draw the Pipeline
Without referring to this chapter, sketch the full pipeline from `"raw text"` to `"generated token"`. Include: tokeniser, embedding layer, positional encoding, N transformer blocks (with self-attention and FFN), output head, and sampling strategy.

### Exercise 5 — RLHF Role Play
In a small group or in writing, role-play the RLHF process:
- One person is the LLM generating 3 responses to: `"Explain quantum entanglement to a 10-year-old"`
- Others act as human rankers, ranking the responses and explaining their preferences
- Discuss: What criteria did you use? How would these criteria shape the reward model?

### Exercise 6 — Hallucination Hunt
Ask an LLM a question where you already know the detailed, verifiable answer (a specific historical event, a technical specification, a local fact). Record:
- What it said
- What was correct
- What was fabricated or distorted
- Why you think the hallucination occurred (unknown fact? plausible-sounding fiction?)

### Exercise 7 — Compare Models
Send the exact same prompt to GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro:  
`"Write a Python function to find all prime numbers up to n using the Sieve of Eratosthenes. Add a docstring and type hints."`  
Compare: code correctness, docstring quality, style choices. What does the variation tell you about their fine-tuning differences?

---

*Next Chapter → Chapter 25: Prompt Engineering*
