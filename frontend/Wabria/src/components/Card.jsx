import styles from './Card.module.css'

export default function Card({ title, subtitle, children, accent, className = '' }) {
  return (
    <div className={`${styles.card} ${accent ? styles[`accent-${accent}`] : ''} ${className}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title    && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p  className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      {children && <div className={styles.body}>{children}</div>}
    </div>
  )
}
