# Chapter 37: Intermediate Projects
### *Level Up: Building Real-World AI Systems*

---

## Project Overview

These five projects bridge the gap between tutorial exercises and production-ready AI. Each one introduces a distinct problem domain, a different algorithmic family, and a unique set of engineering challenges. Work through them in order or jump to the one that excites you most.

| Project | Skills Required | Est. Time | Complexity |
|---|---|---|---|
| Movie Recommendation System | Linear algebra, CF algorithms, pandas | 6–8 hrs | ⭐⭐⭐ |
| Handwritten Digit Recognition | CNNs, Keras/PyTorch, image preprocessing | 5–7 hrs | ⭐⭐⭐ |
| Customer Churn Prediction | Feature engineering, ensemble models, SHAP | 8–10 hrs | ⭐⭐⭐⭐ |
| Text Summarizer | Transformers, HuggingFace, fine-tuning | 8–12 hrs | ⭐⭐⭐⭐ |
| Object Detection App | YOLO, computer vision, deployment | 10–14 hrs | ⭐⭐⭐⭐⭐ |

---

## 🎯 CONCEPT

**What makes a project "intermediate"?**

An intermediate AI project requires you to make non-trivial design decisions. You are no longer just calling `model.fit()` on a toy dataset. Instead, you must choose an appropriate architecture, handle messy real-world data, select and interpret evaluation metrics that actually reflect your business goal, and plan a path toward deployment.

Each project in this chapter follows a consistent anatomy:

- **Data layer** — where data comes from, how it is cleaned, and how it is split
- **Model layer** — algorithm selection, hyperparameter tuning, and training strategy
- **Evaluation layer** — task-specific metrics that go beyond raw accuracy
- **Improvement layer** — concrete next steps that push toward production quality

By building all five, you will have covered supervised learning, unsupervised learning, deep learning, natural language processing, and computer vision — the five pillars of modern applied AI.

---

## 🧑‍🏫 TEACH (Feynman Style)

Imagine you have five friends, each with a different problem:

1. **The movie buff** cannot decide what to watch next. You build a system that watches their watching history and says "you'll probably love *this* film" — without them ever telling you their preferences explicitly. That is **collaborative filtering**.

2. **The postal worker** needs to sort handwritten envelopes automatically. You build a small brain that has seen 60,000 handwritten digits and learned to tell a "3" from an "8" by the curves in the ink. That is a **convolutional neural network**.

3. **The telecom manager** wants to know which customers will cancel their plan next month, so the retention team can call them first. You build a model that reads 20 behavioural signals and outputs a churn probability. That is **binary classification with class imbalance handling**.

4. **The news editor** receives 500 articles a day and needs a two-sentence summary of each. You fine-tune a pre-trained language model to compress meaning without losing it. That is **abstractive text summarization**.

5. **The warehouse supervisor** needs a camera to count boxes on a moving conveyor. You deploy a real-time object detection model that draws bounding boxes around each object in every video frame. That is **YOLO-based object detection**.

Each solution follows the same thinking pattern: *understand the goal → pick the right tool → measure the right thing → iterate*.

---

## 🔬 DEEP UNDERSTANDING

### Project 1 — Movie Recommendation System

**Dataset:** MovieLens 100K (100,000 ratings, 943 users, 1,682 movies). Download from `https://grouplens.org/datasets/movielens/100k/`.

**Architecture:**

```
Users × Movies rating matrix
┌─────────────────────────────────────┐
│      M1   M2   M3   M4   M5  ...   │
│ U1 [  5    ?    3    ?    4  ... ]  │
│ U2 [  ?    4    ?    5    ?  ... ]  │
│ U3 [  3    ?    ?    2    5  ... ]  │
└─────────────────────────────────────┘
          │
          ▼  SVD Decomposition
  R ≈ U · Σ · Vᵀ
  (943×k) (k×k) (k×1682)
          │
          ▼  Fill missing values
┌─────────────────────────────────────┐
│      M1   M2   M3   M4   M5  ...   │
│ U1 [  5   3.8   3   4.1   4  ... ] │
│ U2 [ 4.2   4   3.7   5   3.9 ... ] │
└─────────────────────────────────────┘
```

**Implementation Steps:**

```python
import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds
from sklearn.metrics import mean_squared_error

# 1. Load data
cols = ['user_id','item_id','rating','timestamp']
df = pd.read_csv('u.data', sep='\t', names=cols)

# 2. Build user-item matrix
matrix = df.pivot_table(index='user_id', columns='item_id',
                        values='rating').fillna(0)
R = matrix.values

# 3. Normalise by subtracting user mean
user_mean = np.mean(R, axis=1)
R_demeaned = R - user_mean.reshape(-1, 1)

# 4. SVD decomposition (k=50 latent factors)
U, sigma, Vt = svds(R_demeaned, k=50)
sigma = np.diag(sigma)

# 5. Reconstruct predicted ratings
R_pred = np.dot(np.dot(U, sigma), Vt) + user_mean.reshape(-1, 1)
preds_df = pd.DataFrame(R_pred, columns=matrix.columns)

# 6. Evaluate on held-out ratings
# RMSE, MAE computed against actual test set
```

**Evaluation Metrics:**

| Metric | Formula | Target |
|---|---|---|
| RMSE | √(mean((r̂ − r)²)) | < 1.0 |
| MAE | mean(\|r̂ − r\|) | < 0.8 |
| Precision@K | relevant items in top-K / K | > 0.4 |

**Improvement Ideas:**
- Implement user-user and item-item cosine similarity baselines first, then show SVD outperforms them.
- Add a **hybrid recommender** that blends collaborative filtering scores with content-based features (genre, director) using a weighted ensemble.
- Use `Surprise` library for quick benchmarking of SVD, NMF, and KNN variants.

---

### Project 2 — Handwritten Digit Recognition

**Dataset:** MNIST (70,000 grayscale 28×28 images, 10 classes). Built into Keras: `keras.datasets.mnist.load_data()`.

**CNN Architecture:**

```
Input 28×28×1
      │
      ▼
┌─────────────┐
│  Conv2D 32  │  3×3 kernel, ReLU, BatchNorm
│  filters    │
└─────────────┘
      │
      ▼
┌─────────────┐
│  MaxPool    │  2×2, stride 2  →  14×14×32
└─────────────┘
      │
      ▼
┌─────────────┐
│  Conv2D 64  │  3×3 kernel, ReLU, BatchNorm
│  filters    │
└─────────────┘
      │
      ▼
┌─────────────┐
│  MaxPool    │  2×2, stride 2  →  7×7×64
└─────────────┘
      │
      ▼  Flatten → 3136 units
      │
      ▼
┌─────────────┐
│  Dense 128  │  ReLU, Dropout(0.5)
└─────────────┘
      │
      ▼
┌─────────────┐
│  Dense 10   │  Softmax → class probabilities
└─────────────┘
```

**Implementation Steps:**

```python
import tensorflow as tf
from tensorflow.keras import layers, models

# 1. Load and preprocess
(X_train, y_train), (X_test, y_test) = tf.keras.datasets.mnist.load_data()
X_train = X_train[..., None] / 255.0   # add channel dim, normalise
X_test  = X_test[..., None]  / 255.0

# 2. Data augmentation
datagen = tf.keras.preprocessing.image.ImageDataGenerator(
    rotation_range=10, zoom_range=0.1, width_shift_range=0.1)

# 3. Build model
model = models.Sequential([
    layers.Conv2D(32, 3, activation='relu', input_shape=(28,28,1)),
    layers.BatchNormalization(),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# 4. Train
model.fit(datagen.flow(X_train, y_train, batch_size=64),
          epochs=15, validation_data=(X_test, y_test))
```

**Evaluation Metrics:**

- **Test accuracy:** target ≥ 99.2%
- **Confusion matrix:** identify which digit pairs are most confused (common: 4/9, 3/8)
- **Per-class precision and recall** via `sklearn.metrics.classification_report`

**Improvement Ideas:**
- Wrap the trained model in a **Flask REST API**: accept a base64-encoded image, preprocess, predict, return JSON with class and confidence score.
- Try **capsule networks** (CapsNet) and compare against CNN on rotated test images.
- Explore **transfer learning** by using a MobileNetV2 backbone fine-tuned on MNIST.

---

### Project 3 — Customer Churn Prediction

**Dataset:** Telco Customer Churn (Kaggle). 7,043 rows, 20 features, binary target `Churn`. Download via `kaggle datasets download -d blastchar/telco-customer-churn`.

**Pipeline Architecture:**

```
Raw CSV (7,043 rows × 21 cols)
         │
         ▼
┌─────────────────────┐
│  EDA & Cleaning     │  Drop CustomerID, fix TotalCharges dtype
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Feature Engineering│  tenure bins, charge ratios, contract encoding
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Train/Test Split   │  80/20, stratified on Churn
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  SMOTE Oversampling │  Balance minority class (26% churn)
└─────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
Random      XGBoost
Forest      Classifier
    └────┬────┘
         ▼
  Stacking Ensemble
         │
         ▼
  SHAP Explainability
```

**Implementation Steps:**

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from sklearn.metrics import roc_auc_score, classification_report
import shap

df = pd.read_csv('WA_Fn-UseC_-Telco-Customer-Churn.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df.dropna(inplace=True)
df['Churn'] = (df['Churn'] == 'Yes').astype(int)

# Encode categoricals
df = pd.get_dummies(df.drop('customerID', axis=1))

X = df.drop('Churn', axis=1)
y = df['Churn']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

# SMOTE to handle class imbalance
sm = SMOTE(random_state=42)
X_res, y_res = sm.fit_resample(X_train, y_train)

# XGBoost with early stopping
xgb = XGBClassifier(n_estimators=500, learning_rate=0.05,
                    use_label_encoder=False, eval_metric='logloss')
xgb.fit(X_res, y_res, eval_set=[(X_test, y_test)],
        early_stopping_rounds=20, verbose=False)

print(roc_auc_score(y_test, xgb.predict_proba(X_test)[:,1]))

# SHAP feature importance
explainer = shap.TreeExplainer(xgb)
shap_values = explainer.shap_values(X_test)
shap.summary_plot(shap_values, X_test)
```

**Evaluation Metrics:**

| Metric | Why It Matters |
|---|---|
| AUC-ROC | Threshold-independent ranking quality |
| Precision-Recall curve | Better than ROC for imbalanced classes |
| F1 Score | Harmonic mean of precision and recall |
| Business lift | Revenue saved vs. random calling |

**Improvement Ideas:**
- Add **SHAP force plots** to explain individual predictions to business stakeholders.
- Build an **isotonic regression calibrator** on top of the model so probabilities are well-calibrated.
- Package the pipeline as a **scikit-learn Pipeline** object and serve it with FastAPI.

---

### Project 4 — Text Summarizer

**Dataset:** CNN/DailyMail (311,971 article–highlight pairs). Load via HuggingFace Datasets: `load_dataset("cnn_dailymail", "3.0.0")`.

**Architecture:**

```
Input Article (500–800 tokens)
         │
         ▼
┌──────────────────────────────┐
│  Tokenizer (BartTokenizer)   │  Truncate to 1024 tokens
└──────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Encoder (12-layer Transformer)│  Bi-directional attention
│  Contextual representations   │  over full document
└──────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Decoder (12-layer Transformer)│  Auto-regressive, cross-attention
│  Generates summary tokens     │  to encoder outputs
└──────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Output Summary (2–4 sentences)│  Beam search, length penalty
└──────────────────────────────┘
```

**Implementation Steps:**

```python
from transformers import (BartForConditionalGeneration, BartTokenizer,
                          Seq2SeqTrainer, Seq2SeqTrainingArguments)
from datasets import load_dataset
import evaluate

dataset = load_dataset("cnn_dailymail", "3.0.0")
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")

def preprocess(examples):
    inputs = tokenizer(examples["article"], max_length=1024,
                       truncation=True, padding="max_length")
    labels = tokenizer(examples["highlights"], max_length=128,
                       truncation=True, padding="max_length")
    inputs["labels"] = labels["input_ids"]
    return inputs

tokenized = dataset.map(preprocess, batched=True)

rouge = evaluate.load("rouge")

def compute_metrics(eval_pred):
    preds, labels = eval_pred
    decoded_preds  = tokenizer.batch_decode(preds, skip_special_tokens=True)
    decoded_labels = tokenizer.batch_decode(labels, skip_special_tokens=True)
    return rouge.compute(predictions=decoded_preds, references=decoded_labels)

training_args = Seq2SeqTrainingArguments(
    output_dir="./bart-finetuned",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    predict_with_generate=True,
    fp16=True,
    evaluation_strategy="epoch"
)

trainer = Seq2SeqTrainer(
    model=model, args=training_args,
    train_dataset=tokenized["train"].select(range(10000)),
    eval_dataset=tokenized["validation"].select(range(500)),
    compute_metrics=compute_metrics
)
trainer.train()
```

**Evaluation Metrics:**

| Metric | Measures | Baseline (BART) | Fine-tuned Target |
|---|---|---|---|
| ROUGE-1 | Unigram overlap | 44.16 | ≥ 45.0 |
| ROUGE-2 | Bigram overlap | 21.28 | ≥ 22.0 |
| ROUGE-L | Longest common subsequence | 40.90 | ≥ 42.0 |

**Improvement Ideas:**
- Fine-tune on a **custom domain corpus** (legal, medical, financial) by replacing the CNN/DailyMail dataset with domain-specific document–summary pairs.
- Experiment with **T5-small** for faster iteration before scaling to BART-large.
- Add a **Gradio demo** where users paste any article and see the generated summary in seconds.

---

### Project 5 — Object Detection App

**Dataset:** Use **Roboflow** (`roboflow.com`) to annotate custom images, or start with the COCO128 dataset (128 images, 80 classes) included in Ultralytics.

**YOLO Architecture:**

```
Input Image (640×640×3)
         │
         ▼
┌──────────────────────────┐
│  Backbone (CSPDarknet)   │  Feature extraction at multiple scales
│  P3: 80×80  feature map  │
│  P4: 40×40  feature map  │
│  P5: 20×20  feature map  │
└──────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Neck (PANet / FPN)      │  Multi-scale feature fusion
│  Upsampling + concat      │
└──────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Detection Head (×3)     │  One head per feature map scale
│  Predicts per anchor:    │
│  [x, y, w, h, conf, cls] │
└──────────────────────────┘
         │
         ▼
  Non-Maximum Suppression
         │
         ▼
  Bounding Boxes + Labels
```

**Implementation Steps:**

```python
from ultralytics import YOLO

# 1. Load pre-trained YOLOv8n (nano — fastest)
model = YOLO("yolov8n.pt")

# 2. Train on custom data (requires data.yaml)
# data.yaml format:
#   path: /datasets/my_project
#   train: images/train
#   val: images/val
#   names: {0: 'cat', 1: 'dog'}

results = model.train(
    data="data.yaml",
    epochs=100,
    imgsz=640,
    batch=16,
    device=0          # GPU 0; use 'cpu' if no GPU
)

# 3. Evaluate
metrics = model.val()
print(f"mAP50:    {metrics.box.map50:.3f}")
print(f"mAP50-95: {metrics.box.map:.3f}")

# 4. Inference on new image
result = model.predict("test.jpg", conf=0.25)
result[0].show()   # display with bounding boxes
result[0].save()   # save annotated image
```

**Streamlit Deployment:**

```python
# app.py
import streamlit as st
from ultralytics import YOLO
from PIL import Image
import numpy as np

model = YOLO("best.pt")   # your fine-tuned weights

st.title("🎯 Real-Time Object Detector")
uploaded = st.file_uploader("Upload an image", type=["jpg","png"])

if uploaded:
    img = Image.open(uploaded)
    results = model.predict(np.array(img), conf=0.25)
    annotated = results[0].plot()
    st.image(annotated, caption="Detections", use_column_width=True)
    st.write(f"Objects found: {len(results[0].boxes)}")
```

Run with: `streamlit run app.py`

**Evaluation Metrics:**

| Metric | Definition | Good Threshold |
|---|---|---|
| mAP@50 | Mean AP at IoU 0.50 | ≥ 0.70 |
| mAP@50-95 | Mean AP across IoU thresholds | ≥ 0.45 |
| IoU | Intersection over Union | ≥ 0.60 |
| Inference speed | ms per frame | < 30 ms (GPU) |

**Improvement Ideas:**
- Export to **ONNX or TensorRT** for 3–5× speedup on NVIDIA hardware.
- Add **video stream support** using OpenCV: read frame-by-frame, run inference, display annotated output.
- Use **active learning**: flag low-confidence predictions, send them to human annotators in Roboflow, retrain — closing the production data loop.

---

## 🔄 REVIEW

**Core patterns across all five projects:**

| Concept | Where It Appeared |
|---|---|
| Matrix factorisation | SVD in recommendations |
| Spatial feature extraction | Conv2D layers in digit recognition |
| Class imbalance handling | SMOTE + AUC-ROC in churn prediction |
| Transfer learning | BART fine-tuning in summarisation |
| Multi-scale feature fusion | PANet neck in YOLO |

**Key evaluation principles to remember:**

1. **Match the metric to the business goal.** Churn prediction cares about recall on churners (don't miss them), not global accuracy.
2. **ROUGE does not measure fluency.** A summary can score well on ROUGE but read awkwardly. Human evaluation still matters.
3. **mAP is averaged.** A model can have high mAP@50 but poor mAP@50-95, meaning it draws imprecise boxes. Both numbers matter.
4. **RMSE penalises large errors more than MAE.** In recommendations, a few wildly wrong predictions hurt RMSE disproportionately.
5. **Confusion matrices reveal bias.** Always inspect per-class performance before claiming a classifier is "good."

---

## ✨ SIMPLIFY

**One-line summaries of each project:**

- **Recommender:** Find users similar to you, then suggest what they liked.
- **Digit recogniser:** Slide a small filter over the image, detect edges and curves, combine them into a digit identity.
- **Churn predictor:** Score each customer's risk of leaving based on their billing and service behaviour.
- **Text summariser:** Read the whole document at once, then write the key ideas in your own words.
- **Object detector:** Divide the image into a grid, ask each cell "is there an object here, and what is its shape?", then clean up overlapping answers.

**The universal project checklist:**

```
[ ] Problem clearly defined with a measurable goal
[ ] Data obtained, cleaned, and split (train/val/test)
[ ] Baseline model established (always beat the baseline first)
[ ] Task-appropriate evaluation metric chosen
[ ] At least one iteration of improvement attempted
[ ] Results reproducible (seed set, requirements.txt saved)
[ ] Code committed to version control
```

---

## 🏋️ PRACTICE

### Exercises — Project 1 (Recommender)
1. Implement user-user cosine similarity from scratch (no libraries). Compare RMSE with SVD.
2. Add a cold-start handler: when a new user has fewer than 5 ratings, fall back to popularity-based recommendations.
3. Evaluate precision@10 and recall@10 using a leave-one-out protocol.

### Exercises — Project 2 (CNN)
1. Remove BatchNormalization and retrain. How much does test accuracy drop?
2. Visualise the filters learned by the first Conv2D layer as a grid of 32 small images.
3. Try adding a **third Conv2D block** (128 filters). Does it help? At what cost in training time?

### Exercises — Project 3 (Churn)
1. Train a logistic regression baseline. What is its AUC-ROC? By how much does XGBoost improve it?
2. Plot SHAP beeswarm and dependence plots for the top 3 most important features. Interpret what each one tells the business.
3. Build a threshold optimisation loop: vary the classification threshold from 0.1 to 0.9 and plot F1 vs. threshold. Choose the threshold that maximises F1.

### Exercises — Project 4 (Summariser)
1. Run inference with `facebook/bart-large-cnn` (no fine-tuning) on 20 articles. Compute ROUGE scores as a zero-shot baseline.
2. Fine-tune for 1 epoch on 5,000 examples. Compare ROUGE scores against the baseline.
3. Try **beam search** (num_beams=4) vs. **greedy decoding**. Which produces better ROUGE-L?

### Exercises — Project 5 (Object Detection)
1. Use `model.export(format="onnx")` to export YOLOv8n. Measure inference latency before and after with `time.perf_counter()`.
2. Annotate 50 images of a custom object (e.g., coffee cups on a desk) in Roboflow. Fine-tune YOLOv8n for 50 epochs. Report mAP@50.
3. Add a **confidence histogram** to the Streamlit app: after detection, plot a bar chart of confidence scores for all detected objects.

### Capstone Challenge
Build a **unified pipeline** that:
1. Accepts a news article URL
2. Fetches and summarises the article text (Project 4)
3. Detects objects in any images embedded in the article (Project 5)
4. Returns a JSON payload with `{"summary": "...", "detected_objects": [...], "churn_risk": null}`

Serve it as a single FastAPI endpoint. This is the kind of multi-model integration real AI teams build.

---

*Chapter 38 → Advanced Projects: GANs, Reinforcement Learning Agents, and LLM Fine-Tuning from Scratch.*
