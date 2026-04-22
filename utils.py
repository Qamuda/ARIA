def infer_context(hour, app_name="", is_moving=False, on_home_wifi=True, session_duration=0):
    work_apps = ["Gmail", "Slack", "Zoom", "Calendar", "Teams", "Outlook"]
    commute_apps = ["Maps", "Spotify", "Podcasts", "Waze"]

    if is_moving and hour in range(5, 10):
        return "COMMUTE"
    if is_moving and hour in range(15, 20):
        return "COMMUTE"
    if not on_home_wifi and app_name in work_apps and hour in range(8, 18):
        return "WORK"
    if on_home_wifi and app_name in work_apps and hour in range(8, 18):
        return "WORK_FROM_HOME"
    if app_name in commute_apps and is_moving:
        return "COMMUTE"
    if session_duration < 120 and hour in range(5, 9):
        return "MORNING_ROUTINE"
    if hour in range(22, 24) or hour in range(0, 5):
        return "NIGHT"
    return "HOME"