# ARIA — Adaptive Routine Intelligence Assistant.txt

On-device personal assistant that learns individual behavioral patterns
and delivers proactive, context-aware suggestions without cloud dependency.

## Stack
- Python 3.11
- scikit-learn (MiniBatchKMeans, Random Forest)
- pandas, numpy
- React Native (upcoming)

## Project Structure
- `logger.py` — behavioral event logging
- `cleaner.py` — data pipeline
- `model.py` — K-Means + Random Forest training
- `saver.py` — model persistence
- `predictor.py` — live prediction engine
- `utils.py` — shared utilities

## CS499 Senior Seminar — Qowiyu Amuda
