# Chapter 36: Beginner Projects
### *From Theory to Working Code: Your First 5 AI Projects*

---

## 🎯 CONCEPT

You've absorbed the theory. Now it's time to build. This chapter walks you through **5 complete, hands-on AI projects** — each one chosen to cement a core skill, produce a satisfying result, and give you something real to show. No toy snippets: every project includes a dataset, a pipeline, code structure, and a path to make it your own.

| # | Project | Algorithm | Est. Time | Difficulty |
|---|---------|-----------|-----------|------------|
| 1 | AI Spam Detector | Naive Bayes | 2–3 hrs | ⭐ |
| 2 | House Price Predictor | Linear Regression | 3–4 hrs | ⭐⭐ |
| 3 | Image Classifier | Transfer Learning (CNN) | 4–5 hrs | ⭐⭐⭐ |
| 4 | Sentiment Analyzer | TF-IDF + Logistic Regression | 3–4 hrs | ⭐⭐ |
| 5 | Chatbot with OpenAI API | Prompt Engineering | 2–3 hrs | ⭐⭐ |

> **Learning philosophy:** You don't need to understand every line on day one. Build it, run it, break it, fix it — that loop is where real learning happens.

---

## 🧑‍🏫 TEACH (Feynman Style)

Imagine explaining these projects to a curious 12-year-old:

**Spam Detector:** "We show the computer thousands of spam and non-spam texts. It learns which words show up more in spam — words like 'FREE', 'WIN', 'CLICK NOW' — and uses that pattern to judge new messages."

**House Price Predictor:** "We give the computer facts about houses — size, location, number of rooms — and tell it each house's price. It draws the best straight line through that data and uses the line to guess prices it's never seen."

**Image Classifier:** "We use a brain that already learned to see — trained on millions of photos — and we teach it one more thing: how to tell apart cats from dogs, or cars from planes. It's like hiring an expert and giving them a short extra training course."

**Sentiment Analyzer:** "We count how often good and bad words appear in a review. More positive words → happy review. More negative words → angry review. Simple, but surprisingly powerful."

**Chatbot:** "We write the AI a note at the start of every conversation — 'You are a helpful assistant who...' — and keep adding the conversation history so it remembers what was said. We're not building the brain; we're directing it."

The key insight: **every AI project is just data in → transformation → prediction out.** Once you see that pattern, no project feels mysterious.

---

## 🔬 DEEP UNDERSTANDING

### Project 1 — AI Spam Detector (Naive Bayes)

**What you'll build:** A classifier that reads an SMS message and labels it "spam" or "ham" (not spam).

**Dataset:** [SMS Spam Collection](https://archive.ics.uci.edu/ml/datasets/sms+spam+collection) — 5,574 labeled messages.

**Skills:** text preprocessing, bag-of-words, Naive Bayes, scikit-learn pipelines.

```
ASCII Architecture
==================
Raw SMS
   │
   ▼
[Lowercase + Strip punctuation]
   │
   ▼
[Tokenize → word list]
   │
   ▼
[CountVectorizer → word frequency matrix]
   │
   ▼
[MultinomialNB model]
   │
   ▼
[Predict: SPAM / HAM]  ──► Confidence score
```

**Step-by-step guide:**

1. Download the dataset and load it with `pandas`.
2. Split the label and text columns.
3. Build a scikit-learn `Pipeline` with `CountVectorizer` and `MultinomialNB`.
4. Split into 80/20 train/test sets.
5. Train, predict, and print a classification report.

**Pseudocode:**
```
LOAD dataset as (labels, messages)
ENCODE labels: ham→0, spam→1

SPLIT data → train_set (80%), test_set (20%)

PIPELINE:
  step1 = CountVectorizer(stop_words='english')
  step2 = MultinomialNB(alpha=1.0)

FIT pipeline on train_set
PREDICT on test_set

PRINT accuracy, precision, recall, F1
```

**Expected output:**
```
              precision    recall  f1-score
         ham       0.99      0.99      0.99
        spam       0.96      0.96      0.96
    accuracy                           0.99
```

**Extension ideas:**
- Replace `CountVectorizer` with `TfidfVectorizer` — does accuracy improve?
- Try `ComplementNB` for better spam recall.
- Build a simple CLI: `python spam_detector.py "You won a FREE iPhone!"`
- Visualize the top 20 most "spammy" words with a bar chart.

---

### Project 2 — House Price Predictor (Linear Regression)

**What you'll build:** A regression model that predicts the median house value given neighborhood statistics.

**Dataset:** California Housing (`sklearn.datasets.fetch_california_housing`) — 20,640 samples, 8 features.

**Skills:** feature engineering, normalization, linear regression, RMSE/R² evaluation.

```
ASCII Architecture
==================
Raw Features
(MedInc, HouseAge, AveRooms...)
   │
   ▼
[Handle missing values]
   │
   ▼
[StandardScaler → normalize all features]
   │
   ▼
[Train/Test Split 80/20]
   │
   ▼
[LinearRegression model]
   │
   ▼
[Predictions]
   │
   ▼
[RMSE · R² · Residual Plot]
```

**Step-by-step guide:**

1. Load the dataset; inspect with `df.describe()` and `df.corr()`.
2. Check for missing values (California Housing has none, but practice the habit).
3. Scale features with `StandardScaler`.
4. Split data and train `LinearRegression`.
5. Compute RMSE and R². Plot predicted vs. actual prices.

**Pseudocode:**
```
LOAD california_housing → X (features), y (prices)

EXPLORE:
  PRINT X.describe()
  PLOT correlation heatmap

PREPROCESS:
  scaler = StandardScaler()
  X_scaled = scaler.fit_transform(X)

SPLIT X_scaled, y → X_train, X_test, y_train, y_test

MODEL = LinearRegression()
MODEL.fit(X_train, y_train)

y_pred = MODEL.predict(X_test)

RMSE = sqrt(mean_squared_error(y_test, y_pred))
R2   = r2_score(y_test, y_pred)
PRINT "RMSE:", RMSE, "R²:", R2

PLOT y_test vs y_pred (scatter + ideal line)
```

**Expected output:**
```
RMSE: ~0.72  (in units of $100,000)
R²:   ~0.60
```

**Extension ideas:**
- Add polynomial features (`PolynomialFeatures(degree=2)`) — watch R² jump.
- Compare with `Ridge` and `Lasso` regression; discuss regularization.
- Plot a map of California coloured by predicted price error.
- Try `GradientBoostingRegressor` and compare results.

---

### Project 3 — Image Classifier (Transfer Learning with CNN)

**What you'll build:** A classifier that labels images into 10 categories using a pre-trained ResNet or MobileNet backbone.

**Dataset:** CIFAR-10 (via `torchvision.datasets`) — 60,000 32×32 colour images across 10 classes.

**Skills:** transfer learning, fine-tuning final layers, `torchvision`, `PIL`, data augmentation.

```
ASCII Architecture
==================
Raw Image (32×32 or 224×224)
   │
   ▼
[Resize · Normalize · Augment]
   │
   ▼
[DataLoader (batch_size=32)]
   │
   ▼
[Pre-trained ResNet-18]
   │  (frozen convolutional layers)
   ▼
[Custom FC head → 10 classes]
   │
   ▼
[Softmax → class probabilities]
   │
   ▼
[Predicted label + confidence]
```

**Step-by-step guide:**

1. Load CIFAR-10 using `torchvision.datasets.CIFAR10`.
2. Apply transforms: resize to 224×224, normalize to ImageNet mean/std.
3. Load `torchvision.models.resnet18(pretrained=True)`.
4. Freeze all layers; replace the final `fc` layer with `nn.Linear(512, 10)`.
5. Train only the new head for 5 epochs. Then unfreeze and fine-tune for 5 more.
6. Evaluate accuracy on the test set.

**Pseudocode:**
```
LOAD CIFAR10 with transforms:
  Resize(224), ToTensor(), Normalize(mean, std)

model = resnet18(pretrained=True)
FOR layer IN model.parameters():
  layer.requires_grad = False          # freeze backbone

model.fc = Linear(512, 10)             # new trainable head

optimizer = Adam(model.fc.parameters(), lr=1e-3)
criterion = CrossEntropyLoss()

FOR epoch IN range(5):                 # phase 1: head only
  FOR batch IN train_loader:
    outputs = model(images)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()

UNFREEZE all layers
optimizer = Adam(model.parameters(), lr=1e-4)

FOR epoch IN range(5):                 # phase 2: fine-tune
  ...same training loop...

EVALUATE on test_loader
PRINT "Test accuracy:", correct / total
```

**Expected output:**
```
Phase 1 (head only)  – Test accuracy: ~72%
Phase 2 (fine-tuned) – Test accuracy: ~88%
```

**Extension ideas:**
- Try `MobileNetV2` for a lighter model; compare size vs. accuracy.
- Apply stronger augmentation: random crops, colour jitter, cutout.
- Export the model with `torch.onnx.export` and run inference with ONNX Runtime.
- Build a web app with Flask or Streamlit that accepts an uploaded photo.

---

### Project 4 — Sentiment Analyzer (Tweet / Review Classification)

**What you'll build:** A model that reads movie reviews and classifies them as Positive or Negative.

**Dataset:** IMDB Movie Reviews (`datasets` library or `sklearn`) — 50,000 labeled reviews.

**Skills:** NLP preprocessing, TF-IDF vectorization, logistic regression, confusion matrix.

```
ASCII Architecture
==================
Raw Review Text
   │
   ▼
[Lowercase · Remove HTML · Strip punctuation]
   │
   ▼
[Remove stopwords · Stem/Lemmatize]
   │
   ▼
[TfidfVectorizer (max_features=10,000)]
   │       └── IDF weights rare words higher
   ▼
[LogisticRegression]
   │
   ▼
[POSITIVE / NEGATIVE + probability]
   │
   ▼
[Confusion Matrix · ROC-AUC curve]
```

**Step-by-step guide:**

1. Load the IMDB dataset.
2. Clean text: lowercase, remove `<br />` HTML tags, strip punctuation.
3. Vectorize with `TfidfVectorizer(ngram_range=(1,2), max_features=10000)`.
4. Train `LogisticRegression(max_iter=1000)`.
5. Plot a confusion matrix and ROC-AUC curve.

**Pseudocode:**
```
LOAD imdb_reviews → texts, labels (0=neg, 1=pos)

CLEAN each text:
  text = lowercase(text)
  text = remove_html_tags(text)
  text = remove_punctuation(text)
  text = remove_stopwords(text)

SPLIT texts, labels → train (80%), test (20%)

vectorizer = TfidfVectorizer(ngram_range=(1,2), max_features=10000)
X_train = vectorizer.fit_transform(train_texts)
X_test  = vectorizer.transform(test_texts)

model = LogisticRegression(C=1.0, max_iter=1000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:,1]

PRINT classification_report(y_test, y_pred)
PLOT confusion_matrix(y_test, y_pred)
PLOT roc_curve(y_test, y_prob)  ──► AUC score
```

**Expected output:**
```
              precision    recall  f1-score
    negative       0.89      0.88      0.89
    positive       0.88      0.89      0.89
    accuracy                           0.89
    AUC:  0.96
```

**Extension ideas:**
- Swap logistic regression for `LinearSVC` — often faster with similar accuracy.
- Add VADER (`nltk.sentiment.vader`) as a rule-based baseline to compare against.
- Use `eli5` or SHAP to show which words drove each prediction.
- Extend to 3-class (positive / neutral / negative) using Twitter data.

---

### Project 5 — Chatbot with OpenAI API

**What you'll build:** A conversational chatbot in the terminal that maintains context across turns and can be given a custom persona.

**Skills:** OpenAI API, prompt engineering, conversation memory, token management, Python.

```
ASCII Architecture
==================
[System Prompt] ──────────────────────────┐
                                           │
User types message                         ▼
   │                              [messages list]
   ▼                              (role/content pairs)
[Append as {"role":"user",...}]            │
   │                                       │
   └──────────────────────────────────────►│
                                           ▼
                              [openai.chat.completions.create]
                                           │
                                           ▼
                              [API Response (assistant turn)]
                                           │
                                           ▼
                        [Append to messages list]  ──► loop
                                           │
                                           ▼
                              [Print response to user]
```

**Step-by-step guide:**

1. Install `openai` (`pip install openai`) and set your `OPENAI_API_KEY` environment variable.
2. Define a system prompt that gives the bot a persona.
3. Maintain a `messages` list that grows with each turn.
4. Call `openai.chat.completions.create()` and append the response.
5. Add a token budget check to trim old messages and avoid hitting the context limit.

**Pseudocode:**
```
IMPORT openai, os

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SYSTEM_PROMPT = {
  "role": "system",
  "content": "You are a helpful AI tutor specialising in machine learning.
               Explain concepts simply, use analogies, and encourage the user."
}

messages = [SYSTEM_PROMPT]
MAX_TURNS = 20

PRINT "Chatbot ready. Type 'quit' to exit."

LOOP:
  user_input = INPUT("> ")
  IF user_input == "quit": BREAK

  messages.APPEND({"role": "user", "content": user_input})

  IF len(messages) > MAX_TURNS:
    messages = [SYSTEM_PROMPT] + messages[-MAX_TURNS:]  # trim oldest turns

  response = client.chat.completions.create(
    model    = "gpt-4o-mini",
    messages = messages,
    max_tokens      = 512,
    temperature     = 0.7
  )

  reply = response.choices[0].message.content
  messages.APPEND({"role": "assistant", "content": reply})
  PRINT "Bot:", reply
```

**Expected output:**
```
Chatbot ready. Type 'quit' to exit.
> What is overfitting?
Bot: Great question! Overfitting is when your model memorises the training
     data instead of learning general patterns...
> Give me an analogy.
Bot: Think of it like a student who memorises every past exam question
     word-for-word, but fails when the questions are phrased differently...
```

**Extension ideas:**
- Add a `--persona` CLI flag to switch between "tutor", "chef", or "coach".
- Stream the response token-by-token with `stream=True` for a typing effect.
- Save conversation history to a JSON file for replay.
- Build a Streamlit UI with a chat interface (`st.chat_message`).
- Add a RAG layer: embed your own notes and inject relevant chunks into the prompt.

---

## 🔄 REVIEW

| Concept | Project Where It Appears |
|---------|--------------------------|
| Text vectorization | Spam Detector, Sentiment Analyzer |
| Train/test split | All 5 projects |
| Evaluation metrics (RMSE, F1, AUC) | House Price, Spam, Sentiment |
| Transfer learning | Image Classifier |
| Prompt engineering | Chatbot |
| Conversation memory | Chatbot |
| Overfitting / regularization | House Price (Ridge/Lasso extension) |
| Data augmentation | Image Classifier (extension) |

**Quick-fire questions:**
1. Why does Naive Bayes work well for text despite its "naive" independence assumption?
2. What does R² = 0.60 actually mean in the house price project?
3. Why do we freeze the backbone layers before fine-tuning in the CNN project?
4. What is the difference between unigram and bigram features in TF-IDF?
5. What happens to a chatbot if you never trim the `messages` list?

*(Answers: 1. In practice, word co-occurrences are weak enough that the independence assumption still yields strong posteriors. 2. Your model explains 60% of the variance in house prices. 3. Frozen backbone weights prevent destroying pre-trained features with a high learning rate. 4. Bigrams capture phrases like "not good" that unigrams miss. 5. You eventually exceed the model's context window and get an error — or costs spike.)*

---

## ✨ SIMPLIFY

**The One-Sentence Summary for Each Project:**

- **Spam Detector:** Count word frequencies → feed to probability model → flag spam.
- **House Price Predictor:** Scale numbers → fit a line → read off the predicted price.
- **Image Classifier:** Borrow a seeing brain → add a new labelling layer → retrain the layer.
- **Sentiment Analyzer:** Weigh important words → sum the score → positive or negative.
- **Chatbot:** Keep the conversation as a list → send the whole list to the API → append the reply.

**The Universal AI Project Template:**
```
1. GET data
2. CLEAN data
3. TRANSFORM data (vectorize, normalize, resize)
4. SPLIT data (train / test)
5. CHOOSE model
6. FIT model on train
7. EVALUATE on test
8. ITERATE (tune, augment, swap model)
9. DEPLOY (CLI, web app, API)
```

Every project in this chapter — and most projects you'll ever build — fits this template. Mastering the template is mastering AI engineering.

---

## 🏋️ PRACTICE

### Warm-Up Exercises (15–30 min each)

1. **Spam Detector tweak:** Replace `MultinomialNB` with `BernoulliNB`. Which has higher precision? Which has higher recall? When would you prefer precision over recall in a spam filter?

2. **House Price exploration:** Run `df.corr()['MedHouseVal'].sort_values()`. Which feature correlates most with price? Least? Does this match your intuition?

3. **Sentiment sanity check:** Feed your trained sentiment analyzer these three sentences and record the probabilities:
   - `"This movie was an absolute masterpiece."`
   - `"It was okay, not great, not terrible."`
   - `"I want my two hours back."`

### Main Challenges (1–3 hrs each)

4. **End-to-end spam API:** Wrap your spam detector in a Flask API with a single endpoint `POST /predict` that accepts `{"message": "..."}` and returns `{"label": "spam", "confidence": 0.97}`.

5. **Feature importance report:** For the house price model, print the coefficient of each feature (weight from `LinearRegression.coef_`). Create a horizontal bar chart sorted by absolute value. Write two sentences explaining what the biggest positive and negative coefficients mean.

6. **Chatbot persona challenge:** Create three different system prompts — a Socratic tutor (only asks questions), a blunt code reviewer (gives harsh feedback), and a patient explainer (uses analogies for everything). Test each with the same 5 questions and compare the tones.

### Stretch Goals (open-ended)

7. **Stack two projects:** Feed a scraped product review into your Sentiment Analyzer; if it's negative, automatically send it to a summarization prompt in your Chatbot and get a one-sentence summary of the complaint.

8. **Benchmark shootout:** For the Image Classifier, compare `ResNet-18`, `MobileNetV2`, and `EfficientNet-B0` on the same CIFAR-10 subset. Record accuracy, training time, and model size. Present results as a markdown table.

9. **Deploy one project:** Pick any of the 5 projects and deploy it publicly — use Streamlit Cloud (free tier) or Hugging Face Spaces. Share the URL and describe one thing you had to change to make it work in a cloud environment.

---

> 💡 **Encouragement:** Every expert you admire started exactly where you are right now — running code that didn't work, Googling error messages, and slowly building intuition from confusion. These five projects are your launchpad. Complete even one of them fully — with the extensions — and you will have learned more than most people do in months of passive reading. Build. Break. Fix. Repeat.

---

*Next chapter → **Chapter 37: Intermediate Projects** — recommendation engines, object detection, and fine-tuning language models.*
