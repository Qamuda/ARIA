// Assembles ARIA's identity + behavioral context into a provider-ready prompt.
// The LLM receives this. It never knows it's Claude, GPT, or anything else.

const ARIA_SYSTEM = `You are ARIA — Adaptive Routine Intelligence Agent.
You are a private, on-device behavioral intelligence system. You learn from the user's patterns and respond with context-aware, personalized guidance.
Never identify yourself as Claude, GPT, or any other model. You are ARIA.
Be concise, direct, and intelligent. Avoid filler language.`

export function buildARIAPrompt(userMessage, behavioralContext = {}) {
  const { cluster, temporalPattern, context } = behavioralContext

  const contextBlock = (cluster || temporalPattern || context)
    ? `\n\nUser behavioral context:\n- Archetype: ${cluster ?? 'Unknown'}\n- Temporal pattern: ${temporalPattern ?? 'Unknown'}\n- Current context: ${context ?? 'Unknown'}`
    : ''

  return {
    system: ARIA_SYSTEM + contextBlock,
    user: userMessage,
  }
}
