# Chapter 18: Evaluation & Accuracy

> *"An approximate answer to the right problem is worth a good deal more than an exact answer to an approximate problem."* — John Tukey

---

## 🎯 CONCEPT

**Model evaluation** is how we measure whether a machine learning model is actually good. Training a model is only half the battle — you need to rigorously test it to know if it will work in the real world.

Here's the surprising truth: **accuracy alone is often misleading.** If 99% of emails are not spam, a model that always predicts "not spam" has 99% accuracy — but it's completely useless as a spam filter. It never catches a single spam email!

That's why we need multiple evaluation metrics, each telling us something different about model performance.

```
┌──────────────────────────────────────────────────────────────┐
│           WHY ACCURACY ISN'T ENOUGH                          │
│                                                              │
│   Dataset: 1,000 patients, 10 have a rare disease            │
│                                                              │
│   Model A: Always predicts "No Disease"                      │
│   Accuracy: 990/1000 = 99% ← Sounds great!                  │
│   But: Misses ALL 10 sick patients! ← Terrible!             │
│                                                              │
│   Model B: Correctly identifies 8 of 10 sick patients        │
│   Accuracy: 985/1000 = 98.5% ← Lower accuracy...            │
│   But: Catches 80% of sick patients! ← Much better!         │
│                                                              │
│   Accuracy alone can be DANGEROUS for imbalanced data.       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧑‍🏫 TEACH (Feynman Style)

### The Confusion Matrix — A Report Card for Your Model

**The Analogy: The Fire Alarm**

A fire alarm can make four types of decisions:

1. **True Positive (TP):** There IS a fire, and the alarm RINGS. ✅ (Correct alert)
2. **True Negative (TN):** There is NO fire, and the alarm stays SILENT. ✅ (Correct silence)
3. **False Positive (FP):** There is NO fire, but the alarm RINGS anyway. ❌ (False alarm — annoying!)
4. **False Negative (FN):** There IS a fire, but the alarm stays SILENT. ❌ (Missed fire — dangerous!)

```
   THE CONFUSION MATRIX
                              Predicted
                        Positive    Negative
                      ┌───────────┬───────────┐
   Actual   Positive  │    TP     │    FN     │
                      │  (Hit!)   │ (Missed!) │
                      ├───────────┼───────────┤
            Negative  │    FP     │    TN     │
                      │ (False    │(Correctly │
                      │  alarm!)  │ rejected) │
                      └───────────┴───────────┘

   Example: Spam Detection on 1,000 emails
   (100 actual spam, 900 actual not-spam)

                         Predicted
                      Spam      Not Spam
                   ┌─────────┬───────────┐
   Actual  Spam    │  85 TP  │  15 FN    │
                   ├─────────┼───────────┤
           Not     │  20 FP  │  880 TN   │
           Spam    │         │           │
                   └─────────┴───────────┘

   TP = 85:  Correctly caught 85 spam emails
   TN = 880: Correctly let through 880 good emails
   FP = 20:  Falsely marked 20 good emails as spam
   FN = 15:  Missed 15 spam emails
```

### Precision vs. Recall — The Doctor Analogy

**Precision** and **Recall** answer two different questions:

- **Precision:** "Of all the things the model flagged as positive, how many were actually positive?"
- **Recall:** "Of all the actual positives, how many did the model catch?"

**The Analogy: Two Different Doctors**

**Dr. Precision** is extremely cautious. She only diagnoses a disease when she's absolutely certain. She rarely gives false alarms, but sometimes she misses sick patients.

**Dr. Recall** wants to catch every possible case. He flags anyone with even minor symptoms. He catches almost every sick patient, but he also sends many healthy people for unnecessary tests.

```
   Precision vs. Recall:

   Precision = TP / (TP + FP)
   "Of everything I flagged, what fraction was correct?"
   
   Using our spam example: 85 / (85 + 20) = 85/105 = 81%
   "81% of emails I called spam were actually spam"


   Recall = TP / (TP + FN)
   "Of all actual positives, what fraction did I catch?"
   
   Using our spam example: 85 / (85 + 15) = 85/100 = 85%
   "I caught 85% of all spam emails"
```

**When Precision Matters More:**
- **Spam filter:** A false positive means a real email goes to spam — your boss's email disappears! High precision avoids this.
- **Criminal justice:** Convicting an innocent person (FP) is devastating. You want high precision.

**When Recall Matters More:**
- **Cancer screening:** Missing a cancer patient (FN) could be fatal. You'd rather have false alarms than miss real cases. High recall saves lives.
- **Fraud detection:** Missing a fraudulent transaction (FN) costs real money. Catch them all!

```
   The Precision-Recall Tradeoff:

   Precision
   High │  ╲
        │   ╲
        │    ╲
        │     ╲
        │      ╲
   Low  │       ╲
        └────────────────
        Low            High
              Recall

   As you increase recall (catch more positives),
   precision tends to decrease (more false alarms).
   You can't maximize both — you must choose a balance.
```

### F1 Score: The Balanced Metric

The **F1 Score** combines precision and recall into a single number. It's the harmonic mean — it penalizes extreme imbalances.

```
   F1 Score = 2 × (Precision × Recall) / (Precision + Recall)

   Example:
   Precision = 81%, Recall = 85%
   F1 = 2 × (0.81 × 0.85) / (0.81 + 0.85)
   F1 = 2 × 0.689 / 1.66
   F1 = 0.83 (or 83%)

   Why harmonic mean?
   ┌────────────────────────────────────────┐
   │ Precision = 95%, Recall = 10%          │
   │ Regular average = 52.5% (seems okay?)  │
   │ F1 Score = 18%  (reveals the problem!) │
   └────────────────────────────────────────┘
   
   F1 punishes models that are great at one thing
   but terrible at the other.
```

### ROC Curves and AUC — The Dial Analogy

**The Analogy: A Volume Dial**

Imagine your spam filter has a sensitivity dial. Turn it up, and it catches more spam (higher recall) but also flags more good emails (lower precision). Turn it down, and it's more conservative.

The **ROC curve** shows what happens at every possible dial position. The **AUC** (Area Under the Curve) summarizes overall performance in one number.

```
   ROC Curve:

   True Positive
   Rate (Recall)
   1.0 │         ___────────
       │      ╱──
       │    ╱        ← Good model (AUC = 0.90)
   0.5 │  ╱  ╱
       │ ╱ ╱  ← Random guessing (AUC = 0.50)
       │╱╱
   0.0 │─────────────────────
       0.0        0.5       1.0
          False Positive Rate

   AUC = 1.0  → Perfect model
   AUC = 0.5  → Random guessing (useless)
   AUC < 0.5  → Worse than random (something's wrong)
```

### Cross-Validation: Testing Properly

What if your single train/test split happens to be lucky (or unlucky)? **Cross-validation** solves this by testing multiple times with different splits.

**K-Fold Cross-Validation (K=5):**

```
   5-Fold Cross-Validation:

   Fold 1: [TEST] [Train] [Train] [Train] [Train]  → Score: 85%
   Fold 2: [Train] [TEST] [Train] [Train] [Train]  → Score: 87%
   Fold 3: [Train] [Train] [TEST] [Train] [Train]  → Score: 83%
   Fold 4: [Train] [Train] [Train] [TEST] [Train]  → Score: 86%
   Fold 5: [Train] [Train] [Train] [Train] [TEST]  → Score: 84%

   Final Score: Average = 85% (± 1.4%)

   Every data point gets to be in the test set exactly once!
   This gives a much more reliable estimate of performance.
```

### Regression Metrics

For regression problems (predicting numbers), we use different metrics:

```
   Common Regression Metrics:

   ┌──────────────────────────────────────────────────────────┐
   │ MSE (Mean Squared Error)                                 │
   │ Average of (prediction - actual)²                        │
   │ Penalizes large errors heavily                           │
   │ Formula: (1/n) × Σ(predicted - actual)²                 │
   │                                                          │
   │ Example: predictions [105, 200, 310]                     │
   │          actuals     [100, 210, 300]                     │
   │ MSE = [(105-100)² + (200-210)² + (310-300)²] / 3        │
   │     = [25 + 100 + 100] / 3 = 75                         │
   ├──────────────────────────────────────────────────────────┤
   │ RMSE (Root Mean Squared Error)                           │
   │ Square root of MSE — same units as the target            │
   │ RMSE = sqrt(75) = 8.66                                   │
   │ "On average, predictions are off by about $8.66"         │
   ├──────────────────────────────────────────────────────────┤
   │ R² (R-Squared)                                           │
   │ How much of the variation your model explains            │
   │ R² = 1.0 → Perfect predictions                          │
   │ R² = 0.0 → No better than predicting the average        │
   │ R² < 0.0 → Worse than predicting the average            │
   │ "R² = 0.85 means the model explains 85% of the          │
   │  variation in the data"                                  │
   └──────────────────────────────────────────────────────────┘
```

---

## 🔬 DEEP UNDERSTANDING

### Choosing the Right Metric for Your Problem

```
┌─────────────────────┬───────────────────────┬──────────────────┐
│ Problem             │ Priority              │ Best Metric      │
├─────────────────────┼───────────────────────┼──────────────────┤
│ Cancer detection    │ Don't miss any cases  │ Recall           │
│                     │ (FN is dangerous)     │                  │
├─────────────────────┼───────────────────────┼──────────────────┤
│ Spam filtering      │ Don't lose good email │ Precision        │
│                     │ (FP is annoying)      │                  │
├─────────────────────┼───────────────────────┼──────────────────┤
│ Fraud detection     │ Catch most fraud,     │ F1 Score or      │
│                     │ minimize false alerts  │ Recall           │
├─────────────────────┼───────────────────────┼──────────────────┤
│ Search engine       │ Top results relevant  │ Precision@K      │
│                     │                       │                  │
├─────────────────────┼───────────────────────┼──────────────────┤
│ House price         │ Minimize prediction   │ RMSE or R²       │
│ prediction          │ error in dollars      │                  │
├─────────────────────┼───────────────────────┼──────────────────┤
│ Balanced classes,   │ Overall performance   │ Accuracy or F1   │
│ general task        │                       │                  │
├─────────────────────┼───────────────────────┼──────────────────┤
│ Comparing models    │ Rank models overall   │ AUC-ROC          │
│ across thresholds   │                       │                  │
└─────────────────────┴───────────────────────┴──────────────────┘
```

### Real-World Example: Medical Testing

Let's walk through a complete evaluation for a COVID test model:

```
   Test Results for 10,000 people:
   - 500 actually have COVID
   - 9,500 do not have COVID

   Model Results:
                        Predicted
                     Positive  Negative
                   ┌─────────┬──────────┐
   Actual Positive │ 450 TP  │  50 FN   │
                   ├─────────┼──────────┤
   Actual Negative │ 200 FP  │ 9300 TN  │
                   └─────────┴──────────┘

   Accuracy  = (450 + 9300) / 10000 = 97.5%
   Precision = 450 / (450 + 200) = 69.2%
   Recall    = 450 / (450 + 50)  = 90.0%
   F1 Score  = 2 × (0.692 × 0.90) / (0.692 + 0.90) = 78.3%
```

**Interpretation:**
- **97.5% accuracy** sounds great, but...
- **69.2% precision** means 30.8% of positive results are false alarms — almost 1 in 3 people told they have COVID don't actually have it.
- **90% recall** means we catch 90% of actual COVID cases — but 10% (50 people) are missed.
- For a medical test, we might want recall above 95%. We'd adjust the threshold to catch more cases, accepting more false positives.

### Model Comparison Strategies

When comparing multiple models, follow this process:

```
   Model Comparison Workflow:

   ┌─────────────┐
   │ Train 3+    │
   │ different    │
   │ models       │
   └──────┬──────┘
          ▼
   ┌─────────────┐
   │ Evaluate    │
   │ each with   │
   │ cross-      │
   │ validation  │
   └──────┬──────┘
          ▼
   ┌─────────────────────────────────────────┐
   │ Compare on the metric that matters most │
   │                                         │
   │ Model A: F1 = 0.82 (± 0.03)            │
   │ Model B: F1 = 0.87 (± 0.02)  ← Best!  │
   │ Model C: F1 = 0.79 (± 0.05)            │
   └──────────────────┬──────────────────────┘
                      ▼
   ┌─────────────────────────────────────────┐
   │ Final evaluation on held-out test set   │
   │ Model B Test F1 = 0.85  ← Report this  │
   └─────────────────────────────────────────┘
```

**Tips for fair comparison:**
- Use the same data splits for all models
- Use cross-validation, not a single split
- Consider training time and complexity, not just accuracy
- Check performance across different subgroups (does the model work equally well for everyone?)

### Common Pitfalls in Evaluation

**1. Data Leakage:** Test data accidentally influences training. For example, normalizing all data before splitting means test statistics leak into training.

**2. Class Imbalance Blindness:** Using accuracy when one class is 99% of the data. Use F1, precision/recall, or AUC instead.

**3. Overfitting to the Validation Set:** If you tune hyperparameters extensively on the validation set, your model may overfit to it. That's why the test set must stay untouched.

**4. Ignoring Confidence Intervals:** An F1 of 85% ± 5% and 83% ± 2% might mean the second model is more reliable, even though its point estimate is lower.

---

## 📝 REVIEW

Test your understanding:

1. **In your own words**, why isn't accuracy always a good metric?
2. Draw a confusion matrix and label TP, TN, FP, and FN.
3. Explain precision vs. recall using the doctor analogy.
4. When would you prioritize recall over precision? Give an example.
5. What is the F1 score, and why is it better than averaging precision and recall?
6. What does an AUC of 0.5 mean? What about 0.95?
7. How does 5-fold cross-validation work? Why is it better than a single train/test split?
8. What's the difference between MSE, RMSE, and R²?
9. **Explain to a 5-year-old**: How do we know if a computer's guesses are good?

### Think About It
- A cancer detection model has 99% precision but 40% recall. Is this acceptable? Why or why not?
- Why should the test set only be used once?
- You're building a self-driving car AI. Which metrics matter most and why?

---

## ✨ SIMPLIFY

**One-line explanation:**
> Evaluation metrics tell you HOW your model is wrong, not just whether it's right — because different mistakes have different consequences.

**Ultra-simple version:**
> Accuracy says "how often right." Precision says "how trustworthy." Recall says "how thorough." You need all three to know the full story.

---

## 🏋️ PRACTICE

### Exercise 1: Compute the Metrics
Given this confusion matrix for an email spam detector:

```
                  Predicted
               Spam    Not Spam
            ┌────────┬──────────┐
Actual Spam │   70   │    30    │
            ├────────┼──────────┤
Actual Ham  │   10   │   890    │
            └────────┴──────────┘
```

Calculate: Accuracy, Precision, Recall, and F1 Score.

### Exercise 2: Choose the Metric
For each scenario, which metric would you prioritize and why?

1. A model that detects defective products on a factory line
2. A model that recommends movies to users
3. A model that approves or denies bank loans
4. A model that detects rare diseases in blood tests
5. A model that predicts house prices

### Exercise 3: Cross-Validation by Hand
You have 10 data points. Show how you'd split them for 5-fold cross-validation. Write out which points are in the training set and test set for each fold.

### Exercise 4: Evaluate the Models
Three models are evaluated on the same dataset:

| Model | Accuracy | Precision | Recall | F1 |
|-------|----------|-----------|--------|----|
| A | 95% | 90% | 60% | 72% |
| B | 92% | 75% | 85% | 80% |
| C | 90% | 80% | 80% | 80% |

Which model would you choose for: (a) fraud detection, (b) spam filtering, (c) a general-purpose classifier? Explain your reasoning.

### Mini Project: Human Confusion Matrix
Play a guessing game with a friend. One person picks 20 cards — some red, some black — and hides them. The other person guesses each card's color. After all 20 guesses, build the confusion matrix. Calculate precision and recall for "Red" predictions. Was the guesser better at catching red cards (recall) or at being correct when they said red (precision)?

---

**Next Chapter:** [Part 5 — Deep Learning →](../part5-deep-learning/)
