"use client"
import { useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
}

export default function InvitePage({ params }: { params: { id: string } }) {
  const materialId = params.id

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<User[]>([])
  const [selected, setSelected] = useState<User[]>([])
  const [highlight, setHighlight] = useState(0)

  useEffect(() => {
    fetchUser(query)
  }, [query])

  const fetchUser = async () => {
    if (!query) return setResults([])

    const res = await fetch(
      `/api/materials/${materialId}/invite/${query}`
    )
    const data = await res.json()

    setResults(data)
    setHighlight(0)
  }

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown")
      setHighlight((h) => Math.min(h + 1, results.length - 1))
    if (e.key === "ArrowUp")
      setHighlight((h) => Math.max(h - 1, 0))
    if (e.key === "Enter" && results[highlight]) {
      addUser(results[highlight])
    }
  }

  const addUser = (u: User) => {
    if (selected.find(s => s.id === u.id)) return
    setSelected([...selected, u])
    setQuery("")
    setResults([])
  }

  const sendInvite = async () => {
    await fetch(`/api/materials/${materialId}/invite`, {
      method: "POST",
      body: JSON.stringify({
        userIds: selected.map(u => u.id),
        invitedById: "CURRENT_USER_ID"
      })
    })
    alert("Invite sent")
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Invite Peserta</h2>

      {/* Selected */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selected.map(u => (
          <span key={u.id} className="px-3 py-1 bg-primary text-white rounded-full text-sm">
            {u.name}
          </span>
        ))}
      </div>

      {/* Search */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Cari nama atau email..."
        className="w-full border rounded-lg px-4 py-2 mb-2"
      />

      {/* Result */}
      <div className="border rounded-lg max-h-56 overflow-auto">
        {results.map((u, i) => (
          <div
            key={u.id}
            onClick={() => addUser(u)}
            className={`px-4 py-2 cursor-pointer ${
              i === highlight ? "bg-muted" : ""
            }`}
          >
            <div className="font-medium">{u.name}</div>
            <div className="text-sm text-muted-foreground">{u.email}</div>
          </div>
        ))}
      </div>

      <button
        onClick={sendInvite}
        className="mt-4 w-full bg-primary text-white py-2 rounded-lg"
      >
        Kirim Invite
      </button>
    </div>
  )
}
