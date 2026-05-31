// Mirrors the cluster labels produced by model.py / saving.py

export const USER_ARCHETYPES = {
  'Productivity Focused':    { color: 'blue',  description: 'Goal-driven, structured sessions' },
  'Social Media Heavy':      { color: 'pink',  description: 'High social platform engagement' },
  'Heavy Entertainment':     { color: 'pink',  description: 'Extended media consumption patterns' },
  'Balanced User':           { color: 'green', description: 'Even distribution across app categories' },
}

export const TEMPORAL_PATTERNS = {
  'Early Morning User':      { color: 'blue',  description: 'Peak activity before 10:00' },
  'Evening Weekday User':    { color: 'green', description: 'Peak activity after 17:00 on weekdays' },
  'Weekend User':            { color: 'pink',  description: 'Concentrated weekend sessions' },
}

export const CONTEXTS = {
  HOME:            { color: 'green', label: 'Home' },
  WORK:            { color: 'blue',  label: 'Work' },
  COMMUTE:         { color: 'pink',  label: 'Commute' },
  WORK_FROM_HOME:  { color: 'blue',  label: 'Work from Home' },
  MORNING_ROUTINE: { color: 'green', label: 'Morning Routine' },
  NIGHT:           { color: 'pink',  label: 'Night' },
}

export function getArchetypeColor(archetype) {
  return USER_ARCHETYPES[archetype]?.color ?? 'blue'
}

export function getPatternColor(pattern) {
  return TEMPORAL_PATTERNS[pattern]?.color ?? 'green'
}

export function getContextColor(context) {
  return CONTEXTS[context]?.color ?? 'blue'
}
