import { useState, useCallback } from 'react'
import { inferContext, buildBehavioralContext } from '../services/behavioral/contextEngine'

const DEFAULT_PROFILE = {
  archetype: 'Balanced User',
  pattern:   'Early Morning User',
  appName:   '',
  isMoving:  false,
  onHomeWifi: true,
  sessionDuration: 0,
}

export function useARIA(initialProfile = {}) {
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, ...initialProfile })

  const context = inferContext({
    hour:            new Date().getHours(),
    appName:         profile.appName,
    isMoving:        profile.isMoving,
    onHomeWifi:      profile.onHomeWifi,
    sessionDuration: profile.sessionDuration,
  })

  const behavioralContext = buildBehavioralContext({
    archetype: profile.archetype,
    pattern:   profile.pattern,
    context,
  })

  const updateProfile = useCallback((updates) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }, [])

  return { profile, context, behavioralContext, updateProfile }
}
