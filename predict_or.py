import pandas as pd
import joblib
import numpy as np
from datetime import datetime
from utils import infer_context

user_rf        = joblib.load("models/user_rf.pkl")
user_scaler    = joblib.load("models/user_scaler.pkl")
pattern_rf     = joblib.load("models/pattern_rf.pkl")
pattern_scaler = joblib.load("models/pattern_scaler.pkl")

SUGGESTIONS = {
    "HOME": {
        "Productivity Focused":   "Review your task list for tomorrow",
        "Balanced User":          "Watch something on YouTube",
        "Social Media Heavy":     "Check your social media feeds",
        "Heavy Entertainment":    "Pick up where you left off gaming",
    },
    "WORK": {
        "Productivity Focused":   "Check your emails and pending tasks",
        "Balanced User":          "Take a short break — you've been active",
        "Social Media Heavy":     "Focus mode — close distracting apps",
        "Heavy Entertainment":    "Stay on task — save gaming for later",
    },
    "COMMUTE": {
        "Productivity Focused":   "Review today's calendar on the go",
        "Balanced User":          "Play your commute playlist",
        "Social Media Heavy":     "Catch up on your social feeds",
        "Heavy Entertainment":    "Pick a podcast or playlist for the ride",
    },
    "WORK_FROM_HOME": {
        "Productivity Focused":   "Stay focused — block distracting apps",
        "Balanced User":          "Take a break, you've been at it a while",
        "Social Media Heavy":     "Focus mode — social media can wait",
        "Heavy Entertainment":    "Save the games for after work",
    },
    "MORNING_ROUTINE": {
        "Productivity Focused":   "Check your priorities for today",
        "Balanced User":          "Good morning — review your calendar",
        "Social Media Heavy":     "Quick check before the day starts",
        "Heavy Entertainment":    "Morning briefing before the fun",
    },
    "NIGHT": {
        "Productivity Focused":   "Wind down — set tomorrow's priorities",
        "Balanced User":          "Time to rest — put the phone down",
        "Social Media Heavy":     "Last scroll of the night",
        "Heavy Entertainment":    "One more level then sleep",
    },
}

PATTERN_LABELS = {
    0: "Weekend User",
    1: "Evening Weekday User",
    2: "Early Morning User",
}

USER_LABELS = {
    0: "Productivity Focused",
    1: "Balanced User",
    2: "Social Media Heavy",
    3: "Heavy Entertainment",
}


def predict(age, total_usage, screen_time, num_apps,
            social_hours, productivity_hours, gaming_hours,
            session_duration, battery_level,
            app_name="", is_moving=False, on_home_wifi=True):

    now         = datetime.now()
    hour        = now.hour
    day_of_week = now.weekday()
    is_weekend  = 1 if day_of_week >= 5 else 0
    context     = infer_context(
        hour=hour,
        app_name=app_name,
        is_moving=is_moving,
        on_home_wifi=on_home_wifi,
        session_duration=session_duration,
    )

    # RF predicts directly on raw unscaled features
    user_features = pd.DataFrame([[age, total_usage, screen_time, num_apps,
                                   social_hours, productivity_hours, gaming_hours]],
                                 columns=["Age", "Total_App_Usage_Hours", "Daily_Screen_Time_Hours",
                                          "Number_of_Apps_Used", "Social_Media_Usage_Hours",
                                          "Productivity_App_Usage_Hours", "Gaming_App_Usage_Hours"])
    user_cluster = user_rf.predict(user_features)[0]

    pattern_features = pd.DataFrame([[hour, day_of_week, is_weekend,
                                      session_duration, battery_level]],
                                    columns=["hour", "day_of_week", "is_weekend",
                                             "session_duration_sec", "battery_level"])
    pattern_cluster = pattern_rf.predict(pattern_features)[0]

    suggestion = SUGGESTIONS[context][USER_LABELS[user_cluster]]

    return {
        "time":            now.strftime("%Y-%m-%d %H:%M:%S"),
        "context":         context,
        "user_type":       USER_LABELS[user_cluster],
        "pattern_type":    PATTERN_LABELS[pattern_cluster],
        "suggestion":      suggestion,
        "user_cluster":    int(user_cluster),
        "pattern_cluster": int(pattern_cluster),
    }


test_users = [
    dict(age=22, total_usage=4.5, screen_time=6.2, num_apps=18, social_hours=2.1, productivity_hours=1.3, gaming_hours=0.8, session_duration=420, battery_level=72, app_name="Instagram", is_moving=False, on_home_wifi=True),
    dict(age=35, total_usage=2.1, screen_time=3.5, num_apps=10, social_hours=0.5, productivity_hours=3.2, gaming_hours=0.2, session_duration=180, battery_level=45, app_name="Slack", is_moving=False, on_home_wifi=False),
    dict(age=28, total_usage=7.8, screen_time=9.1, num_apps=30, social_hours=4.5, productivity_hours=0.5, gaming_hours=3.8, session_duration=900, battery_level=88, app_name="Spotify", is_moving=True, on_home_wifi=False),
    dict(age=42, total_usage=1.8, screen_time=2.2, num_apps=8, social_hours=0.3, productivity_hours=4.1, gaming_hours=0.1, session_duration=120, battery_level=60, app_name="Gmail", is_moving=False, on_home_wifi=False),
]


def main():
    print("\nARIA -- Adaptive Routine Intelligence Agent")
    print("--------------------------------------------")

    for i, user in enumerate(test_users):
        result = predict(**user)
        print(f"\nUser {i + 1}")
        print(f"  Context:       {result['context']}")
        print(f"  User type:     {result['user_type']}")
        print(f"  Pattern type:  {result['pattern_type']}")
        print(f"  Suggests:      {result['suggestion']}")


if __name__ == "__main__":
    main()