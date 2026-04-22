import pandas as pd
import os
from utils import infer_context

def load_datasets():
    paths = {
        "user_behavior": r"C:\Users\Admin\.cache\kagglehub\datasets\bhadramohit\smartphone-usage-and-behavioral-dataset\versions\1",
        "app_interaction": r"C:\Users\Admin\.cache\kagglehub\datasets\mohamedmoslemani\user-mobile-app-interaction-data\versions\1",
        "screen_time": r"C:\Users\Admin\.cache\kagglehub\datasets\amirmotefaker\screentime-app-details-dataset\versions\1",
    }

    datasets = {}
    for label, path in paths.items():
        files = [f for f in os.listdir(path) if f.endswith(".csv")]
        if not files:
            print(f"No CSV found for {label}")
            continue
        df = pd.read_csv(os.path.join(path, files[0]))
        datasets[label] = df

    return datasets

def clean_user_behavior(df):
    # Encode gender to numeric
    df["Gender"] = df["Gender"].map({"Male": 0, "Female": 1})

    # Drop User_ID — meaningless to the model
    df = df.drop(columns=["User_ID"])

    # Drop Location — too broad for ARIA's use case
    df = df.drop(columns=["Location"])

    print(f"user_behavior cleaned: {df.shape}")
    return df

def clean_app_interaction(df):
    # Drop sensitive and irrelevant columns
    df = df.drop(columns=["ip_address", "phone_number", "app_version",
                           "screen_resolution", "device_model"])

    # Drop rows with missing timestamps — can't do time-series without them
    df = df.dropna(subset=["timestamp"])

    # Parse timestamp to datetime
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    # Extract time features ARIA needs
    df["hour"]        = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["is_weekend"]  = df["day_of_week"].apply(lambda x: 1 if x >= 5 else 0)

    # Infer context from hour — same logic as our schema
    df["session_duration_sec"] = pd.to_numeric(df["session_duration_sec"], errors="coerce").fillna(0)

    df["context"] = df.apply(
        lambda row: infer_context(
            hour=row["hour"],
            app_name=row.get("event_target", ""),
            is_moving=False,
            on_home_wifi=True,
            session_duration=row["session_duration_sec"]
        ), axis=1
    )

    # Fill remaining nulls with unknown
    # Fill numeric columns with 0, string columns with "unknown"
    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].fillna("unknown")
        else:
            df[col] = df[col].fillna(0)

    print(f"app_interaction cleaned: {df.shape}")
    return df

def clean_screen_time(df):
    # Parse date
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

    # Rename for consistency
    df = df.rename(columns={
        "Times opened": "times_opened",
        "App": "app_name",
        "Usage": "usage",
        "Notifications": "notifications"
    })

    print(f"screen_time cleaned: {df.shape}")
    return df

def get_clean_data():
    raw = load_datasets()

    cleaned = {
        "user_behavior":   clean_user_behavior(raw["user_behavior"].copy()),
        "app_interaction": clean_app_interaction(raw["app_interaction"].copy()),
        "screen_time":     clean_screen_time(raw["screen_time"].copy()),
    }

    return cleaned

if __name__ == "__main__":
    data = get_clean_data()
    print("\nAll datasets cleaned and ready.")
    for name, df in data.items():
        print(f"  {name}: {df.shape}")