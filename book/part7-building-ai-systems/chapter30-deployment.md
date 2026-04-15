# Chapter 30: Deployment

> *"A model that isn't deployed is just a science experiment. Deployment is where AI earns its keep."*

---

## 🎯 CONCEPT

**Deployment** is the process of making a trained machine learning model available to real users in a production environment. It is the final — and often most underestimated — phase of the AI development lifecycle.

Training a model that achieves 95% accuracy in a Jupyter notebook is an exciting milestone. But that notebook cannot serve a thousand simultaneous users, recover from crashes, update itself safely, or alert you when its predictions start degrading. Deployment solves all of this.

Modern AI deployment involves:
- **Model serialization** — saving trained models in a portable format
- **Containerization** — packaging the model and its environment together
- **Infrastructure** — deciding where to run it (cloud, edge, on-premise)
- **CI/CD pipelines** — automating testing and deployment of model updates
- **Monitoring** — detecting when model performance degrades in production
- **MLOps** — the discipline that ties all of these together

---

## 🧑‍🏫 TEACH (Feynman Style)

Imagine you've spent months perfecting a **recipe**. It tastes perfect in your home kitchen. Now a restaurant chain wants to serve it to thousands of customers per day, in dozens of locations, consistently, without you standing at every stove.

This is the deployment problem.

- **Model serialization** = writing your recipe down precisely so any kitchen can reproduce it exactly
- **Docker** = sending a fully-equipped lunch box — the recipe AND the right tools, utensils, and exact ingredients — so it works the same everywhere
- **Kubernetes** = the restaurant manager who decides how many kitchens to open based on how many customers are waiting, and replaces any kitchen that catches fire
- **CI/CD** = the system that tests your recipe changes in a test kitchen before rolling them out to all restaurants
- **Monitoring** = a feedback system that tells you when customers start complaining that the dish doesn't taste right anymore

**Key insight**: The recipe might be perfect, but if it only works in your specific kitchen (your laptop), it's not a product. Deployment is the engineering discipline of making it reproducible, scalable, and maintainable — everywhere.

---

## 🔬 DEEP UNDERSTANDING

### Model Serialization: Saving and Loading Models

Before deploying, you must save (serialize) your trained model to disk. When the model server starts, it loads (deserializes) the model from disk into memory.

**Common formats by framework**:

| Framework | Save Format | Description |
|---|---|---|
| scikit-learn | `.pkl` (pickle) | Python-native serialization |
| PyTorch | `.pt` / `.pth` | State dict or full model |
| TensorFlow/Keras | `.keras` / `SavedModel` | TensorFlow's own format |
| XGBoost | `.ubj` / `.json` | XGBoost's native format |
| ONNX | `.onnx` | Open, cross-framework format |
| PMML | `.pmml` | XML-based, enterprise standard |

**ONNX (Open Neural Network Exchange)** is worth highlighting: it's a universal format that lets you train in PyTorch and serve in a different runtime — useful for optimizing inference speed.

**Model Registry** — in production, models are stored in a centralized model registry (e.g., MLflow, AWS SageMaker, Weights & Biases) with versioning, metadata, and promotion workflows:

```
Model Registry:
  fraud-detector  v1.0  (archived)
  fraud-detector  v1.1  (staging)
  fraud-detector  v2.0  (production)  <-- currently serving
```

---

### Cloud vs. Edge vs. On-Premise

| Deployment Target | Description | Use Case |
|---|---|---|
| Cloud | Model runs on cloud provider's servers (AWS, GCP, Azure) | Web services, scalable APIs, large models |
| Edge | Model runs on the end device (phone, camera, sensor) | Real-time, offline, low-latency, privacy |
| On-premise | Model runs on the organization's own servers | Regulated industries, data sovereignty |
| Hybrid | Combination (e.g., inference on edge, retraining in cloud) | Smart IoT devices with cloud sync |

**Cloud** advantages: elastic scaling, managed infrastructure, no hardware to maintain.  
**Edge** advantages: works offline, ultra-low latency, no data leaves the device.  
**On-premise** advantages: full data control, no ongoing cloud costs at scale, compliance.

For most organizations building web-based AI products, **cloud deployment** is the starting point. Edge becomes relevant for mobile apps, autonomous vehicles, and industrial equipment.

---

### Docker: Shipping Your Model in a Box

**The problem Docker solves**: "It works on my machine" — the classic engineering nightmare where code runs fine on the developer's laptop but fails in production due to different OS versions, library conflicts, or missing dependencies.

```
Developer's Laptop:         Production Server:
  Python 3.11                 Python 3.9
  numpy 1.26                  numpy 1.24   <-- version mismatch!
  PyTorch 2.1                 PyTorch 2.0  <-- version mismatch!
  CUDA 12.1                   No CUDA      <-- hardware mismatch!
```

**Docker** packages your application, all its dependencies, and the exact runtime environment into a single portable unit called a **container**.

```
+-----------------------------------------------+
|                  DOCKER CONTAINER             |
|                                               |
|  Your Model Code                              |
|  Python 3.11 (exact version)                  |
|  All pip packages (pinned versions)            |
|  System libraries                             |
|  Configuration files                          |
|                                               |
+-----------------------------------------------+
  Runs identically on:
  - Your laptop
  - CI/CD pipeline
  - Staging server
  - Production server
  - Any cloud provider
```

A **Dockerfile** is the recipe for building the container image:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY model/ ./model/
COPY serve.py .

EXPOSE 8080
CMD ["python", "serve.py"]
```

**Images** are the blueprint (read-only). **Containers** are running instances of an image (like processes vs. a program).

---

### Kubernetes: Managing Containers at Scale

**Kubernetes (K8s)** is an orchestration system that manages many containers across many machines — automatically scaling, restarting, and load-balancing.

```
                    [Kubernetes Cluster]
                           |
              +------------+------------+
              |            |            |
         [Node 1]      [Node 2]      [Node 3]
          [Pod]          [Pod]          [Pod]
        [Container]    [Container]    [Container]
        model v2.0     model v2.0     model v2.0
              |            |            |
              +------------+------------+
                           |
                    [Load Balancer]
                           |
                    [User Requests]
```

Key Kubernetes concepts:
- **Pod** — the smallest deployable unit; wraps one or more containers
- **Deployment** — declares how many replica pods should run at all times
- **Service** — exposes pods as a network endpoint with load balancing
- **Autoscaler** — automatically adds/removes pods based on CPU, memory, or custom metrics (e.g., requests per second)

*You don't need to master Kubernetes* — managed services like AWS EKS, Google GKE, and Azure AKS handle most of the heavy lifting. But understanding its role helps you reason about production architectures.

---

### The Full Deployment Pipeline: Dev → Production

```
+-------------+
| DEVELOPMENT |
|  - Experiment  |
|  - Train model |
|  - Unit tests  |
+------+------+
       |  git push / pull request
       v
+-------------+
|  CI/CD      |  (Continuous Integration / Continuous Deployment)
|  PIPELINE   |
|             |
|  Automated: |
|  1. Lint & format checks          |
|  2. Unit tests pass?              |
|  3. Build Docker image            |
|  4. Model validation tests        |
|     (accuracy >= threshold?)      |
|  5. Integration tests             |
|  6. Security scans                |
+------+------+
       |  all checks pass
       v
+-------------+
|  STAGING    |  (production-like environment)
|             |
|  - Shadow    |  traffic mirroring
|  - Load test |
|  - QA review |
+------+------+
       |  approved for release
       v
+-------------+
|  PRODUCTION |
|             |
|  - Gradual rollout (canary)      |
|  - A/B testing                   |
|  - Full deployment               |
|  - Monitor metrics               |
+-------------+
```

**Canary deployment**: roll out the new model to 5% of traffic first. If metrics look good, gradually increase to 20%, 50%, 100%. If something breaks, roll back quickly with minimal impact.

---

### Model Monitoring: Detecting Drift

Once deployed, a model's performance can degrade over time — even without any code changes — because the real world keeps changing.

**Data drift**: the statistical distribution of input features changes.
```
Training data (2022): avg user age = 28, income range $20k-$80k
Production data (2024): avg user age = 35, income range $40k-$150k
                                          ^-- distribution shifted
```

**Concept drift**: the relationship between inputs and outputs changes.
```
2022: "fast delivery" correlates with high satisfaction
2024: "fast delivery" is now expected baseline; no longer differentiating
```

**Performance degradation**: model accuracy metrics decline over time in production.

**Monitoring dashboard** should track:

```
+--------------------------------------------------+
|              MODEL MONITORING DASHBOARD           |
+--------------------------------------------------+
|  Prediction volume:  ████████████ 12,450/day      |
|  Avg latency:        ████ 45ms                    |
|  Error rate:         ▌ 0.2%                       |
|                                                   |
|  Accuracy (rolling 7d):                           |
|  Week 1: ████████████████████ 94.2%               |
|  Week 2: ████████████████████ 93.8%               |
|  Week 3: ████████████████████ 93.1%               |
|  Week 4: ██████████████████   91.4%  <-- alert!   |
|                                                   |
|  Feature drift score: 0.31  (threshold: 0.25) ⚠️  |
+--------------------------------------------------+
```

**Automated alerts** trigger when metrics cross thresholds — prompting investigation and potential model retraining.

---

### A/B Testing in Production

A/B testing lets you run two models simultaneously and measure which performs better on real users before fully committing to one.

```
Incoming requests:
         |
    [Traffic Splitter]
    /           \
50% traffic   50% traffic
    |               |
[Model A]       [Model B]
(current)       (new candidate)
    |               |
    +-------+-------+
            |
    [Metrics Collector]
    - Conversion rate
    - Click-through rate
    - Revenue per user
    - User satisfaction

After N days: "Model B has 3.2% higher conversion rate (p < 0.05)"
              --> promote Model B to 100% traffic
```

Statistical significance is essential — you need enough samples to be confident the difference is real, not random noise.

---

### The MLOps Lifecycle

**MLOps** (Machine Learning Operations) is the discipline of applying DevOps principles to machine learning systems — making the full lifecycle repeatable, automated, and reliable.

```
+--------------------------------------------------------+
|                    MLOPS LIFECYCLE                      |
+--------------------------------------------------------+
|                                                        |
|  [1. Data Collection] --> [2. Data Validation]         |
|          |                        |                    |
|          v                        v                    |
|  [3. Feature Engineering] --> [4. Model Training]      |
|                                    |                   |
|                                    v                   |
|                           [5. Model Evaluation]        |
|                                    |                   |
|                        passes? --> v  fails? --> back   |
|                           [6. Model Registry]          |
|                                    |                   |
|                                    v                   |
|                         [7. Deployment (CI/CD)]        |
|                                    |                   |
|                                    v                   |
|                           [8. Monitoring]              |
|                                    |                   |
|                       drift? --> [retrigger pipeline]  |
|                                    |                   |
|                              back to [1]               |
+--------------------------------------------------------+
          Continuous loop: data -> model -> production -> data
```

**Key MLOps principles**:
1. Everything in version control (code, data, models, configs)
2. All steps automated and reproducible
3. Every model tested before reaching production
4. Production behavior monitored continuously
5. Retraining triggered automatically when drift detected

**MLOps tools**: MLflow, Kubeflow, Weights & Biases, SageMaker, Vertex AI, Azure ML, DVC, BentoML, Seldon.

---

## 🔄 REVIEW

| Concept | Summary |
|---|---|
| Model serialization | Saving trained model weights/params to disk |
| Model registry | Versioned central store for production models |
| Docker | Packages app + dependencies into portable container |
| Container image | The blueprint; read-only snapshot of environment |
| Kubernetes | Orchestrates containers across multiple machines |
| Canary deployment | Gradual rollout to reduce blast radius of bugs |
| CI/CD | Automated testing and deployment pipeline |
| Data drift | Input feature distributions change over time |
| Concept drift | Input-output relationships change over time |
| A/B testing | Parallel deployment of two models to compare |
| MLOps | DevOps applied to ML: automate the full lifecycle |
| On-premise | Self-hosted, full control, higher ops burden |
| Edge deployment | Model runs on the end device, not a server |

---

## ✨ SIMPLIFY

Deploying a model is like **opening a restaurant** — not just cooking a great dish.

- **Serialization** = writing your recipe in a standardized format others can follow
- **Docker** = the complete meal kit box — recipe + exact ingredients + tools — ready to cook anywhere
- **Kubernetes** = the franchise manager who opens or closes kitchen stations based on customer demand
- **CI/CD** = the food safety inspector who tests every new recipe before it goes on the menu
- **Monitoring** = the suggestion box + daily health inspection — catching when food quality slips
- **A/B testing** = running a "chef's special" on half the tables to see if customers prefer it before making it permanent
- **MLOps** = the entire franchise operations manual — making sure every location runs the same way, consistently, forever

---

## 🏋️ PRACTICE

**Exercise 1 — Serialization Decision**  
You have trained a model using PyTorch and need to serve it via a Java-based API server. What serialization format would you choose, and why? What are the trade-offs compared to the native PyTorch format?

**Exercise 2 — Dockerfile Review**  
Identify the problems in this Dockerfile for an ML model API server:

```dockerfile
FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y python3
RUN pip3 install numpy pandas scikit-learn flask
COPY . /app
CMD python3 /app/main.py
```

List at least 4 specific improvements you would make.

**Exercise 3 — Canary Deployment Plan**  
Your team wants to deploy a new version of a loan approval model. Design a canary deployment plan: what percentage of traffic to start with, what metrics to monitor, what threshold triggers a rollback, and how long before full deployment.

**Exercise 4 — Drift Detection**  
You're monitoring a model that predicts housing prices. Describe specifically what data drift and concept drift might look like in this context. What events in the real world might cause each type of drift?

**Exercise 5 — MLOps Gap Analysis**  
A startup has built a churn prediction model. Currently their process is: "data scientist retrains the model manually every few months and uploads the new pickle file to the server." Identify 5 specific MLOps gaps in this process and propose a solution for each.

**Exercise 6 — A/B Test Design**  
You have a new content ranking model (Model B) and want to compare it to the current model (Model A) on your platform. Design the A/B test: traffic split, success metric, minimum sample size considerations, duration, and how you'll decide which model wins.

---

*This completes Part 7: Building AI Systems. You now have the architectural, integration, data, and deployment knowledge to take AI from idea to production.*
