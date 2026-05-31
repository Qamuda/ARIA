import pandas as pd
import os
import kagglehub

DATASETS = {
    "user_behavior": {
        "kaggle": "bhadramohit/smartphone-usage-and-behavioral-dataset",
        "purpose": "K-Means user behavior profiling",
    },
    "app_interaction": {
        "kaggle": "mohamedmoslemani/user-mobile-app-interaction-data",
        "purpose": "Time-series pattern detection",
    },
    "screen_time": {
        "kaggle": "amirmotefaker/screentime-app-details-dataset",
        "purpose": "Supplementary screen time context",
    },
    "time_management": {
        "kaggle": "hanaksoy/time-management-and-productivity-insights",
        "purpose": "Productivity score prediction from daily habits",
    },
    "wellbeing": {
        "kaggle": "ydalat/lifestyle-and-wellbeing-data",
        "purpose": "Work-life balance scoring from lifestyle factors",
    },
    "archetype_health": {
        "kaggle": "mohamedmoslemani/archetype-health-and-productivity-dataset",
        "purpose": "Health archetype and productivity correlation",
    },
    "mental_health": {
        "kaggle": "dewminimnaadi/mental-health-and-productivity-dataset",
        "purpose": "Mental health factors affecting productivity",
    },
}


def download(name):
    if name not in DATASETS:
        print(f"Unknown dataset: {name}")
        return None
    path = kagglehub.dataset_download(DATASETS[name]["kaggle"])
    DATASETS[name]["path"] = path
    print(f"Downloaded {name} -> {path}")
    return path


def download_all():
    for name in DATASETS:
        download(name)


def load(name):
    if name not in DATASETS:
        print(f"Unknown dataset: {name}")
        return None

    if "path" not in DATASETS[name]:
        download(name)

    path = DATASETS[name]["path"]
    files = [f for f in os.listdir(path) if f.endswith(".csv")]
    if not files:
        print(f"No CSV found for {name}")
        return None

    df = pd.read_csv(os.path.join(path, files[0]))
    return df


def load_all():
    result = {}
    for name in DATASETS:
        df = load(name)
        if df is not None:
            result[name] = df
    return result


def inspect(name):
    df = load(name)
    if df is None:
        return None
    print(f"\n-- {name} --")
    print(f"Purpose: {DATASETS[name]['purpose']}")
    print(f"Shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    print(f"Missing: {df.isnull().sum().sum()}")
    print(f"First 3 rows:\n{df.head(3)}")
    return df


def inspect_all():
    for name in DATASETS:
        inspect(name)


def add(name, kaggle_id, purpose=""):
    DATASETS[name] = {
        "kaggle": kaggle_id,
        "purpose": purpose,
    }
    print(f"Added {name}: {kaggle_id}")