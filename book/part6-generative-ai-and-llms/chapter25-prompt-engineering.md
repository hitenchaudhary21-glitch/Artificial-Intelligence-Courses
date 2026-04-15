# Chapter 25: Prompt Engineering

> *"The quality of your question determines the quality of your answer."*

---

## 🎯 CONCEPT

**Prompt engineering** is the practice of designing, structuring, and iterating on the text inputs you give to an LLM to reliably produce high-quality, accurate, and useful outputs. It is part science, part craft — grounded in an understanding of how LLMs process context, and refined through deliberate experimentation.

A great prompt is not flattery or magic words. It is **precise communication with a probabilistic system**: you shape the model's probability distribution over possible responses by providing the right context, examples, constraints, and framing.

```
THE PROMPT ENGINEERING FEEDBACK LOOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Define Goal
      │
      ▼
  Write Prompt ──────────────────────────┐
      │                                  │
      ▼                                  │
  Run Model                              │
      │                                  │
      ▼                                  │
  Evaluate Output                        │
      │                                  │
      ├── Good enough? ──▶ Done ✓        │
      │                                  │
      └── Needs work? ──▶ Diagnose ──────┘
                          (too vague?
                           missing context?
                           wrong format?
                           needs examples?)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This chapter covers the complete toolkit: prompting strategies, structural frameworks, system vs. user prompts, advanced techniques like RAG and prompt chaining, and practical templates you can use immediately.

---

## 🧑‍🏫 TEACH (Feynman Style)

### Talk to the Model Like a Very Smart Intern on Day One

Imagine you have just hired a brilliant, highly-read intern who has never worked at your company before. They know everything in textbooks but nothing about your specific context, preferences, or definition of "good."

If you say: `"Write me a report"` — you'll get something generic.

If you say: `"Write a two-page executive briefing for the CFO on Q3 marketing ROI. Use bullet points for the summary and a table for channel-by-channel breakdown. Our CFO prefers numbers over narrative. Here are the raw metrics: [data]."` — you'll get something genuinely useful.

The intern analogy reveals the four things every great prompt provides:
1. **Role / context** — who the model should be and what it already "knows"
2. **Task** — precisely what you want done
3. **Format** — how the output should be structured
4. **Constraints** — length, tone, audience, things to avoid

---

## 🔬 DEEP UNDERSTANDING

### 1. Zero-Shot Prompting

Ask the model to perform a task with no examples. Works well for common tasks the model saw frequently in training.

```
ZERO-SHOT EXAMPLE
──────────────────────────────────────────
Prompt:
  Classify the sentiment of this review:
  "The battery died after 3 hours. Terrible product."

Output:
  Negative
──────────────────────────────────────────
```

**When to use:** Simple, well-defined tasks. Quick iteration. When you do not have examples ready.

**Limitation:** For complex or unusual tasks, the model may not know what "good" looks like without examples.

### 2. Few-Shot Prompting

Provide 2–5 examples (shots) of the task before your actual query. The model infers the pattern and applies it.

```
FEW-SHOT EXAMPLE
──────────────────────────────────────────
Prompt:
  Convert informal feedback to professional language.

  Informal: "This app crashes all the time"
  Professional: "The application exhibits frequent unexpected terminations."

  Informal: "The UI looks ancient"
  Professional: "The interface design appears dated and may benefit from modernisation."

  Informal: "Nobody understands this feature"
  Professional: [MODEL COMPLETES THIS]

Output:
  "The feature's discoverability and usability may require improvement."
──────────────────────────────────────────
```

**Why it works:** Each example narrows the model's distribution toward the target format, tone, and style. You are effectively doing in-context learning — teaching without updating weights.

**Tips:**
- Use diverse examples that cover edge cases
- Order matters: examples closer to the query have more influence
- 3–5 shots usually saturates the benefit; more rarely helps

### 3. Chain-of-Thought (CoT) Prompting

For reasoning tasks, instruct the model to *think step by step* before giving an answer. This dramatically improves accuracy on maths, logic, and multi-step problems.

```
WITHOUT CoT:
  Q: "Roger has 5 tennis balls. He buys 2 more cans of 3 balls each.
      How many tennis balls does he have?"
  A: "11" ← often correct, but model may miss harder versions

WITH CoT:
  Q: [same question] "Let's think step by step."
  A: Roger starts with 5 balls.
     He buys 2 cans × 3 balls = 6 balls.
     Total: 5 + 6 = 11 balls.
     Answer: 11 ✓
```

For harder reasoning, the model's intermediate steps catch arithmetic errors and logical leaps that would otherwise go unnoticed.

**Zero-shot CoT:** Simply append `"Let's think step by step."` to any reasoning prompt — it works surprisingly well even without examples.

**Tree of Thought (ToT):** An advanced extension where the model explores multiple reasoning branches and evaluates which path leads to the best answer. Useful for complex planning tasks.

### 4. Role Prompting

Assign the model a persona to prime it toward a particular knowledge domain, tone, and perspective.

```
ROLE PROMPT EXAMPLES
──────────────────────────────────────────────────────────────
"You are a senior data engineer with 15 years of experience
 in distributed systems. Review the following SQL query for
 performance issues and explain your reasoning."

"You are a Socratic tutor. Do not give direct answers.
 Instead, ask guiding questions that lead the student to
 discover the answer themselves."

"You are a harsh but fair code reviewer. Be blunt about
 problems. Prioritise correctness over politeness."
──────────────────────────────────────────────────────────────
```

Role prompting is especially effective because it activates clusters of training data associated with that persona's domain expertise and communication style.

### 5. The RISEN Framework

A structured template for professional prompts:

```
R – ROLE          Who should the model be?
I – INSTRUCTIONS  What should it do? Step by step if needed.
S – STEPS         Break the task into sub-tasks
E – END GOAL      What does success look like?
N – NARROWING     Constraints, format, tone, length, exclusions
```

**Example — RISEN in action:**

```
R: You are an experienced Python developer and technical writer.

I: Write a tutorial introducing Python list comprehensions
   to beginners who already know basic Python loops.

S: 1. Explain what list comprehensions are and why they matter
   2. Show the syntax structure with annotations
   3. Give 3 examples progressing from simple to complex
   4. Show the equivalent for-loop for each example
   5. End with one practice exercise

E: A reader who finishes should be able to write their own
   list comprehensions for simple filtering and transformation tasks.

N: Target audience: complete beginners. Max 600 words.
   Use code blocks. Avoid jargon. Do not use lambda functions.
```

### 6. System vs. User Prompts

Modern LLM APIs (OpenAI, Anthropic, etc.) support distinct message roles:

```
┌─────────────────────────────────────────────────────────────┐
│  PROMPT STRUCTURE IN CHAT APIs                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ SYSTEM PROMPT                                        │  │
│  │ Sets the model's persistent identity, rules,        │  │
│  │ and context for the entire conversation.            │  │
│  │ The user does not typically see this.               │  │
│  │                                                      │  │
│  │ Example: "You are a customer support agent for      │  │
│  │ AcmeCorp. Only answer questions about our products. │  │
│  │ Always be polite. Never discuss competitors."       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ USER MESSAGE 1                                       │  │
│  │ "How do I reset my password?"                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ASSISTANT MESSAGE 1                                  │  │
│  │ [model response]                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ USER MESSAGE 2                                       │  │
│  │ "What about your competitor's product?"              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**System prompt best practices:**
- Define persona, domain, and tone once in the system prompt
- Set hard constraints (format, length, topics to avoid)
- Keep it focused — overly long system prompts dilute attention

### 7. Bad Prompt → Good Prompt Transformation Table

| # | Bad Prompt | Problem | Good Prompt |
|---|---|---|---|
| 1 | `"Write about AI"` | No scope, no audience, no format | `"Write a 300-word introduction to machine learning for a non-technical business executive. Use an analogy and no jargon."` |
| 2 | `"Fix my code"` | No code provided, no error described | `"Here is my Python function: [code]. It raises a KeyError on line 7 when the input dict is empty. Fix the bug and explain what caused it."` |
| 3 | `"Make it better"` | 'Better' is undefined | `"Rewrite the following paragraph to be more concise (under 50 words), active voice, and suitable for a LinkedIn post audience."` |
| 4 | `"What's the answer to the marketing problem?"` | No problem described | `"Our email open rate dropped 30% in March. We changed subject line style from questions to statements. Suggest 3 hypotheses for the drop and how to test each."` |
| 5 | `"Be creative"` | No task, no output format | `"Generate 5 unique product name ideas for a mindfulness app targeting Gen Z. Each name should be one or two words, modern, and suggest calm without being cliché."` |

### 8. Retrieval-Augmented Generation (RAG)

LLMs have a knowledge cutoff and cannot access private documents. **RAG** solves this by retrieving relevant documents at query time and injecting them into the prompt:

```
RAG PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Your Documents (PDFs, docs, wiki pages)
         │
         ▼
  Chunk + Embed ──── split into ~500-token passages,
         │           convert each to a vector embedding
         ▼
  Vector Database (Pinecone, Chroma, Weaviate)
         │
         │  At query time:
         ▼
  User Query ──▶ Embed Query ──▶ Search Vector DB
                                        │
                                        ▼
                              Top-K Relevant Chunks
                                        │
                                        ▼
  ┌─────────────────────────────────────────────┐
  │ AUGMENTED PROMPT:                           │
  │ "Using ONLY the context below, answer the  │
  │ user's question. If the answer is not in   │
  │ the context, say so.                        │
  │                                             │
  │ CONTEXT: [retrieved chunks]                 │
  │                                             │
  │ QUESTION: [user query]"                     │
  └─────────────────────────────────────────────┘
         │
         ▼
  LLM generates grounded, citation-able answer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

RAG dramatically reduces hallucinations for knowledge-intensive tasks by anchoring the model to a verified source.

### 9. Prompt Chaining

For complex multi-step tasks, break the work into a chain of sequential prompts where each output feeds the next:

```
PROMPT CHAIN EXAMPLE: Research → Draft → Review

  Prompt 1: "Identify the 5 most important trends in
             renewable energy in 2024. Output as a JSON list."
             │
             ▼ [JSON trends list]
  Prompt 2: "Using this list of trends: [JSON], write a
             400-word blog post introduction targeting
             clean energy investors."
             │
             ▼ [draft introduction]
  Prompt 3: "Review the following blog draft for factual
             accuracy, clarity, and persuasiveness. Suggest
             3 specific improvements with examples."
```

Prompt chaining enables: longer documents than a single context window allows, quality checkpointing, and specialised models per step.

### 10. Practical Prompt Templates

**Template 1 — Explain a Concept**
```
Explain [CONCEPT] to someone who understands [PREREQUISITE LEVEL]
but has never encountered [CONCEPT] before. Use an analogy
involving [FAMILIAR DOMAIN]. Keep it under [WORD COUNT] words.
```

**Template 2 — Code Review**
```
Review the following [LANGUAGE] code for:
1. Bugs or logic errors
2. Performance issues
3. Security vulnerabilities
4. Style/readability

Code:
[PASTE CODE]

For each issue: describe the problem, explain why it matters,
and provide the corrected code.
```

**Template 3 — Decision Analysis**
```
I need to decide between [OPTION A] and [OPTION B] for [CONTEXT].

Constraints: [LIST CONSTRAINTS]
My priorities are: [LIST PRIORITIES, ORDERED]

Analyse both options against my priorities, highlight trade-offs,
and recommend one with your reasoning. Format as a comparison table
followed by a recommendation paragraph.
```

**Template 4 — Summarise and Extract**
```
Read the following text and:
1. Write a 3-sentence summary
2. Extract all [ACTION ITEMS / KEY DATES / NAMED ENTITIES / etc.]
   as a bulleted list
3. Identify the single most important takeaway

Text: [PASTE TEXT]
```

---

## 🔄 REVIEW

**Core prompt engineering concepts:**

1. **Zero-shot** — task only, no examples. Works for common tasks.
2. **Few-shot** — 2–5 examples before the task. Teaches the pattern.
3. **Chain-of-thought** — "step by step" reasoning improves accuracy on logic/maths.
4. **Role prompting** — assigns a persona to prime domain knowledge and tone.
5. **RISEN framework** — Role, Instructions, Steps, End Goal, Narrowing.
6. **System vs. user prompts** — system sets persistent context; user carries the per-turn task.
7. **RAG** — inject retrieved documents into the prompt to ground responses in facts.
8. **Prompt chaining** — decompose complex tasks into a sequence of focused prompts.

**Diagnosis checklist when output is poor:**
```
☐ Did I specify the audience?
☐ Did I specify the format/length?
☐ Did I provide enough context?
☐ Did I show an example of what "good" looks like?
☐ Am I asking too many things in one prompt?
☐ Are my constraints specific or vague?
```

---

## ✨ SIMPLIFY

| Term | Plain Language |
|---|---|
| Prompt | The text you send to an AI model |
| Zero-shot | Asking without giving examples |
| Few-shot | Giving a few examples to show what you want |
| Chain-of-thought | Asking the model to show its working |
| System prompt | Instructions written before the conversation that shape how the AI behaves |
| RAG | Giving the AI the right book chapters before asking the question |
| Prompt chaining | Breaking a big task into smaller, connected steps |
| Temperature | How adventurous the AI is — low = precise, high = creative |
| RISEN | A fill-in-the-blanks template for professional prompts |

**One-sentence summary:**  
Prompt engineering is the skill of communicating precisely with an LLM by structuring your inputs with the right role, context, examples, and constraints — and iterating based on output quality — to reliably unlock the model's full capability.

---

## 🏋️ PRACTICE

### Exercise 1 — Rewrite 5 Bad Prompts
Rewrite each of the following vague prompts into well-engineered versions using what you have learned. Apply at least one technique per prompt (RISEN, few-shot, CoT, role, format spec):

1. `"Tell me about machine learning"`
2. `"Write an email"`
3. `"Help me with my essay"`
4. `"What should I do about this bug?"` *(no code provided)*
5. `"Make a plan"`

For each, identify: what was wrong with the original, which technique you applied, and why.

### Exercise 2 — Few-Shot Pattern Design
Create a 3-shot few-shot prompt that teaches an LLM to convert passive-voice sentences to active voice. Your examples should cover:
- Simple subject-verb-object
- A sentence with an ambiguous subject
- A technical sentence

Test your prompt on 3 new sentences.

### Exercise 3 — Chain-of-Thought Challenge
Compare model accuracy with and without chain-of-thought on these problems:
1. `"A farmer has 17 sheep. All but 9 run away. How many are left?"` 
2. `"If you overtake the person in 2nd place in a race, what position are you in?"`

Run each with and without `"Let's think step by step."` Record whether CoT helped, hurt, or made no difference. Why?

### Exercise 4 — Build a System Prompt
You are building a customer-facing chatbot for a fictional online bookstore called **PageTurner**. Write a complete system prompt that:
- Defines the assistant's role and persona
- Lists 3 things it WILL help with
- Lists 3 things it will NOT discuss
- Specifies tone (warm, professional, concise)
- Handles the case where it does not know an answer

### Exercise 5 — RAG Design
Describe (without coding) how you would use RAG to build a chatbot that answers questions about a company's internal HR policy documents. Include:
- How you would chunk and embed the documents
- What vector database you would use and why
- What the augmented prompt template would look like
- How you would handle the case where no relevant chunk is found

### Exercise 6 — Prompt Chain
Design a 3-step prompt chain for the following task: *"Analyse customer reviews and produce a prioritised product improvement roadmap."*

Write the actual prompts for each step, specifying the input format for each step and the expected output format that feeds the next.

### Exercise 7 — Peer Comparison
Share a prompt you have written with a classmate or colleague. Exchange prompts and:
1. Try to improve each other's prompt using techniques from this chapter
2. Run both versions (original and improved) on the same model
3. Compare outputs — did the improvement work? Why or why not?

---

*Next Chapter → Chapter 26: AI Tools & Ecosystem*
