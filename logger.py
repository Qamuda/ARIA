import json
import uuid
from datetime import datetime

def log_event(app_name, action_type, duration_s, location_ctx):
    event = { "event_id": str(uuid.uuid4()),
              "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
              "app_name": app_name,
              "action_type": action_type,
              "duration_s": duration_s,
              "location_ctx": location_ctx,
              "day_of_week": datetime.now().weekday()
              }
    return event

def save_event(event, filename="aria_log.json"):
    try:
        with open(filename, "r") as f:
            data = json.load(f)

    except FileNotFoundError:
        data = []
        data.append(event)

    with open(filename, "w") as f:
        json.dump(data, f, indent=4)