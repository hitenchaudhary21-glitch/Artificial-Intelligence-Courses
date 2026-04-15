# Chapter 38: Advanced Projects
### *Production-Grade AI: Building Systems That Matter*

---

## 🎯 CONCEPT

Advanced AI projects are not just exercises — they are the artifacts that define your career. At this stage, you move beyond tutorials and toy datasets into the territory that employers and clients care about: systems that ingest real data, handle edge cases, scale under load, and solve genuine problems.

This chapter presents five production-grade project blueprints. Each one targets a high-demand niche in applied AI, and together they cover the full spectrum of modern AI engineering: retrieval-augmented generation, model fine-tuning, autonomous agents, real-time anomaly detection, and multi-modal reasoning.

**Portfolio Impact Overview**

| Project | Complexity | Wow Factor | Job-Relevance |
|---|---|---|---|
| RAG System | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Fine-tune an LLM | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| AI Agent with Tool Use | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Real-time Anomaly Detection | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Multi-modal AI App | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

The goal is not to build all five at once. Build one well, deploy it, document it, and move to the next. Each project you ship compounds your credibility.

---

## 🧑‍🏫 TEACH (Feynman Style)

Imagine you are a librarian who has memorized nothing but can find anything. That is a RAG system. Imagine you apprenticed under a chef for a year and now cook in their exact style — that is fine-tuning. Imagine you have an assistant who reads your request, picks up the phone, searches the web, runs the math, then reports back — that is an AI agent. Imagine a smoke detector wired to every pipe in a factory, silently watching for irregularities — that is anomaly detection. And imagine showing a friend a photo and asking "what's this?" while they describe and discuss it with you — that is multi-modal AI.

Each of these metaphors maps directly to a real engineering pattern. The magic dissolves when you understand the plumbing.

**Why production-grade matters:** A Jupyter notebook that "works on your machine" is not a project — it is a draft. Production-grade means it runs in a container, handles errors gracefully, can be demonstrated live, and has a README that lets a stranger reproduce it. That gap — notebook to deployed system — is where most AI candidates fall short. Cross it, and you stand out immediately.

---

## 🔬 DEEP UNDERSTANDING

### Project 1: Build a RAG System (Retrieval-Augmented Generation)

**The Core Idea**

Large language models hallucinate because they only know what was in their training data. RAG fixes this by giving the model a private library it can search at query time. Instead of memorizing your company's documentation, the LLM retrieves the relevant passages and uses them as grounding context before generating an answer.

**Tech Stack**
- **Orchestration:** LangChain or LlamaIndex
- **Vector Store:** ChromaDB (local, free) or Pinecone (managed, scalable)
- **LLM Backend:** OpenAI GPT-4o or a local Ollama model (Mistral, LLaMA 3)
- **Embedding Model:** `text-embedding-3-small` (OpenAI) or `nomic-embed-text` (local)
- **API Layer:** FastAPI
- **Containerization:** Docker

**Implementation Phases**

```
Phase 1 — Ingestion
  docs → chunker → embedder → vector DB
       (PDF, MD, HTML)  (512-token chunks)  (cosine similarity index)

Phase 2 — Retrieval & Generation
  user query → embed query → vector DB search → top-k chunks
             → LLM prompt (context + question) → answer
```

**ASCII Pipeline:**
```
[ Documents ]
      |
  [ Chunker ]  (RecursiveCharacterTextSplitter, chunk=512, overlap=50)
      |
  [ Embedder ] (OpenAI / nomic-embed-text)
      |
 [ Vector DB ] (ChromaDB / Pinecone)
      |
  [ Retriever ] (similarity search, top-k=4)
      |
  [ LLM ] (GPT-4o / LLaMA with stuffed context)
      |
  [ Answer ]
```

**Key Engineering Decisions**
- **Chunk size:** 256–512 tokens works well for most documents. Too small = no context; too large = noisy retrieval.
- **Overlap:** 10–15% overlap between chunks prevents answers from being split at boundaries.
- **Retrieval strategy:** Hybrid search (dense + BM25 sparse) outperforms pure vector search on technical documents.
- **Re-ranking:** Add a cross-encoder re-ranker (e.g., `cross-encoder/ms-marco-MiniLM-L-6-v2`) after retrieval to boost precision.

**Deployment Notes**

Wrap your RAG pipeline in a FastAPI app with a `/query` POST endpoint. Containerize with Docker using a two-stage build (builder + runtime). Use environment variables for API keys — never hardcode them. For the vector store, mount a volume so ChromaDB persists across container restarts.

```
docker build -t rag-api .
docker run -p 8000:8000 -v $(pwd)/chroma_db:/app/chroma_db rag-api
```

**Portfolio Tip:** Build a "Chat with Your Docs" demo. Use your own GitHub README files or a public technical spec (e.g., the Transformer paper). Record a 90-second Loom video showing a user asking a question and getting a grounded, cited answer. This demo is immediately understood by every technical interviewer.

---

### Project 2: Fine-tune an LLM (GPT-2 or LLaMA on a Custom Dataset)

**The Core Idea**

Pre-trained models are generalists. Fine-tuning makes them specialists. Using **LoRA** (Low-Rank Adaptation), you can fine-tune a 7B-parameter model on a single consumer GPU by training only a tiny set of adapter weights — typically less than 1% of total parameters — while freezing the rest of the model.

**Tech Stack**
- **Model Hub:** HuggingFace Transformers + `datasets`
- **Efficient Training:** PEFT (LoRA / QLoRA)
- **Experiment Tracking:** Weights & Biases (W&B)
- **Quantization:** `bitsandbytes` (4-bit QLoRA)
- **Hardware:** Minimum RTX 3090 (24 GB VRAM) for 7B; use Colab A100 or RunPod for cloud

**GPU Requirements & Cost Estimates**

| Model | Method | VRAM Required | Cloud Cost (~1hr) |
|---|---|---|---|
| GPT-2 (124M) | Full fine-tune | 4 GB | ~$0.50 |
| LLaMA 3 8B | QLoRA 4-bit | 12 GB | ~$1.20 |
| Mistral 7B | QLoRA 4-bit | 10 GB | ~$1.00 |
| LLaMA 3 70B | QLoRA 4-bit | 48 GB | ~$6.00 |

**Implementation Phases**

```
Phase 1 — Data Preparation
  raw text → clean → format as instruction pairs (prompt / completion)
  → save as JSONL: {"instruction": "...", "output": "..."}

Phase 2 — Tokenization
  load tokenizer → apply chat template → tokenize with padding/truncation

Phase 3 — LoRA Configuration
  target_modules = ["q_proj", "v_proj"]
  r = 16, lora_alpha = 32, lora_dropout = 0.05

Phase 4 — Training
  TrainingArguments → SFTTrainer → train() → save adapter weights

Phase 5 — Evaluation
  ROUGE score / human eval → compare against base model

Phase 6 — Inference
  load base model + merge LoRA adapter → run inference pipeline
```

**ASCII: LoRA Architecture**
```
[ Base Model Weights ] (frozen)
         |
    + [ LoRA Adapter ]  (trained: A·B matrices, rank r=16)
         |
  [ Fine-tuned Behavior ]
```

**Key Engineering Decisions**
- **QLoRA vs LoRA:** Use QLoRA (4-bit quantized base + LoRA adapters) when VRAM is limited. Minimal quality loss, massive memory savings.
- **Dataset size:** 1,000–10,000 high-quality instruction pairs is sufficient for domain adaptation. Quality beats quantity.
- **Learning rate:** `2e-4` for LoRA is a reliable default. Use a cosine scheduler with warmup.
- **Overfitting guard:** Watch your W&B validation loss curve. Stop training when it plateaus or rises.

**Portfolio Tip:** Train a domain-specific assistant — a legal clause explainer, a medical note summarizer, a Python code reviewer. The narrower the domain, the more impressive the demo. Include a W&B training curve screenshot and a side-by-side comparison table of base model vs. fine-tuned responses.

---

### Project 3: AI Agent with Tool Use (ReAct-Style)

**The Core Idea**

An LLM alone cannot browse the web, run code, or query a database. An AI agent wraps the LLM in a loop that lets it reason about *what tool to call*, call it, observe the result, and continue reasoning until it reaches a final answer. The **ReAct** pattern (Reasoning + Acting) is the dominant paradigm.

**Tech Stack**
- **Agent Framework:** LangChain Agents or Microsoft AutoGen
- **Tools:** DuckDuckGo Search, Python REPL, Calculator, Wikipedia, custom API wrappers
- **LLM Backend:** GPT-4o (recommended) or LLaMA 3 via Ollama
- **UI:** Streamlit or Gradio
- **Logging:** LangSmith (LangChain's observability platform)

**The ReAct Loop**
```
User Query
    |
[ THOUGHT ]  "I need to find the current population of Tokyo"
    |
[ ACTION ]   tool="search", input="Tokyo population 2024"
    |
[ OBSERVATION ]  "Tokyo population: 13.96 million (2024)"
    |
[ THOUGHT ]  "I have the answer, no further tools needed"
    |
[ FINAL ANSWER ]  "Tokyo's population in 2024 is approximately 13.96 million."
```

**ASCII Pipeline:**
```
[ User Query ]
      |
  [ Agent Core ] (LLM + ReAct prompt)
      |
  [ Tool Selector ]
    /   |   \
[Search][Calc][Code]
    \   |   /
  [ Observation ]
      |
  (loop until done)
      |
[ Final Answer ]
```

**Implementation Phases**
1. **Define tools** — wrap each capability as a `@tool` decorated function with a clear docstring (the LLM reads the docstring to decide when to use it).
2. **Configure agent** — choose `AgentType.ZERO_SHOT_REACT_DESCRIPTION` for simple agents; use `OpenAIFunctionsAgent` for more reliable tool selection with GPT models.
3. **Add memory** — use `ConversationBufferMemory` to give the agent context across turns.
4. **Build UI** — Streamlit's `st.chat_message` widget provides a clean multi-turn chat interface in under 30 lines.
5. **Add guardrails** — set `max_iterations=10` and handle `OutputParserException` gracefully to prevent infinite loops.

**Portfolio Tip:** Build a multi-tool research agent that takes a research question, searches the web, retrieves Wikipedia summaries, and synthesizes a structured report. Show it handling a question that requires *multiple* tool calls — this demonstrates understanding of agent planning, not just a single API call.

---

### Project 4: Real-time Anomaly Detection

**The Core Idea**

Most ML systems work on historical batch data. Real-time anomaly detection runs a model *continuously* on a live data stream and fires an alert the moment something unusual happens — a server latency spike, an unusual financial transaction, a sensor reading outside safe bounds.

**Tech Stack**
- **Stream Ingestion:** Apache Kafka (enterprise) or Redis Streams (lightweight)
- **Feature Pipeline:** Python consumer with `confluent-kafka` or `redis-py`
- **Anomaly Model:** Isolation Forest (sklearn) for tabular data; Autoencoder (PyTorch) for complex/multivariate signals
- **Monitoring Dashboard:** Grafana + InfluxDB time-series database
- **Orchestration:** Docker Compose

**Implementation Phases**
```
Phase 1 — Data Streaming
  sensor/API → Kafka topic ("raw-metrics") → consumer group

Phase 2 — Feature Extraction
  sliding window (last 60s) → rolling mean, std, lag features

Phase 3 — Model Inference
  features → Isolation Forest → anomaly score (-1 or 1)

Phase 4 — Alert System
  score == -1 → publish to Kafka topic ("alerts") → webhook / Grafana annotation
```

**ASCII Pipeline:**
```
[ Sensor / API ]
      |
  [ Kafka / Redis Stream ]
      |
  [ Feature Pipeline ] (sliding window, normalization)
      |
  [ Anomaly Model ] (Isolation Forest / Autoencoder)
      |
  [ Threshold Check ] (contamination=0.05)
      |
  [ Alert ] → Grafana Dashboard / PagerDuty / Slack
```

**Key Engineering Decisions**
- **Model choice:** Isolation Forest needs no labels (unsupervised) — perfect when you only have "normal" data. Autoencoders excel on multivariate time-series with complex seasonal patterns.
- **Sliding window:** Use a 60-second rolling window of 10 features. Too short = noisy; too long = slow to detect.
- **Threshold tuning:** Set `contamination` (expected anomaly rate) to match your domain. Financial fraud: 0.001. IoT sensors: 0.01–0.05.
- **Model drift:** Retrain weekly on recent data. Data distributions shift; a model trained on last year's traffic is blind to today's patterns.

**Docker Compose Setup**

Your `docker-compose.yml` should spin up: Zookeeper, Kafka broker, your Python producer (simulates sensor data), your Python consumer/model service, InfluxDB, and Grafana — all in one command: `docker compose up`.

**Portfolio Tip:** Frame this as either an **IoT anomaly detector** (temperature/vibration sensors in a factory) or a **financial fraud detector** (transaction velocity and amount deviations). Both are immediately legible to hiring managers. Include a Grafana screenshot showing a detected spike and the alert trigger — visuals close interviews.

---

### Project 5: Multi-modal AI App (Image + Text)

**The Core Idea**

Multi-modal models bridge vision and language. CLIP (Contrastive Language–Image Pretraining) encodes images and text into the *same* embedding space — allowing you to search images with text queries. LLaVA takes this further: it is a vision-language model that can answer questions about images in natural language.

**Tech Stack**
- **Vision-Language Model:** CLIP (`openai/clip-vit-base-patch32`) or LLaVA 1.6 (via Ollama)
- **Embedding & Similarity:** HuggingFace Transformers + cosine similarity / FAISS
- **UI:** Gradio (fastest to prototype; native image upload support)
- **API Layer:** FastAPI (for production endpoints)
- **Image Store:** Local filesystem or S3-compatible storage (MinIO)

**Implementation Phases**
```
Phase 1 — Image Encoding
  image → CLIP vision encoder → 512-d image embedding

Phase 2 — Text Encoding
  caption / query → CLIP text encoder → 512-d text embedding

Phase 3 — Cross-modal Fusion
  cosine_similarity(image_embedding, text_embedding) → score

Phase 4 — Output
  highest-scoring image(s) returned → display in Gradio / FastAPI response
```

**ASCII Pipeline:**
```
[ Image Input ]              [ Text Input / Caption ]
      |                               |
[ Vision Encoder ]          [ Text Encoder ]
  (CLIP ViT)                 (CLIP Transformer)
      |                               |
      +-----> [ Fusion Layer ] <------+
              (dot product / cosine)
                      |
              [ Ranked Results ]
        (visual Q&A / image search / captioning)
```

**Three Build Modes**

| Mode | Description | Key Component |
|---|---|---|
| Image Search | Text query retrieves matching images | CLIP + FAISS index |
| Visual Q&A | User asks question about an uploaded image | LLaVA or GPT-4o Vision |
| Image Captioning | Auto-generate descriptions for image datasets | BLIP-2 or LLaVA |

**Gradio UI in ~20 Lines**
```python
import gradio as gr
from pipeline import search_images  # your CLIP search function

def query(text_query, top_k):
    results = search_images(text_query, k=top_k)
    return results  # list of PIL images

demo = gr.Interface(
    fn=query,
    inputs=[gr.Textbox(label="Search Query"), gr.Slider(1, 10, value=4)],
    outputs=gr.Gallery(label="Results"),
    title="Visual Product Search"
)
demo.launch()
```

**Portfolio Tip:** Build a **product catalog search demo**. Scrape 200 product images from an open dataset (e.g., DeepFashion, Amazon Berkeley Objects). Index them with CLIP embeddings. Let users type "red running shoes with white sole" and instantly see matching products — no keyword metadata required. This is a real feature that e-commerce companies pay six figures to build.

---

## 🔄 REVIEW

| Concept | Key Takeaway |
|---|---|
| RAG | Grounds LLM outputs in real documents; prevents hallucination |
| Fine-tuning (LoRA) | Domain adaptation without retraining all parameters |
| ReAct Agents | LLMs augmented with tools; reasoning + acting in a loop |
| Anomaly Detection | Streaming ML for real-time alerting; unsupervised by default |
| Multi-modal AI | Unified embedding space bridges vision and language |
| Production mindset | FastAPI + Docker + env vars = deployable, demonstrable, professional |
| Portfolio strategy | One well-deployed demo > five unfinished notebooks |

**Common Pitfalls to Avoid**

- **RAG:** Forgetting to persist your vector store — rebuild costs time and money.
- **Fine-tuning:** Overfitting on a small dataset because validation loss was ignored.
- **Agents:** No iteration limit — an agent can loop indefinitely and burn API credits.
- **Anomaly detection:** Never re-evaluating the model as data distribution shifts.
- **Multi-modal:** Not normalizing embeddings before computing cosine similarity — produces garbage rankings.

---

## ✨ SIMPLIFY

**RAG in one sentence:** Give the LLM a search engine over your private documents so it answers with facts, not guesses.

**Fine-tuning in one sentence:** Teach a general-purpose model to speak your domain's language by training a small adapter on your data.

**AI Agents in one sentence:** Wrap an LLM in a loop with tools so it can take actions, observe results, and reason toward a goal.

**Anomaly Detection in one sentence:** Watch a live data stream and raise an alarm the moment the pattern breaks.

**Multi-modal AI in one sentence:** Encode images and text into the same number space so you can search, compare, and reason across both.

**The meta-lesson:** Every advanced AI project is a pipeline. Data goes in one end, intelligence comes out the other. Your job as an engineer is to make each stage reliable, observable, and replaceable.

---

## 🏋️ PRACTICE

### Starter Challenges (pick one to ship this week)

**Challenge 1 — RAG Quickstart**
1. Clone a LangChain RAG template repository.
2. Point it at a folder of 10 markdown files (your notes from this course work perfectly).
3. Add a `/query` endpoint in FastAPI.
4. Write a `Dockerfile` and confirm it runs with `docker run`.
5. Ask it a question that requires combining information from two different files.

**Challenge 2 — LoRA Fine-tune Sprint**
1. Download the Alpaca dataset (52K instruction pairs) from HuggingFace.
2. Filter it to 2,000 rows in a single domain (cooking, coding, legal — your choice).
3. Fine-tune GPT-2 (124M) using the PEFT library with LoRA rank=8.
4. Log your training run to W&B.
5. Compare three outputs: zero-shot GPT-2, fine-tuned GPT-2, and GPT-4o. Document the gap.

**Challenge 3 — Agent in an Afternoon**
1. Install LangChain and create an agent with three tools: DuckDuckGo search, Python REPL, and a Wikipedia lookup tool.
2. Give it the task: *"Find the GDP of the three largest economies and compute their combined share of world GDP."*
3. Log the full ReAct trace.
4. Wrap it in a 10-line Gradio interface.
5. Identify one place where the agent made a wrong tool choice and explain why.

**Challenge 4 — Anomaly Detector in Docker**
1. Write a Python script that generates synthetic time-series data with occasional injected spikes.
2. Train an Isolation Forest on 1,000 "normal" records.
3. Feed new records in a streaming loop; flag anomalies.
4. Write results to a CSV with a timestamp and anomaly score.
5. Wrap everything in a Docker Compose file with a Grafana container pointed at your output.

**Challenge 5 — CLIP Image Search**
1. Download 100 images from the COCO dataset validation set.
2. Encode all images with `openai/clip-vit-base-patch32`.
3. Store embeddings in a FAISS flat index.
4. Build a Gradio interface with a text search box.
5. Query: *"a dog on a beach"* — evaluate whether top-3 results are semantically correct.

### Reflection Questions

1. For a RAG system serving 10,000 users per day, which vector store would you choose — ChromaDB or Pinecone — and why?
2. If your fine-tuned LLM's validation loss stops improving at epoch 3 but training loss continues to drop, what does this indicate and what would you do?
3. An AI agent is given access to a tool that can send emails. What guardrails would you implement before deploying it to production?
4. Your anomaly detection model is generating 40% false positives on Monday mornings. What is likely causing this, and how would you fix it?
5. A product manager asks you to add multi-modal search to an e-commerce app with 1 million product images. Describe your architecture, estimated costs, and the biggest technical risk.

---

> **Final Thought:** The distance between a machine learning engineer and an AI engineer is measured in deployed systems. These five projects are not just portfolio pieces — they are the curriculum of modern AI practice. Build one. Ship it. Then build the next one better.
