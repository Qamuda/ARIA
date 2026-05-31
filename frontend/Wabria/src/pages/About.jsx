import Card from '../components/Card'
import PillBadge from '../components/PillBadge'
import { IMAGES } from '../config/images'
import styles from './About.module.css'

const STACK = [
  { layer: 'Clustering',      tech: 'MiniBatchKMeans',      color: 'blue',  detail: '4 behavioral archetypes from 1,000 user records' },
  { layer: 'Classification',  tech: 'Random Forest',        color: 'blue',  detail: '86% user profiling · 99% pattern detection' },
  { layer: 'Recommendation',  tech: 'Random Forest Regressor', color: 'green', detail: 'Mental health + archetype dataset, 5 feature signals' },
  { layer: 'Context Engine',  tech: 'Rule-based inference', color: 'green', detail: '5 device inputs → 6 context types, zero ML overhead' },
  { layer: 'Data Pipeline',   tech: 'pandas + scikit-learn', color: 'pink', detail: 'cleaner.py → model.py → saving.py → predict_or.py' },
  { layer: 'Serialization',   tech: 'joblib (.pkl)',        color: 'pink',  detail: '8 model artifacts persisted across sessions' },
]

const MODULES = [
  { file: 'loader.py',     role: 'Kaggle dataset retrieval via kagglehub' },
  { file: 'cleaner.py',    role: 'Data pipeline and feature engineering' },
  { file: 'model.py',      role: 'MiniBatchKMeans + Random Forest training' },
  { file: 'saving.py',     role: 'Model serialization to .pkl' },
  { file: 'predict_or.py', role: 'Live inference and suggestion engine' },
  { file: 'utils.py',      role: 'Shared utilities — context inference, cluster labeling' },
  { file: 'datasets.py',   role: 'Central dataset manifest and path registry' },
]

const PRINCIPLES = [
  { title: 'On-Device Only',      desc: 'All ML inference runs locally. No data leaves the device.', color: 'green' },
  { title: 'Provider Agnostic',   desc: 'The LLM layer is abstracted — ARIA is not coupled to any single provider.', color: 'blue' },
  { title: 'Context Aware',       desc: 'Suggestions adapt to real-time signals: location, app, time, movement.', color: 'blue' },
  { title: 'Privacy First',       desc: 'No telemetry, no cloud sync, no account required.', color: 'green' },
  { title: 'ARIA is the Agent',   desc: 'The language model is a rendering engine. ARIA is the intelligence.', color: 'pink' },
]

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>About ARIA</h1>
          <p className={styles.subtitle}>CS499 Senior Capstone — Adaptive Routine Intelligence Agent</p>
        </div>
        <PillBadge label="Capstone Project" color="blue" />
      </div>

      {IMAGES.aboutImage && (
        <div className={styles.aboutBanner}>
          <img src={IMAGES.aboutImage} alt="ARIA pipeline" />
        </div>
      )}

      <Card accent="blue">
        <div className={styles.summary}>
          <p>
            ARIA is an on-device behavioral intelligence system built as a CS499 senior seminar capstone.
            It profiles user interaction patterns using unsupervised clustering, detects temporal rhythms
            via supervised classification, and delivers personalized lifestyle and productivity guidance —
            entirely without cloud dependency.
          </p>
          <p>
            The system trains on three observational datasets (~100K records) and four recommendation
            datasets (~46K records), all sourced from Kaggle. Model artifacts are serialized locally and
            loaded at runtime with no retraining required.
          </p>
        </div>
      </Card>

      <section>
        <h2 className={styles.sectionTitle}>Design Principles</h2>
        <div className={styles.principlesGrid}>
          {PRINCIPLES.map(({ title, desc, color }) => (
            <Card key={title} accent={color}>
              <div className={styles.principleItem}>
                <PillBadge label={title} color={color} />
                <p>{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>ML Stack</h2>
        <Card>
          <div className={styles.stackTable}>
            {STACK.map(({ layer, tech, color, detail }) => (
              <div key={layer} className={styles.stackRow}>
                <span className={styles.stackLayer}>{layer}</span>
                <PillBadge label={tech} color={color} />
                <span className={styles.stackDetail}>{detail}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Python Pipeline — 7 Modules</h2>
        <Card>
          <div className={styles.moduleTable}>
            {MODULES.map(({ file, role }) => (
              <div key={file} className={styles.moduleRow}>
                <code className={styles.moduleFile}>{file}</code>
                <span className={styles.moduleRole}>{role}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
