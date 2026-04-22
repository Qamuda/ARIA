from sklearn.cluster import MiniBatchKMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
import pandas as pd

from cleaner import get_clean_data

def cluster_users(df):
    # Select only numeric columns for clustering
    features = ["Age", "Total_App_Usage_Hours", "Daily_Screen_Time_Hours",
                 "Number_of_Apps_Used", "Social_Media_Usage_Hours",
                 "Productivity_App_Usage_Hours", "Gaming_App_Usage_Hours"]

    X = df[features]

    # Normalize the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train K-Means with 4 clusters
    kMinmeans = MiniBatchKMeans(n_clusters=4, random_state=42, n_init=10, batch_size=256)
    kMinmeans.fit(X_scaled)

    # Add cluster label back to dataframe
    df["cluster"] = kMinmeans.labels_

    # Print what each cluster looks like
    print("\n-- Cluster Profiles --------------------")
    print(df.groupby("cluster")[features].mean().round(2))

    # Train Random Forest on K-Means labels
    X = df[features]
    y = df["cluster"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_user = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_user.fit(X_train, y_train)

    print("\n-- User RF Classification Report --------")
    print(classification_report(y_test, rf_user.predict(X_test)))

    return df, kMinmeans, scaler, rf_user


def detect_patterns(df):
    # Focus on the columns ARIA needs for pattern detection
    features = ["hour", "day_of_week", "is_weekend",
                 "session_duration_sec", "battery_level"]

    # Convert battery_level to numeric — it came in as mixed type
    df["battery_level"] = pd.to_numeric(df["battery_level"], errors="coerce")
    df["session_duration_sec"] = pd.to_numeric(df["session_duration_sec"], errors="coerce")

    # between(1, 86400)` — drops anything under 1 second (corrupt/zero)
    # And anything over 86400 seconds (24 hours)
    df = df[(df["session_duration_sec"].between(1, 86400))]

    # Drop rows where these key features are still null
    df = df.dropna(subset=features)

    X = df[features]

    # Normalize
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train K-Means with 3 clusters — HOME, WORK, COMMUTE (Did a MiniBatch retrain)
    kMinmeans = MiniBatchKMeans(n_clusters=3, random_state=42, n_init=10, batch_size=256)
    kMinmeans.fit(X_scaled)

    df["pattern_cluster"] = kMinmeans.labels_

    # Show what each pattern cluster looks like
    print("\n-- Pattern Clusters --------------------")
    print(df.groupby("pattern_cluster")[features].mean().round(2))

    # Show context distribution per cluster
    print("\n-- Context per Cluster -----------------")
    print(df.groupby(["pattern_cluster", "context"]).size().unstack(fill_value=0))

    # Train Random Forest on pattern labels
    X = df[features]
    y = df["pattern_cluster"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_pattern = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_pattern.fit(X_train, y_train)

    print("\n-- Pattern RF Classification Report -----")
    print(classification_report(y_test, rf_pattern.predict(X_test)))

    return df, kMinmeans, scaler, rf_pattern

def main():
    print("Loading clean data...")
    data = get_clean_data()

    print("\nClustering user behavior profiles...")
    df_users, user_model, user_scaler, rf_user = cluster_users(data["user_behavior"])

    print("\nDetecting interaction patterns...")
    df_patterns, pattern_model, pattern_scaler, rf_pattern = detect_patterns(data["app_interaction"])

    print("\nARIA model training complete.")
    print(f"  User clusters:    {df_users['cluster'].nunique()}")
    print(f"  Pattern clusters: {df_patterns['pattern_cluster'].nunique()}")

if __name__ == "__main__":
    main()