import Card from '../components/Card'
import PillBadge from '../components/PillBadge'
import { useARIA } from '../hooks/useARIA'
import { CONTEXTS } from '../services/behavioral/profileMapper'
import { IMAGES } from '../config/images'
import styles from './Home.module.css'

const FEATURES = [
  {
    title:       'Behavioral Profiling',
    description: '4 user archetypes learned from 100K+ interaction records using MiniBatchKMeans clustering.',
    accent:      'blue',
    pill:        { label: 'ML', color: 'blue' },
  },
  {
    title:       'Temporal Patterns',
    description: '3 interaction pattern types detected via Random Forest — 99% classification accuracy.',
    accent:      'green',
    pill:        { label: 'RF', color: 'green' },
  },
  {
    title:       'Context Inference',
    description: '6 live contexts inferred from device signals: HOME, WORK, COMMUTE, and more.',
    accent:      'pink',
    pill:        { label: 'On-Device', color: 'pink' },
  },
]

export default function Home({ onNavigate, tabMap }) {
  const { context } = useARIA()
  const contextMeta = CONTEXTS[context] ?? CONTEXTS['HOME']

  return (
    <div className={styles.page}>
      {IMAGES.heroImage && (
        <div className={styles.heroBanner}>
          <img src={IMAGES.heroImage} alt="ARIA hero" />
        </div>
      )}

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <PillBadge label={`Context: ${contextMeta.label}`} color={contextMeta.color} />
          <h1 className={styles.headline}>
            Adaptive Routine<br />Intelligence Agent
          </h1>
          <p className={styles.subheadline}>
            On-device behavioral intelligence that learns your patterns, infers your context,
            and delivers personalized guidance — entirely without cloud dependency.
          </p>
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={() => onNavigate?.(tabMap.DASHBOARD)}>
              View Dashboard
            </button>
            <button className={styles.btnSecondary} onClick={() => onNavigate?.(tabMap.INSIGHTS)}>
              Explore Insights
            </button>
          </div>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>86%</span>
            <span className={styles.statLabel}>User Profiling Accuracy</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>99%</span>
            <span className={styles.statLabel}>Pattern Detection Accuracy</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>146K+</span>
            <span className={styles.statLabel}>Training Records</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>6</span>
            <span className={styles.statLabel}>Inferred Contexts</span>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>How ARIA Works</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map(({ title, description, accent, pill }) => (
            <Card key={title} title={title} accent={accent}>
              <div className={styles.featureBody}>
                <PillBadge label={pill.label} color={pill.color} />
                <p>{description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.privacy}>
        <Card accent="green">
          <div className={styles.privacyContent}>
            <div>
              <h3>Privacy First. Always.</h3>
              <p>
                All behavioral modeling runs locally. No data leaves your device.
                No cloud APIs. No telemetry. Your patterns stay yours.
              </p>
            </div>
            <PillBadge label="Minimum  Cloud Dependency" color="green" />
          </div>
        </Card>
      </section>
    </div>
  )
}
