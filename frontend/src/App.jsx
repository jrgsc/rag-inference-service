import { useState } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_GATEWAY_API_KEY

export default function App() {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ question }),
      })

      if (res.status === 429) {
        throw new Error('rate limited, slow down a bit')
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `request failed (${res.status})`)
      }

      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>RAG Search</h1>
      <p className="subtitle">ask a question, get an answer pulled from the wiki dataset</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="what do you want to know?"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'thinking...' : 'ask'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className="answer">{result.answer}</p>
          {result.sources?.length > 0 && (
            <ul className="sources">
              {result.sources.map((src) => (
                <li key={src}>{src}</li>
              ))}
            </ul>
          )}
          {result.cached && <span className="cached-badge">cached</span>}
        </div>
      )}
    </div>
  )
}
