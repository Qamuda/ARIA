import { useState } from 'react'
import Card from '../components/Card'
import PillBadge from '../components/PillBadge'
import styles from './Settings.module.css'

const ALL_PROVIDERS = [
  {
    id:          'claude',
    name:        'Claude (Anthropic)',
    status:      'active',
    color:       'blue',
    description: 'Claude powers ARIA\'s language layer via a secure backend proxy. Prompts are assembled with ARIA\'s identity and your behavioral context before being sent.',
  },
  {
    id:          'gpt',
    name:        'GPT (OpenAI)',
    status:      'soon',
    color:       'green',
    description: 'OpenAI GPT support is planned. The provider router is already wired to accept it with no changes to ARIA\'s prompt or behavior logic.',
  },
  {
    id:          'ollama',
    name:        'Ollama (Local)',
    status:      'soon',
    color:       'green',
    description: 'Run ARIA fully offline using a local model through Ollama. Aligns with ARIA\'s privacy-first design since nothing leaves the device at all.',
  },
  {
    id:          'deepseek',
    name:        'DeepSeek',
    status:      'soon',
    color:       'pink',
    description: 'DeepSeek provider support planned for future expansion.',
  },
  {
    id:          'gemini',
    name:        'Gemini (Google)',
    status:      'soon',
    color:       'pink',
    description: 'Google Gemini provider support planned for future expansion.',
  },
]

const DEFAULT_SETTINGS = {
  provider:          'claude',
  displayName:       'ARIA',
  contextInference:  true,
  showBehavioralCtx: true,
  animationsEnabled: true,
}

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved]       = useState(false)

  function update(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave() {
    try {
      localStorage.setItem('aria_settings', JSON.stringify(settings))
    } catch {
      // localStorage may be unavailable under file://, ignore silently
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const activeProvider = ALL_PROVIDERS.find(p => p.id === settings.provider)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Configure ARIA behavior and provider routing</p>
        </div>
        <PillBadge label="Local Config" color="green" />
      </div>

      <div className={styles.sections}>

        {/* Provider Routing */}
        <Card title="Provider Routing" subtitle="How ARIA connects to a language model" accent="blue">
          <div className={styles.providerExplainer}>
            <p>
              ARIA is not hardcoded to any single AI provider. Every message goes through a
              provider router that assembles the prompt, injects your behavioral context, and
              forwards it to whichever backend you select. The model only ever sees ARIA prompts,
              never raw user messages.
            </p>
            <div className={styles.routerFlow}>
              <span className={styles.flowStep}>Your message</span>
              <span className={styles.flowArrow}>→</span>
              <span className={styles.flowStep}>promptBuilder.js</span>
              <span className={styles.flowArrow}>→</span>
              <span className={styles.flowStep}>providerRouter.js</span>
              <span className={styles.flowArrow}>→</span>
              <span className={`${styles.flowStep} ${styles.flowActive}`}>{activeProvider?.name}</span>
            </div>
          </div>

          <div className={styles.providerGrid}>
            {ALL_PROVIDERS.map(p => (
              <button
                key={p.id}
                className={`${styles.providerCard} ${settings.provider === p.id ? styles.providerSelected : ''} ${p.status === 'soon' ? styles.providerSoon : ''}`}
                onClick={() => p.status === 'active' && update('provider', p.id)}
                disabled={p.status === 'soon'}
                aria-pressed={settings.provider === p.id}
              >
                <div className={styles.providerCardTop}>
                  <span className={styles.providerName}>{p.name}</span>
                  {p.status === 'active'
                    ? <PillBadge label="Active" color="green" />
                    : <PillBadge label="Soon" color="pink" />
                  }
                </div>
                <p className={styles.providerDesc}>{p.description}</p>
              </button>
            ))}
          </div>

          <div className={styles.infoBox}>
            <span className={styles.infoIcon}>🔒</span>
            <p>API keys are never stored client-side. All provider calls go through a backend proxy endpoint.</p>
          </div>
        </Card>

        {/* Behavioral Intelligence */}
        <Card title="Behavioral Intelligence" subtitle="Context inference and profiling controls" accent="green">
          <div className={styles.settingGroup}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Live Context Inference</span>
                <span className={styles.settingDesc}>Infer current context from device signals in real time</span>
              </div>
              <label className={styles.toggle} aria-label="Toggle context inference">
                <input type="checkbox" checked={settings.contextInference}
                  onChange={e => update('contextInference', e.target.checked)} />
                <span className={styles.toggleTrack} />
              </label>
            </div>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Inject Behavioral Context</span>
                <span className={styles.settingDesc}>Include archetype and pattern data in ARIA prompts</span>
              </div>
              <label className={styles.toggle} aria-label="Toggle behavioral context injection">
                <input type="checkbox" checked={settings.showBehavioralCtx}
                  onChange={e => update('showBehavioralCtx', e.target.checked)} />
                <span className={styles.toggleTrack} />
              </label>
            </div>
          </div>
        </Card>

        {/* Interface */}
        <Card title="Interface" subtitle="Display preferences" accent="pink">
          <div className={styles.settingGroup}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Agent Display Name</span>
                <span className={styles.settingDesc}>Name shown in conversations and headers</span>
              </div>
              <input className={styles.textInput} value={settings.displayName}
                onChange={e => update('displayName', e.target.value)}
                maxLength={20} aria-label="Agent display name" />
            </div>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Animations</span>
                <span className={styles.settingDesc}>Enable motion and transitions across the UI</span>
              </div>
              <label className={styles.toggle} aria-label="Toggle animations">
                <input type="checkbox" checked={settings.animationsEnabled}
                  onChange={e => update('animationsEnabled', e.target.checked)} />
                <span className={styles.toggleTrack} />
              </label>
            </div>
          </div>
        </Card>

        <div className={styles.saveRow}>
          {saved && <span className={styles.savedMsg}>Settings saved to local storage</span>}
          <button className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`} onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>

      </div>
    </div>
  )
}
