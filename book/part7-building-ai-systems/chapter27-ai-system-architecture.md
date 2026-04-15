# Chapter 27: AI System Architecture

> *"A model in a notebook is a prototype. A model in production is an engineering challenge."*

---

## 🎯 CONCEPT

**AI System Architecture** is the blueprint that describes how all the components of an AI-powered application are organized, connected, and orchestrated to deliver value from raw data to a final decision or output.

A single machine learning model — no matter how accurate — is almost never sufficient on its own. Real-world AI systems are composed of many moving parts:

- **Data sources** (databases, APIs, sensors, files)
- **Data ingestion** layer (pulling and routing raw data)
- **Preprocessing** pipeline (cleaning and transforming data into model-ready form)
- **Model layer** (inference: turning inputs into predictions)
- **Post-processing** layer (formatting, thresholding, business logic)
- **Output layer** (APIs, dashboards, automated actions)

Understanding how these pieces fit together is the difference between an AI hobbyist and an AI engineer.

---

## 🧑‍🏫 TEACH (Feynman Style)

Imagine you run a **smart restaurant**.

- A customer walks in and places an order (**data ingestion** — collecting the request).
- The waiter writes it down and reformats it for the kitchen: "Table 4, no nuts, medium rare" (**preprocessing** — standardizing input).
- The chef cooks the dish using a well-practiced recipe (**model inference** — applying learned knowledge).
- Before serving, the manager checks the plate looks presentable and correct (**post-processing** — validation and formatting).
- The waiter delivers it to the right table (**output** — delivering the result to the right consumer).

If any station breaks down, the whole experience fails — even if the chef is world-class. The same principle applies to AI systems. You could have the best model in the world, but if your data ingestion is broken or your output is malformed, the system is useless.

**Key insight**: In production AI, most of the engineering effort (often 80%+) lives *outside* the model — in the pipes, wires, and scaffolding that make the model actually useful.

---

## 🔬 DEEP UNDERSTANDING

### The Complete AI System Stack

```
+---------------------------------------------------------------+
|                        AI SYSTEM STACK                        |
+---------------------------------------------------------------+
|                                                               |
|  [DATA SOURCES]                                               |
|   Databases  |  REST APIs  |  Streams  |  Files  |  Sensors  |
|         |           |           |          |          |       |
+---------|-----------|-----------|----------|----------+-------+
          |           |           |          |
          v           v           v          v
+---------------------------------------------------------------+
|                    DATA INGESTION LAYER                       |
|   Batch loaders  |  Stream consumers  |  API pollers         |
|   Message queues (Kafka, RabbitMQ)  |  CDC connectors        |
+---------------------------------------------------------------+
                          |
                          v
+---------------------------------------------------------------+
|                   PREPROCESSING PIPELINE                      |
|   Cleaning (nulls, outliers)  |  Normalization / Scaling      |
|   Tokenization  |  Encoding  |  Feature engineering           |
|   Train/val/test split  |  Schema validation                  |
+---------------------------------------------------------------+
                          |
                          v
+---------------------------------------------------------------+
|                       MODEL LAYER                             |
|   Single model  |  Ensemble  |  RAG pipeline  |  Agent loop  |
|   Versioned artifacts stored in model registry               |
+---------------------------------------------------------------+
                          |
                          v
+---------------------------------------------------------------+
|                   POST-PROCESSING LAYER                       |
|   Thresholding  |  Decoding  |  Business rules               |
|   Confidence filtering  |  Result ranking  |  Formatting     |
+---------------------------------------------------------------+
                          |
                          v
+---------------------------------------------------------------+
|                       OUTPUT LAYER                            |
|   REST API response  |  Database write  |  UI render         |
|   Event emission  |  Automated action  |  Alert / Report     |
+---------------------------------------------------------------+
```

---

### Monolithic vs. Microservice AI Architectures

**Monolithic Architecture** bundles everything — data loading, preprocessing, model inference, and output — into a single application.

```
+---------------------------------------------+
|             MONOLITHIC AI APP               |
|  [Ingest] -> [Preprocess] -> [Model] -> [Out]|
+---------------------------------------------+
     All components share the same process,
     memory, and deployment lifecycle.
```

*Pros*: Simple to develop and deploy early on; no network overhead between stages.  
*Cons*: Hard to scale individual components; one bug can crash everything; difficult to update just the model layer.

**Microservice Architecture** breaks each component into an independently deployable service that communicates over APIs or message queues.

```
  [Ingest Service]
        |  (message queue)
        v
  [Preprocess Service]
        |  (REST / gRPC)
        v
  [Model Serving Service]  <-- can scale independently
        |  (REST)
        v
  [Output Service]
```

*Pros*: Each layer scales independently; teams can own individual services; easier to swap the model without touching the rest.  
*Cons*: Increased operational complexity; latency added by network hops; harder to debug distributed failures.

**Recommendation**: Start monolithic, decompose into microservices as traffic, team size, or complexity demands it.

---

### Batch vs. Real-Time Inference

| Property | Batch Inference | Real-Time Inference |
|---|---|---|
| Trigger | Scheduled (hourly, nightly) | On-demand (per request) |
| Latency | Minutes to hours | Milliseconds to seconds |
| Throughput | Very high | Moderate |
| Use case | Nightly recommendations, bulk scoring | Fraud detection, chatbots, search |
| Infrastructure | Spark jobs, cron tasks | REST API servers, serverless functions |

**Batch inference** processes a large dataset all at once — ideal when predictions don't need to be instant (e.g., pre-computing product recommendations for all users overnight).

**Real-time inference** produces a prediction immediately in response to a single input — essential when the user is waiting (e.g., spam filtering an email before delivery).

A hybrid approach called **near-real-time** (also called **micro-batching**) processes small groups of inputs every few seconds — a middle ground used in fraud detection and recommendation refreshes.

---

### Scaling: Horizontal vs. Vertical

**Vertical scaling** means giving one machine more resources (bigger CPU, more RAM, faster GPU).

```
Before:  [Server: 8 cores, 32GB RAM]
After:   [Server: 64 cores, 256GB RAM]
```

*Simple but limited* — there's a ceiling to how large one machine can get.

**Horizontal scaling** means adding more machines and distributing load across them.

```
              [Load Balancer]
             /       |       \
     [Server 1] [Server 2] [Server 3]
```

*More complex but nearly limitless* — this is how cloud providers achieve massive scale for AI inference.

For model serving, **GPU vertical scaling** is common for large models (one powerful GPU server), while **CPU horizontal scaling** works well for simpler models (many small servers).

---

### Advanced Architectural Patterns

**RAG (Retrieval-Augmented Generation)**: Combines a vector database with an LLM. Instead of relying only on what the model memorized during training, the system *retrieves* relevant documents at inference time and feeds them into the prompt.

```
  [User Query]
       |
       v
  [Vector DB Retrieval] --> [Top-K Documents]
       |                          |
       v                          v
  [LLM Prompt] <----- [Query + Retrieved Context]
       |
       v
  [Grounded Response]
```

**Ensemble Patterns**: Multiple models vote on or average their predictions to produce a more robust final answer.

```
  Input --> [Model A] --\
  Input --> [Model B] ---+--> [Aggregator] --> Final Prediction
  Input --> [Model C] --/
```

**Agent Loops**: An LLM is given tools (search, code execution, APIs) and iterates — deciding which tool to call, observing the result, and calling the next tool — until the task is complete.

---

### Case Study: Recommendation System Architecture

Imagine building a Netflix-style movie recommendation engine.

```
+-------------------------------------------------------+
|           RECOMMENDATION SYSTEM ARCHITECTURE          |
+-------------------------------------------------------+
|                                                       |
| [User Events]  [Catalog DB]  [Historical Ratings]     |
|      |               |               |               |
|      +-------+-------+               |               |
|              |                       |               |
|      [Event Stream Ingestion]         |               |
|      (Kafka topic: user-clicks)       |               |
|              |                       |               |
|      [Feature Store]  <--------------+               |
|      (user vectors, item vectors)                     |
|              |                                       |
|      [Candidate Generation Model]  (ANN search)      |
|              | (top 500 candidates)                   |
|      [Ranking Model]  (learned preferences)          |
|              | (top 20 ranked items)                  |
|      [Business Rules Filter]                          |
|      (remove watched, apply region rules)             |
|              |                                       |
|      [API Response]  --> [UI Render]                  |
+-------------------------------------------------------+
```

This system combines batch pre-computation (item embeddings), real-time retrieval (nearest neighbor search), and real-time ranking — a textbook hybrid architecture.

---

## 🔄 REVIEW

| Concept | Summary |
|---|---|
| Data ingestion | Pulling raw data from sources into the system |
| Preprocessing | Cleaning, normalizing, and engineering features |
| Model layer | Inference: inputs → predictions |
| Post-processing | Applying business rules, formatting output |
| Monolithic | All-in-one, simple but hard to scale |
| Microservice | Decoupled services, complex but scalable |
| Batch inference | High throughput, scheduled, not instant |
| Real-time inference | Low latency, on-demand, per-request |
| Horizontal scaling | More machines; distributes load |
| Vertical scaling | Bigger machine; simpler but limited |
| RAG | LLM + retrieved context from a vector store |
| Ensemble | Multiple models combined for robustness |
| Agent loop | LLM iteratively using tools to complete tasks |

---

## ✨ SIMPLIFY

Think of AI system architecture as a **factory assembly line**:

- **Ingestion** = raw materials arriving at the loading dock
- **Preprocessing** = quality control and shaping the raw materials
- **Model** = the manufacturing machine
- **Post-processing** = final quality check and packaging
- **Output** = shipping to the customer

A monolithic factory is one big building where everything happens together. A microservice factory is a network of specialized workshops, each doing one job and handing off to the next.

**Real-time** is a custom order shop — made to order, one at a time, fast.  
**Batch** is a production run — make 10,000 units overnight, deliver in the morning.

---

## 🏋️ PRACTICE

**Exercise 1 — Design Challenge**  
You are building an AI system to detect fraudulent bank transactions. For each layer of the stack, describe:
- What data flows in?
- What transformation happens?
- What flows out?

**Exercise 2 — Architecture Decision**  
Your company has a model that scores job applications. Currently it scores 100 applications per day. Next year it will score 1,000,000 per day. Would you use batch or real-time inference? Monolithic or microservice? Justify your choices.

**Exercise 3 — Diagram It**  
Draw an ASCII diagram of a spam detection system for email. Include: email source, preprocessing, model, threshold decision, and output (deliver/block).

**Exercise 4 — Trade-off Analysis**  
Complete this table for a medical image diagnosis system:

| Decision | Option A | Option B | Your Choice & Why |
|---|---|---|---|
| Inference type | Batch (nightly) | Real-time (instant) | ? |
| Architecture | Monolithic | Microservice | ? |
| Scaling strategy | Vertical (1 big GPU) | Horizontal (many CPUs) | ? |

**Exercise 5 — RAG vs Fine-tuning**  
A company wants their LLM to answer questions about their internal policy documents (1,000 documents, updated monthly). Should they use RAG or fine-tune the model on the documents? Write a 3-sentence justification.

---

*Next Chapter: APIs & Integration — connecting your AI system to the world.*
