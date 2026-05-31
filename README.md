<!-- PROJECT HEADER -->
<div align="center">
  <h1>🧠 A.R.I.A</h1>
  <h3>Adaptive Routine Intelligence Assistant</h3>
  <p><em>Privacy-first behavioral intelligence built for life on-device.</em></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/status-experimental-yellow" alt="Project Status: Experimental">
    <img src="https://img.shields.io/badge/python-3.10%2B-blue" alt="Python 3.10+">
    <img src="https://img.shields.io/badge/ML-scikit--learn-orange" alt="scikit-learn">
    <img src="https://img.shields.io/badge/frontend-React-61DAFB" alt="React">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT">
  </p>
</div>

---

## 📖 Overview

ARIA is an experimental, **local-first AI system** designed to:

- Learn behavioral patterns over time
- Infer user context (HOME, WORK, COMMUTE, etc.)
- Deliver proactive recommendations
- Operate entirely without cloud infrastructure

Unlike traditional assistants that wait for commands, ARIA understands **routines**: when users are productive, how behavioral cycles shift, and what contexts emerge throughout the day—all while keeping intelligence on-device.

---

## ✨ Core Concepts

- 🧠 **Behavioral Pattern Learning**
- 📊 **Context Inference**
- 🔒 **Privacy-First Local Intelligence**
- ⚡ **Lightweight On-Device ML**
- 🔄 **Incremental Adaptive Learning**
- 📝 **Idea & Routine Capture**
- 🤖 **LLM-Powered Conversational Layer** *(planned)*

---

## 🧩 System Architecture
User Activity
↓
Behavior Logging
↓
Cleaning & Feature Engineering
↓
Behavioral Clustering
↓
Context Inference
↓
Recommendation Engine
↓
LLM / UI Layer

text

---

## 🛠 Tech Stack

### Machine Learning
| Library / Tool      | Purpose                               |
|---------------------|---------------------------------------|
| `scikit-learn`      | Clustering & classification           |
| `MiniBatchKMeans`   | User & interaction pattern clustering |
| `Random Forest`     | Behavior prediction                   |
| `pandas`, `numpy`   | Data wrangling & feature engineering  |

### Planned Intelligence Expansion
| Component           | Role                                 |
|---------------------|--------------------------------------|
| `River`             | Online incremental learning          |
| `TensorFlow Lite`   | Mobile-optimized inference           |
| `SQLite`            | On-device behavioral persistence     |

### Frontend
| Technology          | Notes                        |
|---------------------|------------------------------|
| `React`             | Current web dashboard        |
| `React Native`      | Planned mobile application   |

---

## 📂 Project 
ARIA/
├── backend/   # ML + API logic
|    ├──logger.py → behavioral event logging
|    ├──cleaner.py → preprocessing pipeline
|    ├──model.py → clustering + classification
|    ├──predictor.py → live prediction engine
|    ├──saver.py → model persistence
|    ├──utils.py → context inference utilities
|
├── frontend/  # React UI
├── docs/      # reports and documentation


text

---

## 📈 Current Capabilities

<details>
<summary><strong>Expand details</strong></summary>

<br>

### 🎯 Behavioral Profiles (Unsupervised Clustering)
- Productivity Focused
- Balanced User
- Social Media Heavy
- Heavy Entertainment

### 🌍 Context Inference
ARIA infers one of six contextual states based on time, day, and usage signals:

| Context         | Description                      |
|-----------------|----------------------------------|
| HOME            | Evening relaxation, low activity |
| WORK            | High productivity, weekday daytime |
| COMMUTE         | Transitional periods             |
| WORK FROM HOME  | Mixed signals, remote pattern    |
| MORNING ROUTINE | Early-day startup                |
| NIGHT           | Late-night inactivity            |

</details>

---

## 🔬 Training Data

ARIA was trained on:

- Smartphone usage datasets
- App interaction behavior data
- Screen-time datasets
- Lifestyle behavior patterns

**Combined dataset size:** `100,000+ behavioral records`

---

## 🚧 Roadmap

### ✅ Phase 1 — Intelligence Foundation *(Completed)*
- [x] Behavioral clustering
- [x] Context inference
- [x] Random Forest classification
- [x] Recommendation system foundation

### 🚧 Phase 2 — Adaptive Infrastructure *(In Progress)*
- [ ] SQLite migration
- [ ] Rolling behavioral windows
- [ ] River online learning integration
- [ ] Dynamic recommendation generation

### 🔮 Phase 3 — Mobile Intelligence *(Planned)*
- [ ] TensorFlow Lite deployment
- [ ] React Native app
- [ ] On-device inference engine
- [ ] Local-first assistant interface

---

## 🌌 Long-Term Vision

ARIA explores what personal intelligence systems look like **when the user owns both the data and the intelligence itself**.

The long-term goal is to build:

- Adaptive, local AI
- Routine-aware systems
- Proactive assistance
- Privacy-preserving intelligence that evolves with the individual over time

---

## 📌 Status & Attribution

**Status:** 🟡 Experimental / Active Research

This project was originally developed as the **LimitsCo Project** by **Qowiyu O. Amuda**.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).  
Feel free to fork, adapt, and build upon it—on-device intelligence belongs to everyone.