import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Cell, Pie, Legend,
} from 'recharts'
import Card from '../components/Card'
import PillBadge from '../components/PillBadge'
import styles from './Insights.module.css'

const ARCHETYPE_RADAR = [
  { trait: 'Screen Time',   'Productivity Focused': 40, 'Social Media Heavy': 70, 'Heavy Entertainment': 90, 'Balanced User': 55 },
  { trait: 'Work Apps',     'Productivity Focused': 90, 'Social Media Heavy': 30, 'Heavy Entertainment': 20, 'Balanced User': 55 },
  { trait: 'Social Apps',   'Productivity Focused': 20, 'Social Media Heavy': 95, 'Heavy Entertainment': 50, 'Balanced User': 55 },
  { trait: 'Entertainment', 'Productivity Focused': 15, 'Social Media Heavy': 45, 'Heavy Entertainment': 95, 'Balanced User': 55 },
  { trait: 'Sleep Quality', 'Productivity Focused': 80, 'Social Media Heavy': 50, 'Heavy Entertainment': 40, 'Balanced User': 70 },
  { trait: 'Exercise',      'Productivity Focused': 75, 'Social Media Heavy': 40, 'Heavy Entertainment': 30, 'Balanced User': 60 },
]

const PATTERN_HOURS = [
  { hour: '05:00', 'Early Morning': 82, 'Evening Weekday': 10, 'Weekend': 18 },
  { hour: '08:00', 'Early Morning': 91, 'Evening Weekday': 30, 'Weekend': 25 },
  { hour: '12:00', 'Early Morning': 60, 'Evening Weekday': 55, 'Weekend': 50 },
  { hour: '17:00', 'Early Morning': 30, 'Evening Weekday': 88, 'Weekend': 45 },
  { hour: '20:00', 'Early Morning': 15, 'Evening Weekday': 95, 'Weekend': 72 },
  { hour: '22:00', 'Early Morning': 8,  'Evening Weekday': 60, 'Weekend': 80 },
]

const CONTEXT_DIST = [
  { name: 'Home',            value: 52, color: '#1d9e75' },
  { name: 'Work',            value: 18, color: '#378add' },
  { name: 'Commute',         value: 12, color: '#d4537e' },
  { name: 'Work from Home',  value: 10, color: '#5aa8f0' },
  { name: 'Morning Routine', value: 5,  color: '#2ec49a' },
  { name: 'Night',           value: 3,  color: '#e87fa8' },
]

const RECOMMENDER_FEATURES = [
  { feature: 'Sleep Hours',       importance: 0.291 },
  { feature: 'Stress Level',      importance: 0.244 },
  { feature: 'Screen Time',       importance: 0.163 },
  { feature: 'Diet Quality',      importance: 0.156 },
  { feature: 'Exercise (mins)',   importance: 0.146 },
]

const CHART_COLORS = {
  'Productivity Focused': '#378add',
  'Social Media Heavy':   '#d4537e',
  'Heavy Entertainment':  '#e87fa8',
  'Balanced User':        '#1d9e75',
  'Early Morning':        '#378add',
  'Evening Weekday':      '#1d9e75',
  'Weekend':              '#d4537e',
}

const tooltipStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1e2a3a',
  borderRadius: 8,
  color: '#c9d1d9',
  fontSize: '0.8rem',
}

export default function Insights() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Insights</h1>
          <p className={styles.subtitle}>Visualizations from ARIA's trained behavioral models</p>
        </div>
        <PillBadge label="Live Model Data" color="green" />
      </div>

      <div className={styles.grid}>

        {/* Archetype Radar */}
        <Card title="Archetype Trait Profiles" subtitle="Behavioral dimensions per user cluster" className={styles.wide}>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={ARCHETYPE_RADAR}>
                <PolarGrid stroke="#1e2a3a" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#6e7f91', fontSize: 12 }} />
                {Object.keys(CHART_COLORS).slice(0, 4).map(key => (
                  <Radar
                    key={key}
                    name={key}
                    dataKey={key}
                    stroke={CHART_COLORS[key]}
                    fill={CHART_COLORS[key]}
                    fillOpacity={0.1}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#6e7f91' }} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Context Distribution Pie */}
        <Card title="Context Distribution" subtitle="Breakdown across 6 inferred contexts">
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={CONTEXT_DIST}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CONTEXT_DIST.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#6e7f91' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recommender Feature Importance */}
        <Card title="Recommender Feature Importance" subtitle="Random Forest signal weights from mental health dataset">
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={RECOMMENDER_FEATURES} layout="vertical" margin={{ left: 16 }}>
                <XAxis type="number" domain={[0, 0.35]} tick={{ fill: '#6e7f91', fontSize: 11 }} tickFormatter={v => v.toFixed(2)} />
                <YAxis type="category" dataKey="feature" tick={{ fill: '#c9d1d9', fontSize: 12 }} width={120} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => v.toFixed(3)} />
                <Bar dataKey="importance" fill="#378add" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Temporal Pattern Activity */}
        <Card title="Temporal Pattern Activity" subtitle="Session intensity by hour across pattern types" className={styles.wide}>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={PATTERN_HOURS}>
                <XAxis dataKey="hour" tick={{ fill: '#6e7f91', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6e7f91', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#6e7f91' }} />
                <Bar dataKey="Early Morning"   fill="#378add" radius={[3,3,0,0]} />
                <Bar dataKey="Evening Weekday" fill="#1d9e75" radius={[3,3,0,0]} />
                <Bar dataKey="Weekend"         fill="#d4537e" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Model accuracy summary */}
        <Card title="Model Performance" subtitle="Classification accuracy from training run" className={styles.wide}>
          <div className={styles.metricsRow}>
            {[
              { label: 'User Profiling',         value: '86%',  color: 'blue',  note: 'Random Forest on 1,000 records' },
              { label: 'Pattern Detection',       value: '99%',  color: 'green', note: 'Random Forest on 99K+ records' },
              { label: 'Training Records',        value: '146K', color: 'blue',  note: '7 Kaggle datasets combined' },
              { label: 'Behavioral Archetypes',   value: '4',    color: 'pink',  note: 'MiniBatchKMeans clusters' },
              { label: 'Temporal Patterns',       value: '3',    color: 'green', note: 'Interaction rhythm clusters' },
              { label: 'Inferred Contexts',       value: '6',    color: 'pink',  note: 'From 5 live device signals' },
            ].map(({ label, value, color, note }) => (
              <div key={label} className={styles.metricItem}>
                <span className={styles.metricValue} data-color={color}>{value}</span>
                <span className={styles.metricLabel}>{label}</span>
                <span className={styles.metricNote}>{note}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
