# Chapter 32: AI Research Basics

> *"Reading a paper isn't about absorbing every equation on the first pass — it's about extracting the idea, testing it against your intuition, and deciding if it matters."*

---

## 🎯 CONCEPT

AI research can feel like an exclusive club with its own language, rituals, and gatekeeping. It isn't. This chapter demystifies the academic side of AI: how papers are structured, how to actually read them (most people do this wrong), where great research is published, how to reproduce experiments, and how to start your own research journey — even without a PhD.

**What you'll understand by the end:**

- The **3-pass method** for reading AI papers efficiently
- The **major venues** where AI research is published (NeurIPS, ICML, ICLR, ACL, CVPR)
- The **anatomy of an AI paper** — what each section really contains
- Why **reproducing results** is both hard and essential
- How to **stay current** without drowning in the arXiv firehose
- How to **start your first research project** from scratch

---

## 🧑‍🏫 TEACH (Feynman Style)

### Why Most People Read Papers Wrong

The average first-time paper reader opens the PDF, starts at the abstract, and dutifully reads every word from page 1 to page 14. By page 6 they're lost in notation. By page 10 they've forgotten the original question. By page 14 they're not sure they learned anything.

The fix is simple: **don't read a paper once — read it three times, each with a different goal.**

#### The 3-Pass Method (Keshav, 2007)

```
    ┌─────────────────────────────────────────────────────────┐
    │                  THE 3-PASS METHOD                       │
    └─────────────────────────────────────────────────────────┘

    PASS 1 — The Bird's Eye View (5–10 minutes)
    ┌────────────────────────────────────────────┐
    │  Read: Title, Abstract, Introduction       │
    │  Skim: Section headings, Conclusion        │
    │  Glance: Figures and their captions        │
    │  Goal: Answer these 5 questions:           │
    │    1. What problem does this paper solve?  │
    │    2. What approach did they take?         │
    │    3. What are the main results?           │
    │    4. Is this relevant to me?              │
    │    5. Should I read it in full?            │
    └────────────────────────────────────────────┘
               ↓ (only if worth continuing)
    PASS 2 — Grasp the Content (1–2 hours)
    ┌────────────────────────────────────────────┐
    │  Read everything except dense proofs       │
    │  Annotate key claims and evidence          │
    │  Sketch the model/method in your own words │
    │  Note what you don't understand yet        │
    │  Goal: Explain the paper to a smart friend │
    └────────────────────────────────────────────┘
               ↓ (only for papers you'll implement)
    PASS 3 — Virtual Re-Implementation (4–8 hours)
    ┌────────────────────────────────────────────┐
    │  Read every equation and proof             │
    │  Trace through every experiment decision   │
    │  Challenge every assumption                │
    │  Look up every cited paper you don't know  │
    │  Goal: Could you reproduce this paper?     │
    └────────────────────────────────────────────┘
```

**The rule of thumb:** 90% of papers you encounter need only Pass 1. 9% need Pass 2. 1% — the ones that fundamentally change your direction — need Pass 3.

### The Major AI Venues

AI research doesn't just live in journals — most of the top work appears first at **conferences**, often simultaneously as preprints on **arXiv**.

```
    ┌──────────────────────────────────────────────────────────┐
    │                  AI RESEARCH VENUES MAP                   │
    ├──────────────────┬───────────────────────────────────────┤
    │ GENERAL ML/AI    │  NeurIPS, ICML, ICLR, AAAI, IJCAI    │
    ├──────────────────┼───────────────────────────────────────┤
    │ COMPUTER VISION  │  CVPR, ICCV, ECCV                     │
    ├──────────────────┼───────────────────────────────────────┤
    │ NLP / LLMs       │  ACL, EMNLP, NAACL, COLING            │
    ├──────────────────┼───────────────────────────────────────┤
    │ ROBOTICS         │  ICRA, IROS, RSS, CoRL                 │
    ├──────────────────┼───────────────────────────────────────┤
    │ PREPRINT SERVER  │  arXiv.org (cs.LG, cs.CV, cs.CL)      │
    └──────────────────┴───────────────────────────────────────┘

    Prestige tier (rough guide):
    ★★★★★  NeurIPS, ICML, ICLR, CVPR, ACL
    ★★★★   ICCV, ECCV, EMNLP, NAACL, AAAI
    ★★★    IJCAI, COLING, ICRA, RSS
    (arXiv = not peer-reviewed but fastest dissemination)
```

**NeurIPS** (Conference on Neural Information Processing Systems) — the largest and most general ML conference. December. ~3,500 accepted papers/year.

**ICML** (International Conference on Machine Learning) — focuses on theory and methodology. July.

**ICLR** (International Conference on Learning Representations) — famous for open peer review (reviews are public). May.

**CVPR** (Computer Vision and Pattern Recognition) — the premier vision conference. June.

**ACL** (Association for Computational Linguistics) — the top NLP venue. July.

### Anatomy of an AI Paper

Every paper follows roughly the same structure. Knowing what each section *actually contains* (versus what it says it contains) makes reading much faster:

```
    ┌─────────────────────────────────────────────────────────┐
    │                ANATOMY OF AN AI PAPER                    │
    │                                                          │
    │  TITLE           What they built / discovered           │
    │  AUTHORS         Who did it (check affiliations)        │
    │  ABSTRACT        Summary of everything — read this hard │
    │  ─────────────────────────────────────────────────────  │
    │  INTRODUCTION    Problem motivation + contribution list  │
    │                  (find the bullet-pointed contributions) │
    │  RELATED WORK    What already existed; how this differs  │
    │  METHOD          The main technical contribution         │
    │  (or MODEL)      (equations, architecture diagrams)     │
    │  EXPERIMENTS     Datasets, baselines, metrics, ablations │
    │  RESULTS         Numbers proving the method works        │
    │  ANALYSIS /      Why it works (or where it fails)        │
    │  ABLATIONS       (remove one component at a time)        │
    │  CONCLUSION      Summary + future work                   │
    │  REFERENCES      Treasure map to related papers          │
    │  APPENDIX        Proofs, extra experiments, details      │
    └─────────────────────────────────────────────────────────┘

    Reading order for Pass 2:
    Abstract → Intro → Figures + Captions → Conclusion
    → Method → Experiments → Results → Related Work
```

**Secret weapon:** Read the figures *first*. The best papers tell their entire story through figures. If you understand all the figures, you understand 80% of the paper.

### Reproducing Results — The Hardest and Most Rewarding Skill

AI has a reproducibility crisis. A 2019 survey found that over 50% of NeurIPS papers couldn't be reproduced without contacting the authors. Here's why:

- Unreported hyperparameters
- Missing random seeds
- Dataset preprocessing details left out
- Hardware differences (A100 vs V100 vs TPU)
- Subtle implementation choices buried in appendices

**Practical reproduction workflow:**

```
    STEP 1: Find official code (GitHub link in paper / PapersWithCode)
    STEP 2: Check README for environment setup
    STEP 3: Run on the simplest dataset first
    STEP 4: Compare your numbers to Table 1
    STEP 5: If numbers differ → read appendix, check issues tab
    STEP 6: If still different → email the authors (they usually respond!)
    STEP 7: Document every discrepancy you find
    STEP 8: Share your reproduction notes publicly → instant credibility
```

Reproducing a paper is *publishable work*. The ML Reproducibility Challenge runs annually and accepts reproduction reports as full submissions.

### Staying Current Without Burning Out

The arXiv CS.LG feed publishes 50–150 new papers *every single day*. No human can read them all. Here's a sustainable system:

```
    DAILY (15 min):
    ├── Scan arXiv Sanity Preserver (karpathy.github.io/arxiv-sanity)
    ├── Check Twitter/X ML community (follow top researchers)
    └── Skim email digest from Papers With Code

    WEEKLY (1–2 hrs):
    ├── Hugging Face daily papers newsletter
    ├── Import AI by Jack Clark
    └── The Batch by deeplearning.ai (Andrew Ng)

    MONTHLY:
    ├── Read 1–2 papers end-to-end (Pass 3)
    └── Watch conference talk recordings (NeurIPS/ICML YouTube)
```

---

## 🔬 DEEP UNDERSTANDING

### What Makes a Great Paper Contribution?

The best AI papers do *one* of these things exceptionally well:

| Contribution Type | Example | Signal |
|------------------|---------|--------|
| New architecture | Attention Is All You Need (Transformer) | SOTA on many benchmarks |
| New algorithm | AlphaGo's MCTS + RL | Superhuman performance |
| New training technique | Dropout, Batch Norm | Consistent improvement across models |
| New dataset | ImageNet, SQuAD, GLUE | Enables future research |
| New theoretical insight | Lottery Ticket Hypothesis | Explains observed phenomena |
| New evaluation / benchmark | BIG-Bench, HELM | Reveals model weaknesses |

### How Peer Review Actually Works

```
    SUBMISSION
        ↓
    AREA CHAIR assigns 3–4 REVIEWERS (usually PhD students / faculty)
        ↓
    REVIEWERS submit scores (1–10) + written reviews (3–8 weeks)
        ↓
    AUTHORS respond to reviews (the rebuttal phase)
        ↓
    REVIEWERS update scores
        ↓
    AREA CHAIR makes accept / reject recommendation
        ↓
    PROGRAM CHAIRS make final decision
        ↓
    ~20–25% acceptance rate at top venues
```

**ICLR innovation:** reviews and scores are published publicly, even for rejected papers. You can read the full review history of any ICLR submission at openreview.net.

### Research Cycle: From Idea to Impact

```
    ┌────────────────────────────────────────────────────────┐
    │                   RESEARCH CYCLE                        │
    │                                                         │
    │  [Literature Review] ──► [Identify Gap] ──► [Hypothesis]│
    │          ▲                                      │       │
    │          │                                      ▼       │
    │  [Revise & Iterate] ◄── [Implement & Experiment]        │
    │          │                     │                        │
    │          │                     ▼                        │
    │          └──────── [Analyze Results]                    │
    │                          │                             │
    │                          ▼                             │
    │               [Write Paper] ──► [Submit]               │
    │                                     │                  │
    │                          ┌──────────┴──────────┐       │
    │                          ▼                     ▼       │
    │                      [Accept]             [Reject]     │
    │                          │                     │       │
    │                          ▼                     ▼       │
    │                    [Publish!]          [Revise + Resubmit]│
    └────────────────────────────────────────────────────────┘
```

### Starting Your First Research Project: The Three Strategies

**Strategy 1 — Reproduce and Extend**
Pick a recent paper, reproduce it, then change one variable. What happens if you apply this method to a different domain? Use a different backbone? Train with less data? You've already done original research.

**Strategy 2 — Find an Intersection**
Find two unrelated areas and ask: *what happens if I combine these?* Transformers + drug discovery, contrastive learning + medical imaging, RL + code generation. The most surprising papers come from unexpected intersections.

**Strategy 3 — Start from a Problem**
You have a real problem (in your job, hobby, or research). What's the best existing technique for it? Does it work well enough? If not — why not? That gap is your research question.

---

## 🔄 REVIEW

**3-Pass Method:**
- Pass 1: 5–10 min, bird's-eye view, answer the 5 questions
- Pass 2: 1–2 hrs, understand the content
- Pass 3: 4–8 hrs, virtually re-implement — only for key papers

**Key Venues:**
- NeurIPS, ICML, ICLR (general ML) — the most prestigious
- CVPR, ICCV, ECCV (vision)
- ACL, EMNLP, NAACL (NLP)
- arXiv = preprint, not peer reviewed, but fastest

**Paper Anatomy:**
- Abstract → Intro (find contribution list) → Method → Experiments → Results
- Read figures first — they tell most of the story

**Reproducibility:**
- Over 50% of papers have reproducibility issues
- Always start with official code + PapersWithCode
- Document discrepancies and share them — it's publishable

**Staying Current:**
- arXiv Sanity (daily), Import AI / The Batch (weekly)
- Follow researchers on Twitter/X
- Watch conference recordings on YouTube

**Starting Research:**
- Reproduce + extend, find intersections, or start from a problem
- Peer review: 3–4 reviewers, rebuttal phase, ~20–25% acceptance rate

---

## ✨ SIMPLIFY

| Challenge | Simple Solution |
|-----------|----------------|
| Paper is too dense | Use 3-Pass method; read figures first |
| Too many papers to read | Triage with Pass 1; only go deep on what matters |
| Can't reproduce results | Find official code; check PapersWithCode; email authors |
| Don't know where to start | Pick one paper, reproduce it, then change one thing |
| Feel behind on the field | Read one curated newsletter per week, not the raw arXiv feed |
| Afraid of academic writing | Start a blog post — it's the same skill, lower stakes |

**The Hierarchy of Understanding:**

```
    Level 1: You read the abstract and sort of understand
    Level 2: You can explain the main idea to a non-expert
    Level 3: You can explain the method in detail
    Level 4: You can implement it from scratch
    Level 5: You can identify its flaws and extend it
    ← Most people stop at level 2. Aim for level 4 on the papers that matter.
```

---

## 🏋️ PRACTICE

### Paper Reading Exercises

1. **3-Pass Practice:** Download the original Attention Is All You Need paper (Vaswani et al., 2017). Do a timed Pass 1 (max 10 minutes). Write down the 5-question answers without looking back at the paper. Then do Pass 2 — how much did you miss on Pass 1?

2. **Figure-First Challenge:** Pick any NeurIPS 2023 paper. Read *only* the figures and their captions. Write a 150-word summary of what you think the paper does. Then read the abstract — how accurate were you?

3. **Contribution Hunt:** Open any ML paper. Find the bullet-pointed list of contributions in the introduction (it's almost always there). Evaluate each claimed contribution: is it a new method? A new insight? A new benchmark? A new result?

4. **Rebuttal Analysis:** Go to openreview.net and find an ICLR paper that was initially given mixed scores but ultimately accepted. Read the original reviews, the authors' rebuttal, and the final reviewer scores. What argument most convinced the reviewers to raise their scores?

### Research Skills Exercises

5. **PapersWithCode Exploration:** Go to paperswithcode.com. Pick a task (e.g., "Image Classification on ImageNet"). Find the current state-of-the-art method. Can you find its official code? Try running the evaluation on a pre-trained checkpoint.

6. **Reproducibility Attempt:** Pick a simple ML paper from 2020–2021 that has official code. Follow their README to reproduce the main result in Table 1. Document every issue you encounter. If your numbers are within 1% of theirs — congratulations, you've reproduced a paper.

7. **Research Gap Analysis:** Read 3 papers on the same topic (e.g., few-shot image classification). For each paper, write one sentence describing what problem it leaves *unsolved*. Do any of the gaps overlap? Could you design a project that addresses one of them?

8. **arXiv Triage Practice:** Open arXiv.org/list/cs.LG/recent. Spend 20 minutes doing Pass 1 on as many papers as you can. Keep a log. How many did you find interesting enough for Pass 2? What patterns do you notice in which papers you're drawn to?

### Research Planning

9. **Your First Research Question:** Using the three strategies (reproduce+extend, intersection, problem-first), generate one research question for each strategy that you could realistically explore in 2–3 months. For each, identify: (a) the baseline method, (b) the dataset, (c) how you would measure success.

10. **Research Journal:** Start a research journal (a private GitHub repo with markdown files works well). For every paper you read, write a 3-sentence summary: (1) What did they do? (2) Why does it matter? (3) What would I do next? Consistency matters more than depth here.

---

*Next Chapter: Career Paths in AI — the roles, skills, salaries, and strategies for turning your AI knowledge into a career.*
