import { useState } from 'react'
import Card from '../components/Card'
import PillBadge from '../components/PillBadge'
import { useARIA } from '../hooks/useARIA'
import {
  USER_ARCHETYPES,
  TEMPORAL_PATTERNS,
  CONTEXTS,
  getArchetypeColor,
  getPatternColor,
  getContextColor,
} from '../services/behavioral/profileMapper'
import styles from './Dashboard.module.css'

const ARCHETYPE_OPTIONS  = Object.keys(USER_ARCHETYPES)
const PATTERN_OPTIONS    = Object.keys(TEMPORAL_PATTERNS)

export default function Dashboard() {
  const { profile, context, behavioralContext, updateProfile } = useARIA()
  const contextMeta   = CONTEXTS[context]   ?? CONTEXTS['HOME']
  const archetypeMeta = USER_ARCHETYPES[profile.archetype]
  const patternMeta   = TEMPORAL_PATTERNS[profile.pattern]

  const [hour, setHour] = useState(new Date().getHours())

  function handleHourChange(e) {
    const h = Number(e.target.value)
    setHour(h)
    updateProfile({ hour: h })
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Your behavioral profile and live context state</p>
        </div>
        <PillBadge label={`Context: ${contextMeta.label}`} color={contextMeta.color} />
      </div>

      <div className={styles.grid}>
        {/* Active profile */}
        <Card title="User Archetype" subtitle="Behavioral cluster from ML pipeline" accent={getArchetypeColor(profile.archetype)}>
          <div className={styles.profileBlock}>
            <div className={styles.profileMain}>
              <span className={styles.profileLabel}>{profile.archetype}</span>
              <p className={styles.profileDesc}>{archetypeMeta?.description}</p>
            </div>
            <select
              className={styles.select}
              value={profile.archetype}
              onChange={e => updateProfile({ archetype: e.target.value })}
              aria-label="Select user archetype"
            >
              {ARCHETYPE_OPTIONS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Temporal pattern */}
        <Card title="Temporal Pattern" subtitle="Interaction rhythm over time" accent={getPatternColor(profile.pattern)}>
          <div className={styles.profileBlock}>
            <div className={styles.profileMain}>
              <span className={styles.profileLabel}>{profile.pattern}</span>
              <p className={styles.profileDesc}>{patternMeta?.description}</p>
            </div>
            <select
              className={styles.select}
              value={profile.pattern}
              onChange={e => updateProfile({ pattern: e.target.value })}
              aria-label="Select temporal pattern"
            >
              {PATTERN_OPTIONS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Live context */}
        <Card title="Live Context" subtitle="Inferred from current signals" accent={getContextColor(context)}>
          <div className={styles.contextBlock}>
            <span className={styles.contextValue}>{contextMeta.label}</span>
            <div className={styles.signalRow}>
              <label className={styles.signalLabel}>
                Hour
                <input
                  type="range" min={0} max={23} value={hour}
                  onChange={handleHourChange}
                  className={styles.slider}
                  aria-label="Simulate hour of day"
                />
                <span className={styles.signalVal}>{String(hour).padStart(2,'0')}:00</span>
              </label>
              <label className={styles.signalLabel}>
                On Home Wi-Fi
                <input
                  type="checkbox"
                  checked={profile.onHomeWifi}
                  onChange={e => updateProfile({ onHomeWifi: e.target.checked })}
                  aria-label="Toggle home wifi"
                />
              </label>
              <label className={styles.signalLabel}>
                Moving
                <input
                  type="checkbox"
                  checked={profile.isMoving}
                  onChange={e => updateProfile({ isMoving: e.target.checked })}
                  aria-label="Toggle movement"
                />
              </label>
            </div>
          </div>
        </Card>

        {/* Behavioral context object */}
        <Card title="Behavioral Context Object" subtitle="Injected into ARIA's prompt layer" accent="blue">
          <pre className={styles.codeBlock}>
            {JSON.stringify(behavioralContext, null, 2)}
          </pre>
        </Card>

        {/* All archetypes */}
        <Card title="All Archetypes" subtitle="4 behavioral clusters" className={styles.fullWidth}>
          <div className={styles.tagGrid}>
            {ARCHETYPE_OPTIONS.map(a => (
              <div key={a} className={`${styles.tagRow} ${a === profile.archetype ? styles.tagActive : ''}`}>
                <PillBadge label={USER_ARCHETYPES[a].color} color={USER_ARCHETYPES[a].color} />
                <span className={styles.tagName}>{a}</span>
                <span className={styles.tagDesc}>{USER_ARCHETYPES[a].description}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* All patterns */}
        <Card title="All Temporal Patterns" subtitle="3 interaction rhythms" className={styles.fullWidth}>
          <div className={styles.tagGrid}>
            {PATTERN_OPTIONS.map(p => (
              <div key={p} className={`${styles.tagRow} ${p === profile.pattern ? styles.tagActive : ''}`}>
                <PillBadge label={TEMPORAL_PATTERNS[p].color} color={TEMPORAL_PATTERNS[p].color} />
                <span className={styles.tagName}>{p}</span>
                <span className={styles.tagDesc}>{TEMPORAL_PATTERNS[p].description}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
