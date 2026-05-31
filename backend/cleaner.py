"""Data pipeline: load Kaggle CSVs and shape them for each model."""

import os
import pandas as pd
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from Functions_Saved.utils import infer_context



def load_datasets():
    paths = {
        "user_behavior":   r"C:\Users\Admin\.cache\kagglehub\datasets\bhadramohit\smartphone-usage-and-behavioral-dataset\versions\1",
        "app_interaction": r"C:\Users\Admin\.cache\kagglehub\datasets\mohamedmoslemani\user-mobile-app-interaction-data\versions\1",
        "screen_time":     r"C:\Users\Admin\.cache\kagglehub\datasets\amirmotefaker\screentime-app-details-dataset\versions\1",
    }

    datasets = {}
    for label, path in paths.items():
        if not os.path.isdir(path):
            print(f"[load_datasets] missing path for {label}: {path}")
            continue
        files = [f for f in os.listdir(path) if f.endswith(".csv")]
        if not files:
            print(f"[load_datasets] no CSV found for {label}")
            continue
        df = pd.read_csv(os.path.join(path, files[0]))
        datasets[label] = df

    return datasets


def clean_user_behavior(df):
    df["Gender"] = df["Gender"].map({"Male": 0, "Female": 1}).fillna(2).astype(int)
    drop_cols = [c for c in ("User_ID", "Location") if c in df.columns]
    df = df.drop(columns=drop_cols)
    print(f"user_behavior cleaned: {df.shape}")
    return df


def clean_app_interaction(df):
    sensitive = ["ip_address", "phone_number", "app_version",
                 "screen_resolution", "device_model"]
    df = df.drop(columns=[c for c in sensitive if c in df.columns])

    df = df.dropna(subset=["timestamp"])
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df = df.dropna(subset=["timestamp"])

    df["hour"]        = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["is_weekend"]  = (df["day_of_week"] >= 5).astype(int)

    df["session_duration_sec"] = pd.to_numeric(
        df["session_duration_sec"], errors="coerce"
    ).fillna(0)

    df["context"] = df.apply(
        lambda r: infer_context(
            hour=r["hour"],
            app_name=r.get("event_target", ""),
            is_moving=False,
            on_home_wifi=True,
            session_duration=r["session_duration_sec"],
        ),
        axis=1,
    )

    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].fillna("unknown")
        else:
            df[col] = df[col].fillna(0)

    print(f"app_interaction cleaned: {df.shape}")
    return df


def clean_screen_time(df):
    if "Date" in df.columns:
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

    df = df.rename(columns={
        "Times opened":  "times_opened",
        "App":           "app_name",
        "Usage":         "usage",
        "Notifications": "notifications",
    })

    print(f"screen_time cleaned: {df.shape}")
    return df


def get_clean_data():
    raw = load_datasets()

    cleaned = {}
    if "user_behavior" in raw:
        cleaned["user_behavior"] = clean_user_behavior(raw["user_behavior"].copy())
    if "app_interaction" in raw:
        cleaned["app_interaction"] = clean_app_interaction(raw["app_interaction"].copy())
    if "screen_time" in raw:
        cleaned["screen_time"] = clean_screen_time(raw["screen_time"].copy())

    return cleaned


if __name__ == "__main__":
    data = get_clean_data()
    print("\nAll datasets cleaned and ready.")
    for name, df in data.items():
        print(f"  {name}: {df.shape}")
