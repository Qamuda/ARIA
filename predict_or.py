"""Live prediction engine for ARIA: infer context, classify user/pattern, generate suggestion."""

import os
from datetime import datetime

import joblib
import pandas as pd

from Functions_Saved.utils import infer_context


MODELS_DIR = "models"
_artifacts = {}

REQUIRED = {
    "user_rf":        "user_rf.pkl",
    "user_labels":    "user_labels.pkl",
    "pattern_rf":     "pattern_rf.pkl",
    "pattern_labels": "pattern_labels.pkl",
}

OPTIONAL = {
    "recommender_rf":       "recommender_rf.pkl",
    "recommender_features": "recommender_features.pkl",
}


def _load_artifacts():
    if _artifacts:
        return _artifacts

    for key, fname in REQUIRED.items():
        path = os.path.join(MODELS_DIR, fname)
        if not os.path.exists(path):
            raise FileNotFoundError(
                f"Missing model artifact: {path}. Run `py saving.py` first."
            )
        _artifacts[key] = joblib.load(path)

    for key, fname in OPTIONAL.items():
        path = os.path.join(MODELS_DIR, fname)
        _artifacts[key] = joblib.load(path) if os.path.exists(path) else None

    return _artifacts


CONTEXT_VERB = {
    "HOME":            "Wind down with something light",
    "WORK":            "Stay focused at the desk",
    "COMMUTE":         "Make the ride useful",
    "WORK_FROM_HOME":  "Hold your focus block",
    "MORNING_ROUTINE": "Set up the day deliberately",
    "NIGHT":           "Start winding down for sleep",
}

ARCHETYPE_NUDGE = {
    "Productivity Focused": "you already lean productive, so protect that",
    "Balanced User":        "you keep good balance, so a light touch is fine",
    "Social Media Heavy":   "less scrolling will compound fast for you",
    "Heavy Entertainment":  "schedule the fun, don't let it run the day",
}

LEVER_PHRASE = {
    "sleep_hours":         "sleep is your strongest productivity lever",
    "daily_exercise_mins": "exercise moves the needle most for you",
    "screen_time_hours":   "trimming screen time has the biggest payoff",
    "diet_quality_1_10":   "diet quality is your top driver",
    "stress_level_1_10":   "managing stress is the highest-impact change",
}


def _top_lever(art):
    """Return the recommender feature with the highest importance, or None."""
    rec = art.get("recommender_rf")
    feats = art.get("recommender_features")
    if rec is None or not feats:
        return None
    importances = list(zip(feats, rec.feature_importances_))
    importances.sort(key=lambda x: x[1], reverse=True)
    return importances[0][0]


def _predicted_score(art, lifestyle):
    """If lifestyle dict has all recommender features, return predicted productivity 1-10."""
    rec = art.get("recommender_rf")
    feats = art.get("recommender_features")
    if rec is None or not feats or not lifestyle:
        return None
    if not all(f in lifestyle for f in feats):
        return None
    row = pd.DataFrame([[lifestyle[f] for f in feats]], columns=feats)
    return float(rec.predict(row)[0])


def generate_suggestion(context, user_type, art=None, lifestyle=None):
    """Compose a model-driven suggestion from context + archetype + top-importance lever."""
    if art is None:
        art = _load_artifacts()

    verb    = CONTEXT_VERB.get(context, "Take the next sensible step")
    nudge   = ARCHETYPE_NUDGE.get(user_type, "stay aware of your habits")
    lever   = _top_lever(art)
    phrase  = LEVER_PHRASE.get(lever, "small consistent habits add up")

    score = _predicted_score(art, lifestyle)
    score_tag = f" (projected productivity: {score:.1f}/10)" if score is not None else ""

    return f"{verb} — {nudge}, and remember {phrase}.{score_tag}"


def predict(age, total_usage, screen_time, num_apps,
            social_hours, productivity_hours, gaming_hours,
            session_duration, battery_level,
            app_name="", is_moving=False, on_home_wifi=True,
            lifestyle=None):

    art = _load_artifacts()
    now = datetime.now()
    hour        = now.hour
    day_of_week = now.weekday()
    is_weekend  = 1 if day_of_week >= 5 else 0
    context     = infer_context(
        hour=hour, app_name=app_name,
        is_moving=is_moving, on_home_wifi=on_home_wifi,
        session_duration=session_duration,
    )

    user_features = pd.DataFrame([[age, total_usage, screen_time, num_apps,
                                   social_hours, productivity_hours, gaming_hours]],
        columns=["Age", "Total_App_Usage_Hours", "Daily_Screen_Time_Hours",
                 "Number_of_Apps_Used", "Social_Media_Usage_Hours",
                 "Productivity_App_Usage_Hours", "Gaming_App_Usage_Hours"])
    user_cluster = int(art["user_rf"].predict(user_features)[0])
    user_type    = art["user_labels"].get(user_cluster, "Balanced User")

    pattern_features = pd.DataFrame([[hour, day_of_week, is_weekend,
                                      session_duration, battery_level]],
        columns=["hour", "day_of_week", "is_weekend",
                 "session_duration_sec", "battery_level"])
    pattern_cluster = int(art["pattern_rf"].predict(pattern_features)[0])
    pattern_type    = art["pattern_labels"].get(pattern_cluster, "Unknown Pattern")

    return {
        "time":            now.strftime("%Y-%m-%d %H:%M:%S"),
        "context":         context,
        "user_type":       user_type,
        "pattern_type":    pattern_type,
        "suggestion":      generate_suggestion(context, user_type, art=art, lifestyle=lifestyle),
        "user_cluster":    user_cluster,
        "pattern_cluster": pattern_cluster,
    }


test_users = [
    dict(age=22, total_usage=4.5, screen_time=6.2, num_apps=18, social_hours=2.1, productivity_hours=1.3, gaming_hours=0.8, session_duration=420, battery_level=72, app_name="Instagram", is_moving=False, on_home_wifi=True),
    dict(age=35, total_usage=2.1, screen_time=3.5, num_apps=10, social_hours=0.5, productivity_hours=3.2, gaming_hours=0.2, session_duration=180, battery_level=45, app_name="Slack",     is_moving=False, on_home_wifi=False),
    dict(age=28, total_usage=7.8, screen_time=9.1, num_apps=30, social_hours=4.5, productivity_hours=0.5, gaming_hours=3.8, session_duration=900, battery_level=88, app_name="Spotify",   is_moving=True,  on_home_wifi=False),
    dict(age=42, total_usage=1.8, screen_time=2.2, num_apps=8,  social_hours=0.3, productivity_hours=4.1, gaming_hours=0.1, session_duration=120, battery_level=60, app_name="Spotify",   is_moving=True,  on_home_wifi=False),
]


def main():
    print("\nARIA -- Adaptive Routine Intelligence Agent")
    print("--------------------------------------------")
    for i, user in enumerate(test_users, 1):
        result = predict(**user)
        print(f"\nUser {i}")
        print(f"  Context:       {result['context']}")
        print(f"  User type:     {result['user_type']}")
        print(f"  Pattern type:  {result['pattern_type']}")
        print(f"  Suggests:      {result['suggestion']}")


if __name__ == "__main__":
    main()
