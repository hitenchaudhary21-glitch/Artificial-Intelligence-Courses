# Chapter 33: Career Paths in AI

> *"There is no single path into AI. There are as many entry points as there are backgrounds — and the field is desperate for people who bring diverse perspectives to hard problems."*

---

## 🎯 CONCEPT

AI is one of the fastest-growing fields in history. But "work in AI" is not one job — it's a broad ecosystem of roles that require very different skills, mindsets, and daily workflows. Understanding the landscape helps you pick the right target, build the right skills, and avoid wasting years preparing for a job that doesn't match who you are.

**What you'll understand by the end:**

- The **six major AI career paths** and what they actually involve day-to-day
- A **skills matrix** for each role
- **Realistic salary ranges** across experience levels and geographies
- How to **break into AI from different backgrounds** (software, science, business, humanities)
- **Remote and global opportunities** in the AI job market

---

## 🧑‍🏫 TEACH (Feynman Style)

### Six Roles, One Ecosystem

Think of an AI product team like a movie production crew. You need directors (Product Managers), cinematographers (ML Engineers), storytellers (Data Scientists), set builders (MLOps), special effects artists (AI Researchers), and translators for non-technical stakeholders (Prompt Engineers). Every role matters. Not everyone needs to direct.

#### Role 1: Machine Learning Engineer (MLE)

**What they actually do:** Write production code that trains, deploys, and maintains ML models. Bridge between research prototypes and real systems.

**Day-to-day:** Writing PyTorch/TensorFlow training pipelines, optimizing inference latency, debugging why the model behaves differently in production than in Jupyter notebooks, code reviews, and lots of Python.

**Core identity:** Software engineer who specializes in ML systems. The "engineering" is as important as the "machine learning."

**Best for:** People who love coding and want to build things that scale.

#### Role 2: Data Scientist

**What they actually do:** Analyze data to surface business insights and build models that inform decisions. Often more statistics and SQL than deep learning.

**Day-to-day:** Data wrangling, feature engineering, building predictive models (often classical ML — XGBoost, logistic regression), communicating findings to stakeholders via visualizations and presentations.

**Core identity:** Applied statistician with coding skills and business sense.

**Best for:** People who love asking "why" questions about data and communicating answers clearly.

#### Role 3: AI Researcher

**What they actually do:** Advance the state of the art. Push the boundaries of what's possible, publish findings, attend conferences.

**Day-to-day:** Reading papers, designing experiments, writing code to test hypotheses, writing papers, giving talks, mentoring.

**Core identity:** Scientist. The goal is knowledge, not just working software.

**Best for:** People who love open-ended problems and are comfortable with long periods of uncertainty.

#### Role 4: AI Product Manager (AI PM)

**What they actually do:** Define what AI products get built, translate business needs into technical requirements, and ensure AI capabilities align with user value.

**Day-to-day:** Writing product specs, running user research, prioritizing features, communicating with engineers and executives, navigating the gap between "what's technically possible" and "what customers will pay for."

**Core identity:** Translator between business and technical teams who deeply understands AI capabilities and limitations.

**Best for:** People who love strategy, communication, and shaping product direction.

#### Role 5: MLOps Engineer

**What they actually do:** Build and maintain the infrastructure that makes ML reliable at scale: training pipelines, model registries, monitoring, CI/CD for models.

**Day-to-day:** Setting up Kubeflow or MLflow pipelines, configuring model monitoring for data drift, writing infrastructure-as-code, responding to model degradation incidents.

**Core identity:** DevOps engineer who has specialised in the unique challenges of ML systems (data versioning, experiment tracking, model versioning, deployment patterns).

**Best for:** People who love infrastructure, automation, and keeping things running reliably.

#### Role 6: Prompt Engineer / AI Application Developer

**What they actually do:** Design, optimize, and evaluate prompts and LLM-based workflows. Build applications on top of foundation models.

**Day-to-day:** Writing and refining system prompts, building RAG pipelines, evaluating LLM outputs, designing agent workflows (LangChain, LlamaIndex), AB testing prompt variants.

**Core identity:** A new role. Part UX designer, part developer, part linguist, part ML practitioner.

**Best for:** People fascinated by LLMs who want to build real applications quickly without needing deep ML training from scratch.

---

## 🔬 DEEP UNDERSTANDING

### Career Map: Roles, Skills, and Transitions

```
    ┌──────────────────────────────────────────────────────────────┐
    │                    AI CAREER MAP                              │
    │                                                               │
    │   FOUNDATION SKILLS (everyone needs these):                   │
    │   Python · Statistics · Linear Algebra · Git · SQL            │
    │                            │                                  │
    │            ┌───────────────┼───────────────┐                  │
    │            ▼               ▼               ▼                  │
    │     [Engineering]    [Science]       [Product/Ops]            │
    │          │                │                │                  │
    │    ┌─────┴──────┐  ┌──────┴─────┐  ┌──────┴──────┐          │
    │    │ ML Engineer│  │   Data     │  │  AI Product  │          │
    │    │            │  │ Scientist  │  │   Manager    │          │
    │    └─────┬──────┘  └──────┬─────┘  └──────┬──────┘          │
    │          │                │                │                  │
    │          ▼                ▼                ▼                  │
    │    ┌──────────┐    ┌───────────┐    ┌───────────┐            │
    │    │  MLOps   │    │    AI     │    │  Prompt   │            │
    │    │ Engineer │    │ Researcher│    │ Engineer  │            │
    │    └──────────┘    └───────────┘    └───────────┘            │
    │                                                               │
    │   Transition paths (common):                                  │
    │   SWE ──────────────────────────► ML Engineer, MLOps         │
    │   Data Analyst ─────────────────► Data Scientist             │
    │   Researcher (academia) ────────► AI Researcher              │
    │   PM (tech) ────────────────────► AI Product Manager         │
    │   Domain Expert (medical, legal) ► AI Application Developer  │
    └──────────────────────────────────────────────────────────────┘
```

### Skills Matrix: What Each Role Requires

| Skill | ML Engineer | Data Scientist | AI Researcher | AI PM | MLOps | Prompt Eng |
|-------|:-----------:|:--------------:|:-------------:|:-----:|:-----:|:----------:|
| Python (advanced) | ★★★★★ | ★★★★ | ★★★★ | ★★ | ★★★★ | ★★★ |
| Statistics / Probability | ★★★ | ★★★★★ | ★★★★★ | ★★ | ★★ | ★★ |
| Deep Learning (PyTorch/TF) | ★★★★★ | ★★★ | ★★★★★ | ★ | ★★★ | ★★ |
| Math (Linear Algebra/Calculus) | ★★★ | ★★★ | ★★★★★ | ★ | ★★ | ★ |
| SQL + Data Wrangling | ★★★ | ★★★★★ | ★★ | ★★★ | ★★★ | ★★ |
| Software Engineering (Systems) | ★★★★★ | ★★★ | ★★★ | ★★ | ★★★★★ | ★★★ |
| Cloud / Infrastructure (AWS/GCP) | ★★★★ | ★★ | ★★ | ★★ | ★★★★★ | ★★★ |
| Communication / Storytelling | ★★★ | ★★★★ | ★★★★ | ★★★★★ | ★★ | ★★★★ |
| Research / Paper Reading | ★★★ | ★★ | ★★★★★ | ★★ | ★★ | ★★★ |
| LLM APIs (OpenAI, HuggingFace) | ★★★ | ★★ | ★★★ | ★★ | ★★★ | ★★★★★ |

*★ = Nice to have, ★★★★★ = Essential*

### Salary Expectations (2024, USD)

**Important context:** Salaries vary enormously by company (FAANG vs. startup vs. academia), geography, and specialisation. These are broad market ranges.

```
    ┌──────────────────────────────────────────────────────┐
    │           SALARY RANGES (USD, 2024 estimate)          │
    │                                                        │
    │  Role                  | Entry      | Mid     | Senior │
    │  ──────────────────────┼────────────┼─────────┼─────── │
    │  ML Engineer           | $100–130K  | $150–200K| $200K+ │
    │  Data Scientist        | $85–110K   | $120–160K| $170K+ │
    │  AI Researcher (industry)| $120–150K| $180–250K| $300K+ │
    │  AI Product Manager    | $110–140K  | $160–200K| $230K+ │
    │  MLOps Engineer        | $100–130K  | $150–190K| $200K+ │
    │  Prompt Engineer       | $70–110K   | $100–150K| $160K+ │
    │                                                        │
    │  Top-tier (FAANG/OpenAI/Anthropic): add 30–100%        │
    │  Europe: roughly 60–70% of US rates                    │
    │  Remote global roles: varies widely, often US-pegged   │
    └──────────────────────────────────────────────────────┘
```

### Breaking In From Different Backgrounds

```
    FROM SOFTWARE ENGINEERING:
    ─────────────────────────
    You already have: Coding, systems thinking, git, debugging
    You need to add: ML concepts, PyTorch/sklearn, statistics
    Fastest path: ML Engineer or MLOps
    Timeline: 6–12 months of focused upskilling
    Entry move: Build ML projects, get an ML-focused internship
               or internal transfer at current company

    FROM DATA ANALYTICS / BUSINESS INTELLIGENCE:
    ─────────────────────────────────────────────
    You already have: SQL, data intuition, stakeholder communication
    You need to add: Python, ML algorithms, A/B testing
    Fastest path: Data Scientist
    Timeline: 6–18 months
    Entry move: Kaggle competitions + portfolio projects

    FROM ACADEMIA / RESEARCH:
    ──────────────────────────
    You already have: Research skills, deep domain knowledge, math
    You need to add: Engineering practices, production code, GitHub
    Fastest path: AI Researcher (industry) or ML Engineer
    Timeline: 3–12 months for engineering skills
    Entry move: Publish to arXiv, attend conferences, research internship

    FROM PRODUCT / BUSINESS:
    ──────────────────────────
    You already have: Communication, user research, strategic thinking
    You need to add: AI literacy, basic Python, prompt engineering
    Fastest path: AI Product Manager or AI Application Developer
    Timeline: 3–9 months
    Entry move: Build AI-powered projects, get certified in LLM APIs

    FROM UNRELATED FIELDS (medicine, law, humanities):
    ────────────────────────────────────────────────────
    You already have: Domain expertise that AI desperately needs
    You need to add: Python basics, ML concepts, relevant AI tools
    Fastest path: Domain-specific AI PM / Application Developer
    Timeline: 6–18 months
    Entry move: Build a tool at the intersection of your domain + AI
```

### Remote and Global Opportunities

The AI job market is more globally distributed than almost any other tech specialty:

- **Remote-first AI companies:** Hugging Face, Weights & Biases, Scale AI, Cohere, Mistral
- **Strong non-US hubs:** London, Toronto, Montreal, Berlin, Singapore, Tel Aviv, Paris
- **Remote job boards:** LinkedIn (filter: remote), Wellfound (formerly AngelList), Lever, Greenhouse
- **Contractor / freelance:** Toptal, Upwork (ML/AI category), AI-specific marketplaces
- **Research labs with international presence:** Google DeepMind (London, Zurich, NYC), Meta AI, Microsoft Research

**Visa programs for AI workers:** Many countries now offer fast-track tech visas — UK's Global Talent visa, Canada's Global Skills Strategy, Germany's Opportunities Card, Singapore's Tech.Pass.

---

## 🔄 REVIEW

**Six AI Roles:**
1. **ML Engineer** — builds and deploys ML systems; needs strong coding + ML
2. **Data Scientist** — analyzes data, builds models for decisions; needs stats + communication
3. **AI Researcher** — pushes SOTA; needs deep math + research skills
4. **AI Product Manager** — defines what gets built; needs business + AI literacy
5. **MLOps Engineer** — maintains ML infrastructure; needs systems + DevOps
6. **Prompt Engineer** — builds LLM applications; needs LLM APIs + product thinking

**Skills Matrix Highlights:**
- Everyone needs Python + statistics + Git
- Researchers need the most math; PMs need the least
- MLOps is the most infrastructure-heavy; Data Scientists need the most SQL

**Salary:**
- Entry range: $70–150K depending on role and company
- Top-tier companies pay significantly more
- Remote roles increasingly offer US-comparable salaries globally

**Breaking In:**
- Software background → ML Engineer / MLOps
- Analytics background → Data Scientist
- Academic background → AI Researcher / MLE
- Business background → AI PM
- Domain expert → AI Application Developer

---

## ✨ SIMPLIFY

The question isn't "How do I get into AI?" — it's "**Which AI role fits how my brain works?**"

```
    Do you love building systems that scale?          → ML Engineer
    Do you love finding stories hidden in data?       → Data Scientist
    Do you love open-ended research questions?        → AI Researcher
    Do you love strategy and shaping products?        → AI Product Manager
    Do you love infrastructure and reliability?       → MLOps Engineer
    Do you love building apps quickly with LLMs?      → Prompt Engineer / AI Dev
```

**The dirty secret:** Most roles require a mix, and the best practitioners borrow skills from adjacent roles. An ML Engineer who can communicate findings like a Data Scientist is invaluable. A Researcher who understands production constraints like an MLOps engineer ships better research.

---

## 🏋️ PRACTICE

### Self-Assessment Exercises

1. **Role Inventory:** Using the skills matrix, honestly rate yourself in each skill area from 1–5. For the three roles you find most interesting, calculate your average skills coverage. Which role are you closest to qualifying for right now? Which requires the most upskilling?

2. **Job Posting Analysis:** Find 5 current job postings for "ML Engineer" and 5 for "Data Scientist" on LinkedIn or Indeed. Extract the required skills from each. Create your own skills frequency table. Do the job postings confirm or contradict the skills matrix in this chapter?

3. **Salary Research:** Use levels.fyi, Glassdoor, and LinkedIn Salary to research actual compensation for one AI role in your target city or for remote work. How does it compare to the ranges above? What factors (company size, industry, specialization) seem to have the biggest effect?

4. **Career Path Mapping:** Draw your personal career transition path:
   - Where are you now? (current skills, current role/background)
   - Where do you want to be? (target role)
   - What's the gap? (skills to acquire)
   - What's the realistic timeline? (be honest)
   - What are the three next concrete actions?

### Research Exercises

5. **Informational Interview:** Find someone on LinkedIn who has a job title you're targeting. Send them a brief, polite message asking for 20 minutes to ask questions about their day-to-day work and how they got there. Most people in AI are surprisingly willing to help — especially if your message is specific and respectful of their time.

6. **Company Research:** Pick 10 AI companies you find interesting. For each, research: (a) their primary AI products, (b) which AI roles they hire for most, (c) their culture signals (Glassdoor, employee LinkedIn posts). Rank them by fit for your target role and personal values.

7. **Freelance Experiment:** Create an Upwork or Toptal profile around an AI skill you already have (even basic skills: data labeling, simple model evaluation, prompt writing). Submit a proposal for a small project. The goal isn't income — it's getting market feedback on your current skill level and identifying gaps.

8. **Role Shadowing:** Find 3 YouTube channels or Twitch streams of people in your target role (e.g., ML Engineers doing code reviews, Data Scientists doing EDA livestreams, AI researchers explaining papers). Watch 2–3 hours. How realistic does the day-to-day look compared to job postings? What surprised you?

### Career Strategy

9. **T-Shaped Skills Plan:** For the AI role you're targeting, identify: (a) one area where you will go deep (the vertical of the T — your specialisation), and (b) three adjacent areas where you'll develop working knowledge (the horizontal). Write a 6-month learning plan with monthly milestones.

10. **Network Map:** Map your current professional network. For each person, note: do they work in AI? Could they introduce you to someone who does? Identify 5 people to reconnect with and 5 new people to meet in the next 3 months. Track outreach in a simple spreadsheet.

---

*Next Chapter: Building Your AI Portfolio — turning what you've learned into proof that you can do the work.*
