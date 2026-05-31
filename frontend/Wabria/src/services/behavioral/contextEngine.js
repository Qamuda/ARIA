// JS mirror of utils.py infer_context. Runs entirely client-side.

const WORK_APPS = new Set([
  'slack','gmail','outlook','teams','zoom','calendar',
  'jira','notion','vscode','code','pycharm','intellij',
  'github','gitlab','excel','word','powerpoint','figma',
])

const COMMUTE_APPS = new Set([
  'maps','spotify','podcasts','waze','google maps','apple maps',
])

const COMMUTE_HOURS  = new Set([5,6,7,8,9,15,16,17,18,19])
const WORK_HOURS     = new Set([8,9,10,11,12,13,14,15,16,17])
const EARLY_MORNING  = new Set([5,6,7,8])
const NIGHT_HOURS    = new Set([22,23,0,1,2,3,4])

export function inferContext({ hour, appName = '', isMoving = false, onHomeWifi = true, sessionDuration = 0 }) {
  const app = (typeof appName === 'string' ? appName : '').trim().toLowerCase()

  if (isMoving && (COMMUTE_HOURS.has(hour) || COMMUTE_APPS.has(app) || !onHomeWifi)) {
    return 'COMMUTE'
  }
  if (WORK_HOURS.has(hour) && WORK_APPS.has(app)) {
    return onHomeWifi ? 'WORK_FROM_HOME' : 'WORK'
  }
  if (EARLY_MORNING.has(hour) && sessionDuration < 120 && onHomeWifi) {
    return 'MORNING_ROUTINE'
  }
  if (NIGHT_HOURS.has(hour)) {
    return 'NIGHT'
  }
  return 'HOME'
}

export function buildBehavioralContext({ archetype, pattern, context }) {
  return { cluster: archetype, temporalPattern: pattern, context }
}
