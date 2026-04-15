# Chapter 29: Data Pipelines

> *"Your model is only as good as the data it learns from — and your data is only as good as the pipeline that prepares it."*

---

## 🎯 CONCEPT

A **data pipeline** is an automated system that moves data from one or more sources, transforms it into a useful form, and loads it into a destination where it can be analyzed, stored, or fed into a machine learning model.

Without reliable data pipelines, AI systems starve. Even the most sophisticated neural network produces garbage if its inputs are inconsistent, incomplete, or corrupted. Data pipelines are the unsung infrastructure of every production AI system — invisible when working, catastrophic when broken.

The classic framework for thinking about data pipelines is **ETL**:
- **E**xtract — pull data from source systems
- **T**ransform — clean, reshape, and enrich it
- **L**oad — write it to the destination (database, feature store, model)

Modern practice also includes **ELT** (Extract, Load, Transform) where raw data is loaded first and transformed afterward — common in cloud data warehouses where compute is cheap and flexible.

---

## 🧑‍🏫 TEACH (Feynman Style)

Think of a data pipeline as a **factory assembly line for data** — just like a car manufacturing plant, but instead of assembling vehicles, you're assembling clean, structured, analysis-ready data.

**Station 1 — Raw Materials Delivery (Extraction)**  
Raw steel, rubber, and glass arrive from different suppliers — in different shapes, sizes, and sometimes with defects. Likewise, raw data arrives from databases, log files, third-party APIs, IoT sensors, and CSV uploads — in inconsistent formats, with missing fields, and duplicate rows.

**Station 2 — Quality Control & Shaping (Transformation)**  
Workers inspect each part, discard defects, reshape components to specification, and combine parts together. Data engineers clean missing values, remove outliers, join tables together, and engineer new calculated features.

**Station 3 — Final Assembly & Delivery (Loading)**  
Finished parts are assembled into a complete car and delivered to the dealership. Processed data is loaded into a feature store, data warehouse, or model training pipeline — ready to create value.

**Key insight**: A factory with poor quality control produces defective cars no matter how good the final assembly robot is. A data pipeline with poor transformation produces garbage data no matter how good the model is. "Garbage in, garbage out" is the oldest rule in data science.

---

## 🔬 DEEP UNDERSTANDING

### The Full Data Pipeline

```
RAW DATA SOURCES
  |  |  |  |  |
  v  v  v  v  v

+----------------------------------------------+
|           EXTRACT (Ingestion Layer)           |
|  CSV files   REST APIs   SQL databases        |
|  Kafka streams   Web scraping   S3 buckets    |
|  IoT sensors   Webhooks   CDC (change logs)   |
+--------------------+-------------------------+
                     |
                     v  [Raw, messy data]
+----------------------------------------------+
|           TRANSFORM (Processing Layer)        |
|                                               |
|  Step 1: Schema Validation                    |
|    - check required fields exist             |
|    - check data types match expectations     |
|                                               |
|  Step 2: Data Cleaning                        |
|    - handle missing values                   |
|    - remove or cap outliers                  |
|    - deduplicate records                     |
|    - standardize formats (dates, phone #s)   |
|                                               |
|  Step 3: Data Integration                     |
|    - join data from multiple sources         |
|    - resolve conflicting keys                |
|    - enrich with external lookups            |
|                                               |
|  Step 4: Feature Engineering                  |
|    - create derived features                 |
|    - encode categoricals                     |
|    - normalize / scale numerics              |
|    - create time-based aggregations          |
+--------------------+-------------------------+
                     |
                     v  [Clean, structured features]
+----------------------------------------------+
|             LOAD (Destination Layer)          |
|  Feature Store   Data Warehouse   Data Lake   |
|  Model Training Pipeline   BI Dashboard       |
|  Operational Database   Streaming Consumer    |
+----------------------------------------------+
```

---

### Data Ingestion: Sources and Methods

**Files** — CSV, JSON, Parquet, Avro. Ingested via file system reads, S3 bucket polling, or SFTP transfers. Common for batch pipelines.

**Databases** — SQL (Postgres, MySQL) and NoSQL (MongoDB, DynamoDB). Ingested via full table dumps or **CDC (Change Data Capture)** — a technique that captures only rows that changed since the last extraction.

```
Full Extract:  SELECT * FROM orders         (heavy, slow)
CDC Extract:   SELECT * FROM orders WHERE updated_at > last_run_time
```

**APIs** — REST endpoints polled on a schedule. Rate limits must be respected; authentication managed carefully. Results paginated and accumulated.

**Streams** — real-time event data from systems like **Apache Kafka** or **AWS Kinesis**. Data flows continuously rather than in scheduled batches. Events are consumed as they arrive.

```
Producer (App)  -->  [Kafka Topic: user-events]  -->  Consumer (Pipeline)
                           (messages buffer here)
```

---

### Data Cleaning: The Most Underrated Skill

Real-world data is almost always dirty. Here are the four most common problems and how to handle them:

**1. Missing Values**

| Strategy | When to Use | Example |
|---|---|---|
| Drop rows | Few missing, not systematic | Remove rows where age is null |
| Fill with mean/median | Numerical, roughly normal distribution | Replace missing income with median income |
| Fill with mode | Categorical | Replace missing city with most common city |
| Fill with 0 / "unknown" | When absence is meaningful | Flag missing purchase history as 0 |
| Impute with model | Complex, correlated features | Predict missing age from other features |

**2. Outliers**

```
Approach 1 — Z-score:  flag values more than 3 std deviations from mean
Approach 2 — IQR:      flag values outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR]
Approach 3 — Domain knowledge: "age > 120 is impossible"
```

**3. Duplicates**

```
Exact duplicates:   identical rows -> keep one, drop rest
Near-duplicates:    "John Smith" vs "john smith" -> normalize then dedup
Logical duplicates: same user, two records with different IDs -> resolve entity
```

**4. Format Inconsistencies**

```
Dates:   "2024-01-15", "Jan 15 2024", "15/01/2024" --> standardize to ISO 8601
Phone:   "+1-555-123-4567", "555.123.4567"          --> standardize to E.164
Names:   "JOHN SMITH", "john smith"                 --> title case or lowercase
```

---

### Feature Engineering

Feature engineering is the art of creating informative input variables from raw data. Good features often matter more than model choice.

**Derived Features**:
```
Raw:      order_date = "2024-03-15",  today = "2024-04-01"
Derived:  days_since_order = 17
Derived:  is_weekend_order = False
Derived:  hour_of_day = 14
```

**Categorical Encoding**:
```
One-hot encoding:
  color: "red"   --> [1, 0, 0]
  color: "blue"  --> [0, 1, 0]
  color: "green" --> [0, 0, 1]

Ordinal encoding (when order matters):
  size: "S"=1, "M"=2, "L"=3, "XL"=4
```

**Normalization and Scaling**:
```
Min-max scaling:    x' = (x - min) / (max - min)   --> [0, 1]
Standard scaling:   x' = (x - mean) / std           --> mean=0, std=1
Log transform:      x' = log(x + 1)                 --> handles skewed distributions
```

**Aggregations** (especially powerful for tabular ML):
```
Raw events: [user_id=42, product=shoes, timestamp=...]
Aggregate:  user_42_total_purchases_last_30_days = 5
            user_42_avg_order_value = $87.50
            user_42_days_since_last_purchase = 3
```

---

### Batch vs. Streaming Pipelines

**Batch Pipeline** processes data in large chunks on a schedule:

```
[Midnight]
  |
  +--> Extract all new rows from DB since yesterday
  +--> Clean and transform
  +--> Load to warehouse
  +--> Model training or scoring begins
  
[Next Midnight] -- repeats
```

*Use case*: Nightly report generation, weekly model retraining, monthly financial reconciliation.

**Streaming Pipeline** processes data event-by-event as it arrives:

```
Event arrives --> [Stream Processor] --> cleaned record --> [Feature Store]
(milliseconds)                                              (immediately fresh)
```

*Use case*: Real-time fraud detection, live recommendation updates, IoT anomaly detection.

**Comparison**:

| Property | Batch | Streaming |
|---|---|---|
| Latency | Minutes to hours | Milliseconds to seconds |
| Complexity | Lower | Higher |
| Cost | Lower (run periodically) | Higher (always running) |
| Data freshness | Stale (last batch) | Near real-time |
| Error handling | Easier (re-run batch) | Harder (fix in flight) |
| Tools | Spark, dbt, cron | Kafka, Flink, Spark Streaming |

---

### Tools: Conceptual Overview

**Apache Airflow** — a workflow orchestration tool that lets you define pipelines as **DAGs (Directed Acyclic Graphs)** of tasks. Schedule runs, monitor failures, retry automatically.

```
Airflow DAG:
  [extract_from_db] --> [clean_nulls] --> [engineer_features] --> [load_to_store]
```

**dbt (data build tool)** — transforms raw data inside your data warehouse using SQL. Allows version-controlled, testable data transformations. The "T" in ELT.

**Apache Spark** — distributed data processing engine for massive-scale batch and streaming workloads. Runs transformations across a cluster of machines in parallel.

```
Spark job on 100GB dataset:
  Worker 1: processes rows 1-10M
  Worker 2: processes rows 10M-20M
  ...
  Worker 10: processes rows 90M-100M
  --> results merged and written to output
```

**Great Expectations / Soda** — data quality testing tools that validate that your pipeline's output meets defined expectations (e.g., "this column should never be null", "values should be between 0 and 100").

---

### Privacy and Compliance

Data pipelines often process sensitive personal data. Key principles:

**PII (Personally Identifiable Information)** must be protected:

```
Techniques:
  Anonymization:  remove all identifiers entirely
  Pseudonymization: replace IDs with tokens (reversible with a key)
  Data masking:  "John Smith" --> "J*** S****"
  Encryption:    encrypt fields at rest and in transit
```

**Regulations** to be aware of:
- **GDPR** (EU): right to erasure, consent required, data minimization
- **CCPA** (California): right to know, right to delete, opt-out of sale
- **HIPAA** (US healthcare): strict protections for medical data

**Data minimization**: only collect and store data you actually need. Every extra field you store is a liability.

**Right to erasure**: if a user requests deletion, your pipeline must be able to trace and delete their data across all storage systems — including model training sets.

---

## 🔄 REVIEW

| Concept | Summary |
|---|---|
| Data pipeline | Automated system to move and transform data |
| ETL | Extract → Transform → Load |
| ELT | Extract → Load → Transform (warehouse-native) |
| CDC | Capture only changed rows since last extraction |
| Missing values | Drop, fill, impute, or flag based on context |
| Outliers | Z-score, IQR, or domain rules to detect/handle |
| Feature engineering | Creating informative derived variables |
| One-hot encoding | Convert categories to binary vectors |
| Normalization | Scale features to consistent numeric range |
| Batch pipeline | Scheduled, high-throughput, higher latency |
| Streaming pipeline | Continuous, low-latency, higher complexity |
| Airflow | Pipeline orchestration with DAGs |
| dbt | SQL-based transformation layer |
| Spark | Distributed batch/stream processing |
| PII | Personal data requiring privacy protections |

---

## ✨ SIMPLIFY

A data pipeline is a **water treatment plant**:

- **Extraction** = pumping raw water from rivers and groundwater (messy, mixed sources)
- **Transformation** = filtering, treating, and purifying (removing contaminants and inconsistencies)
- **Loading** = delivering clean water through pipes to homes (loading to destination)

Just as you wouldn't drink untreated river water, you wouldn't feed unprocessed raw data directly to a model.

**Batch** = filling a giant reservoir once a day, then distributing  
**Streaming** = water flowing continuously through pipes the moment it's needed

A broken pipe in the middle = a data pipeline failure — clean water (data) stops reaching homes (models and dashboards), and you might not even notice until people start complaining.

---

## 🏋️ PRACTICE

**Exercise 1 — Diagnose the Dirty Data**  
Given this raw dataset of customer orders, identify every data quality problem:

```
customer_id | order_date   | amount | country
------------+--------------+--------+--------
1001        | 2024-01-15   | 49.99  | USA
1001        | 2024-01-15   | 49.99  | USA       <-- ?
1002        | Jan 20, 2024 | -5.00  | US        <-- ?
1003        | 2024-01-22   |        | Canada    <-- ?
1004        | 2024-01-23   | 999999 | uk        <-- ?
```

**Exercise 2 — Feature Engineering**  
You have a raw e-commerce events table: `user_id, product_id, event_type (view/add_to_cart/purchase), timestamp`. Design 5 engineered features for a purchase-probability model. For each, write the transformation logic in plain language.

**Exercise 3 — Pipeline Design**  
Design a data pipeline for a recommendation system that needs user behavior data updated every hour. Specify: data sources, extraction method (batch/stream/CDC), key transformation steps, and destination.

**Exercise 4 — Batch vs. Stream Decision**  
For each use case, decide whether batch or streaming pipeline is more appropriate, and justify:
1. Detecting credit card fraud at point of sale
2. Generating a monthly sales report for executives
3. Updating a user's "recently viewed" product list on an e-commerce site
4. Retraining a churn prediction model on last week's data

**Exercise 5 — Privacy Analysis**  
A healthcare company wants to build a pipeline that processes patient records to train a diagnosis model. List five specific actions they should take to ensure privacy and compliance. For each action, name the problem it solves.

---

*Next Chapter: Deployment — taking your AI system from development to production.*
