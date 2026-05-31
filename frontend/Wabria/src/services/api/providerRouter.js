// Provider router. All LLM calls go through here.
// Add new providers here without touching any component or hook.

import { callClaude } from './anthropic'
import { buildARIAPrompt } from './promptBuilder'

const PROVIDERS = {
  claude: callClaude,
  // gpt:      callOpenAI,
  // ollama:   callOllama,
  // deepseek: callDeepSeek,
  // gemini:   callGemini,
}

export async function generateResponse(userMessage, behavioralContext = {}, provider = 'claude') {
  const handler = PROVIDERS[provider]
  if (!handler) throw new Error(`Unknown provider: "${provider}"`)

  const prompt = buildARIAPrompt(userMessage, behavioralContext)
  return await handler(prompt)
}

export function getSupportedProviders() {
  return Object.keys(PROVIDERS)
}
