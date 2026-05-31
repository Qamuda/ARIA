import { useState } from 'react'
import Card from '../components/Card'
import PillBadge from '../components/PillBadge'
import { useARIA } from '../hooks/useARIA'
import { IMAGES } from '../config/images'
import styles from './TryARIA.module.css'

// Mirrors the 5 features + importances from the Random Forest regressor
// in the Python recommender (see Insights page).
const FEATURES = [
  { key: 'sleep',    label: 'Sleep',        unit: 'hrs', min: 0, max: 12,  step: 0.5, default: 7,  importance: 0.291, ideal: [7, 9] },
  { key: 'stress',   label: 'Stress',       unit: '/10', min: 1, max: 10,  step: 1,   default: 5,  importance: 0.244, ideal: [1, 4],  inverse: true },
  { key: 'screen',   label: 'Screen Time',  unit: 'hrs', min: 0, max: 16,  step: 1,   default: 6,  importance: 0.163, ideal: [0, 6],  inverse: true },
  { key: 'diet',     label: 'Diet Quality', unit: '/10', min: 1, max: 10,  step: 1,   default: 6,  importance: 0.156, ideal: [7, 10] },
  { key: 'exercise', label: 'Exercise',     unit: 'min', min: 0, max: 120, step: 5,   default: 30, importance: 0.146, ideal: [30, 90] },
]

const SUGGESTIONS = {
  sleep:    'Sleep is the strongest predictor in your model. Aim for 7–9 hours tonight.',
  stress:   'Stress is dragging your signal. A 5-minute breath break now will help.',
  screen:   'Screen time is over the productive threshold. Step away for 20 minutes.',
  diet:     'Diet quality is the weak link. Add a balanced meal today.',
  exercise: 'Movement is missing. A 20-minute walk will reset your focus.',
}

function scoreFeature(f, value) {
  const [low, high] = f.ideal
  if (value >= low && value <= high) return 0
  if (f.inverse) {
    return Math.min(1, Math.max(0, (value - high) / (f.max - high)))
  }
  return Math.min(1, Math.max(0, (low - value) / (low - f.min)))
}

export default function TryARIA() {
  const { profile } = useARIA()
  const initial = FEATURES.reduce((acc, f) => ({ ...acc, [f.key]: f.default }), {})
  const [values, setValues] = useState(initial)
  const [result, setResult] = useState(null)

  function update(key, val) {
    setValues(prev => ({ ...prev, [key]: Number(val) }))
    setResult(null)
  }

  function handleSuggest() {
    const scored = FEATURES.map(f => ({
      ...f,
      weighted: scoreFeature(f, values[f.key]) * f.importance,
      raw:      scoreFeature(f, values[f.key]),
      value:    values[f.key],
    }))
    const allGood = scored.every(s => s.raw === 0)
    const target  = scored.reduce((a, b) => (b.weighted > a.weighted ? b : a))
    setResult({
      allGood,
      target,
      scored,
      headline: allGood ? 'All inputs are in a healthy range. Maintain your current routine.' : SUGGESTIONS[target.key],
    })
  }

  function handleReset() {
    setValues(initial)
    setResult(null)
  }

  return (
    <div className={styles.page}>
      {IMAGES.tryAriaImage && (
        <div className={styles.tryBanner}>
          <img src={IMAGES.tryAriaImage} alt="Try ARIA" />
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Try ARIA</h1>
          <p className={styles.subtitle}>
            Feed ARIA your current state. The suggestion is driven by the recommender's feature weights.
          </p>
        </div>
        <PillBadge label={`Archetype: ${profile.archetype}`} color="blue" />
      </div>

      <div className={styles.grid}>
        <Card title="Your inputs" subtitle="5 features from the trained Random Forest regressor" accent="blue">
          <div className={styles.sliderStack}>
            {FEATURES.map(f => (
              <div key={f.key} className={styles.sliderRow}>
                <div className={styles.sliderHead}>
                  <span className={styles.sliderLabel}>{f.label}</span>
                  <span className={styles.sliderValue}>{values[f.key]} {f.unit}</span>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={values[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  className={styles.slider}
                  aria-label={f.label}
                />
                <span className={styles.sliderHint}>Weight in model: {(f.importance * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={handleSuggest}>Get Suggestion</button>
            <button className={styles.btnSecondary} onClick={handleReset}>Reset</button>
          </div>
        </Card>

        <Card
          title="ARIA suggestion"
          subtitle="Generated locally — no API call"
          accent={result ? (result.allGood ? 'green' : 'pink') : 'green'}
        >
          {!result ? (
            <p className={styles.placeholder}>
              Adjust the sliders, then press <strong>Get Suggestion</strong>. ARIA picks the feature with the highest weighted concern and responds.
            </p>
          ) : (
            <div className={styles.resultBlock}>
              <PillBadge
                label={result.allGood ? 'Healthy across all inputs' : `Focus: ${result.target.label}`}
                color={result.allGood ? 'green' : 'pink'}
              />
              <p className={styles.resultHeadline}>{result.headline}</p>

              <div className={styles.scoreTable}>
                {result.scored
                  .slice()
                  .sort((a, b) => b.weighted - a.weighted)
                  .map(s => (
                    <div key={s.key} className={styles.scoreRow}>
                      <span className={styles.scoreLabel}>{s.label}</span>
                      <div className={styles.bar}>
                        <div
                          className={styles.barFill}
                          style={{ width: `${Math.round(s.weighted * 100 / 0.291)}%` }}
                        />
                      </div>
                      <span className={styles.scoreVal}>{(s.weighted * 100).toFixed(1)}</span>
                    </div>
                  ))}
              </div>

              <p className={styles.note}>
                Weighted concern score — higher means more attention. Computed from your raw input against the ideal range, multiplied by the feature's importance in the model.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
