from datetime import date, timedelta

def calculate_streak(habit, logs: list) -> int:
    log_dates = {log.date for log in logs}
    streak = 0
    current_date = date.today() - timedelta(days=1)

    weekday_map = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    while True:
        weekday_key = weekday_map[current_date.weekday()]
        if habit.frequency.get(weekday_key):
            if current_date not in log_dates:
                break
            streak += 1
        current_date -= timedelta(days=1)

    if habit.frequency.get(weekday_map[date.today().weekday()]):
        if date.today() in log_dates:
            streak += 1
    
    return streak