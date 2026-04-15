# Chapter 28: APIs & Integration

> *"An API is a promise — a contract between two pieces of software about how they'll talk to each other."*

---

## 🎯 CONCEPT

An **API (Application Programming Interface)** is a defined way for two software systems to communicate. In the world of AI, APIs are the primary mechanism through which:

- Your application sends data to an AI model
- The model returns a prediction, completion, or decision
- External AI capabilities (vision, language, speech) are integrated into your product

APIs abstract away complexity. You don't need to know *how* GPT-4 generates text — you just need to know *what to send* and *what you'll receive back*. This chapter covers the mechanics of APIs, how to use the OpenAI API as a concrete example, and how to build robust integrations that handle real-world failures gracefully.

---

## 🧑‍🏫 TEACH (Feynman Style)

Imagine you're sitting in a **restaurant** (a classic analogy — and a perfect one).

- You are the **client** (your application).
- The **menu** is the API documentation — it tells you exactly what you can order and how to ask for it.
- The **waiter** is the API itself — the messenger who takes your request to the kitchen and brings back the result.
- The **kitchen** is the AI model or backend service — it does the actual work.
- Your **meal** is the API response — the data returned to you.

You never walk into the kitchen and cook the food yourself. You follow the menu's rules, place your order in the right format, and the waiter handles everything in between.

**REST APIs** are the most common type — they use the same language the web uses (HTTP). You send a request to a URL, and you get a response back. Usually that data is in **JSON** format — structured text that both humans and machines can read easily.

```
You say:  "I'd like the salmon, medium, no sauce."
API says: "Order received. Your salmon will be ready in 3 minutes."
         (Later...)
API says: "Here is your salmon. Enjoy."
```

If you order something not on the menu, or ask in the wrong format — the waiter (API) will return an error, not food.

---

## 🔬 DEEP UNDERSTANDING

### REST APIs Explained

REST (Representational State Transfer) is a set of conventions for building APIs over HTTP. The key concepts are:

**HTTP Methods** — what kind of action you're taking:

| Method | Purpose | Example |
|---|---|---|
| `GET` | Retrieve data | Fetch a list of models |
| `POST` | Send data / trigger action | Submit a prompt for completion |
| `PUT` | Update existing resource | Update your API settings |
| `DELETE` | Remove a resource | Delete a saved conversation |

**Endpoints** — the URL address of the resource you're interacting with:
```
https://api.openai.com/v1/chat/completions
         |___________|  |__|_______________|
         base URL     version  resource path
```

**Headers** — metadata attached to every request:
```
Authorization: Bearer sk-your-api-key-here
Content-Type: application/json
```

**Body** — the payload you send (for POST/PUT requests), formatted as JSON:
```json
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user",   "content": "What is machine learning?"}
  ],
  "temperature": 0.7,
  "max_tokens": 300
}
```

---

### The Full API Flow: Client → Model → Response

```
+------------------+
|   Your App       |
|  (HTTP Client)   |
+--------+---------+
         |
         |  POST /v1/chat/completions
         |  Headers: Authorization, Content-Type
         |  Body: JSON { model, messages, params }
         |
         v
+------------------+
|   API Gateway    |  <-- validates API key, rate limits, routes
+--------+---------+
         |
         v
+------------------+
|  Authentication  |  <-- checks your key, quota, permissions
+--------+---------+
         |
         v
+------------------+
|   Model Server   |  <-- runs inference (the actual LLM)
+--------+---------+
         |
         v
+------------------+
|  Response Builder|  <-- formats output as JSON
+--------+---------+
         |
         |  HTTP 200 OK
         |  Body: JSON { id, choices, usage, ... }
         |
         v
+------------------+
|   Your App       |
|  (handles result)|
+------------------+
```

---

### OpenAI API Walkthrough

**Request** (what you send):
```json
POST https://api.openai.com/v1/chat/completions

{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "system",
      "content": "You are a concise technical writer."
    },
    {
      "role": "user",
      "content": "Explain neural networks in one paragraph."
    }
  ],
  "temperature": 0.5,
  "max_tokens": 200
}
```

**Response** (what you get back):
```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1714000000,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "A neural network is a computational model..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 87,
    "total_tokens": 129
  }
}
```

Key fields to understand:
- `choices[0].message.content` — the actual AI response text
- `finish_reason` — `"stop"` means completed normally; `"length"` means it hit `max_tokens`
- `usage` — token counts for billing and quota tracking

---

### API Keys, Rate Limits, and Error Handling

**API Keys** are secret credentials that identify you to the API provider. Treat them like passwords:

```
DO:  store in environment variables  (export OPENAI_API_KEY=sk-...)
DON'T: hardcode in source code       (key = "sk-abc123")  ← NEVER
DON'T: commit to version control
```

**Rate Limits** restrict how many requests you can make per unit of time:

| Limit Type | Example | What Happens When Exceeded |
|---|---|---|
| Requests per minute (RPM) | 60 req/min | HTTP 429 error |
| Tokens per minute (TPM) | 90,000 tok/min | HTTP 429 error |
| Requests per day (RPD) | 10,000 req/day | HTTP 429 error |

**Common HTTP Error Codes**:

```
200 OK            -- Success
400 Bad Request   -- Your JSON is malformed or missing fields
401 Unauthorized  -- Invalid or missing API key
403 Forbidden     -- API key valid but no permission for this resource
422 Unprocessable -- Request is valid JSON but semantically wrong
429 Too Many Req  -- Rate limit exceeded; back off and retry
500 Server Error  -- Provider's servers failed; not your fault
503 Unavailable   -- Service temporarily down; retry later
```

---

### Retry Logic, Timeouts, and Fallbacks

Production integrations must handle failure gracefully. Three strategies:

**1. Exponential Backoff** — when you hit a 429, wait before retrying, and double the wait each time:

```
Attempt 1: fails with 429 --> wait 1s
Attempt 2: fails with 429 --> wait 2s
Attempt 3: fails with 429 --> wait 4s
Attempt 4: fails with 429 --> wait 8s
Attempt 5: success ✓
```

**2. Timeouts** — never let a request hang forever. Set a maximum wait time, and if the API doesn't respond in time, fail fast and handle the timeout:

```
Timeout after 10 seconds --> return cached result or error message
```

**3. Fallbacks** — if the primary AI API is unavailable, have a plan B:

```
Try:  GPT-4o  (primary)
Fail: GPT-4o-mini  (cheaper fallback)
Fail: Cached response for common queries
Fail: "Service temporarily unavailable" message
```

---

### Integrating AI into Web Applications

A typical web app AI integration looks like this:

```
+----------------+       +-------------------+       +------------------+
|   Browser/     | HTTP  |  Your Backend     | HTTPS |  AI API          |
|   Mobile App   | ----> |  (Node/Python/Go) | ----> |  (OpenAI, etc.)  |
|                | <---- |                   | <---- |                  |
+----------------+       +-------------------+       +------------------+
                              |
                              |  Why have a backend in the middle?
                              |
                              +-- Hides your API key from the client
                              +-- Adds authentication (only your users)
                              +-- Adds rate limiting per user
                              +-- Logs requests for monitoring
                              +-- Adds caching for repeated queries
```

**Never** call an AI API directly from the browser — your API key would be exposed to anyone who opens the browser's developer tools.

---

### Building a Simple AI Chatbot Flow

```
USER SENDS MESSAGE
       |
       v
+---------------------------+
| 1. Validate input          |
|    - not empty             |
|    - within length limit   |
|    - passes content filter |
+---------------------------+
       |
       v
+---------------------------+
| 2. Build conversation      |
|    history (last N turns)  |
|    + system prompt         |
+---------------------------+
       |
       v
+---------------------------+
| 3. Call AI API             |
|    with retry + timeout    |
+---------------------------+
       |
       v
+---------------------------+
| 4. Parse response          |
|    extract content         |
|    check finish_reason     |
+---------------------------+
       |
       v
+---------------------------+
| 5. Store in conversation   |
|    history (for context)   |
+---------------------------+
       |
       v
+---------------------------+
| 6. Return to user          |
|    (stream or full reply)  |
+---------------------------+
```

**Streaming responses** — instead of waiting for the full response, modern APIs support streaming where tokens are sent as they're generated, producing the "typing" effect you see in ChatGPT.

---

## 🔄 REVIEW

| Concept | Summary |
|---|---|
| API | A contract for how two systems communicate |
| REST | HTTP-based API pattern (GET, POST, PUT, DELETE) |
| Endpoint | URL address of a specific API resource |
| JSON | Structured text format for request/response bodies |
| API Key | Secret credential; store in env vars, never in code |
| Rate limit | Max requests per time window; 429 = exceeded |
| Exponential backoff | Retry with increasing wait times |
| Timeout | Maximum wait before giving up on a request |
| Fallback | Alternative if primary API fails |
| Backend proxy | Hides API keys; adds auth, logging, caching |
| Streaming | Tokens returned in real-time as generated |
| `finish_reason` | Why the model stopped: `stop`, `length`, etc. |

---

## ✨ SIMPLIFY

An API is a **vending machine**:

- You press a button (send a request) in a specific format
- You put in money (API key + tokens = payment)
- The machine does its thing internally (you don't see the gears)
- You get your item out (receive the response in a standard format)

If you press the wrong button or run out of money:
- Wrong button → `400 Bad Request`
- No money → `401 Unauthorized`
- Machine jammed → `500 Server Error`
- Too many people at once → `429 Too Many Requests`

Rate limits are like rush-hour queues — there's a maximum throughput, and when too many people ask at once, you have to wait your turn.

---

## 🏋️ PRACTICE

**Exercise 1 — JSON Anatomy**  
Given this API response, write code (pseudocode is fine) to extract the assistant's reply text and the total token count used:

```json
{
  "choices": [{"message": {"role": "assistant", "content": "Hello!"}}],
  "usage": {"prompt_tokens": 10, "completion_tokens": 5, "total_tokens": 15}
}
```

**Exercise 2 — Error Handling Design**  
You are calling an AI API to classify customer support tickets. Design a strategy for each scenario:
- The API returns a `429` error.
- The API takes more than 8 seconds to respond.
- The API returns a `500` error.
- The response has `finish_reason: "length"`.

**Exercise 3 — Security Audit**  
Review this Python snippet and identify ALL security and quality problems:

```python
import requests

API_KEY = "sk-abc123supersecretkey"

response = requests.post(
    "https://api.openai.com/v1/chat/completions",
    json={"model": "gpt-4", "messages": [{"role": "user", "content": input()}]}
)
print(response.json()["choices"][0]["message"]["content"])
```

**Exercise 4 — Architecture Design**  
Draw the request flow for: "A mobile app that lets users photograph a receipt and get a spending summary." Include: mobile client, your backend, storage, AI vision API, and the response path.

**Exercise 5 — Rate Limit Math**  
Your AI API allows 60 requests per minute and 90,000 tokens per minute. Each user request uses approximately 500 tokens on average. What is the maximum number of simultaneous users you can serve per minute before hitting the token rate limit? What about the request rate limit?

---

*Next Chapter: Data Pipelines — building the highways that feed your AI systems with clean, reliable data.*
