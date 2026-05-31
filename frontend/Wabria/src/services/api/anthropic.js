// Anthropic provider adapter.
// In production this calls a backend proxy. Never expose API keys client-side.

export async function callClaude(prompt) {
  const { system, user } = prompt

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, user }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic proxy error: ${res.status} — ${err}`)
  }

  const data = await res.json()
  return data.content ?? data.text ?? ''
}
