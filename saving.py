import joblib
import os

from model import cluster_users, detect_patterns
from cleaner import get_clean_data

def save_models(output_dir="models"):
    # Create models folder if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Load and clean data
    print("Loading data...")
    data = get_clean_data()

    # Train and save user behavior model
    print("Training user behavior model...")
    df_users, user_kmeans, user_scaler, rf_user = cluster_users(data["user_behavior"])
    joblib.dump(user_kmeans, os.path.join(output_dir, "user_kmeans.pkl"))
    joblib.dump(user_scaler, os.path.join(output_dir, "user_scaler.pkl"))
    joblib.dump(rf_user, os.path.join(output_dir, "user_rf.pkl"))
    print("Saved user_kmeans.pkl, user_scaler.pkl, user_rf.pkl")

    # Train and save interaction pattern model
    print("Training interaction pattern model...")
    df_patterns, pattern_kmeans, pattern_scaler, rf_pattern = detect_patterns(data["app_interaction"])
    joblib.dump(pattern_kmeans, os.path.join(output_dir, "pattern_kmeans.pkl"))
    joblib.dump(pattern_scaler, os.path.join(output_dir, "pattern_scaler.pkl"))
    joblib.dump(rf_pattern, os.path.join(output_dir, "pattern_rf.pkl"))
    print("Saved pattern_kmeans.pkl, pattern_scaler.pkl, pattern_rf.pkl")

    print(f"\nAll models saved to /{output_dir}")

if __name__ == "__main__":
    save_models()