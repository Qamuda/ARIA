import styles from './PillBadge.module.css'

// color: 'blue' | 'pink' | 'green'
export default function PillBadge({ label, color = 'blue' }) {
  return (
    <span className={`${styles.pill} ${styles[color]}`}>
      {label}
    </span>
  )
}
