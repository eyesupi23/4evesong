import { useCallback, useMemo, useState } from 'react'
import type { MatchResult, Option, Phase } from '../types'
import { rank, schedule, totalRounds } from '../lib/tournament'

const newSeed = () => Math.floor(Math.random() * 2147483646) + 1

export function useTournament() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Option[]>([])
  const [seed, setSeed] = useState(1)
  const [results, setResults] = useState<MatchResult[]>([])

  const ids = useMemo(() => players.map((o) => o.id), [players])
  const matches = useMemo(() => schedule(ids, results, seed), [ids, results, seed])
  const total = totalRounds(players.length)

  const round = results.length
  const current = round < total ? matches[round] : undefined

  const start = useCallback((selected: Option[]) => {
    setPlayers(selected)
    setSeed(newSeed())
    setResults([])
    setPhase('battle')
  }, [])

  const pick = useCallback(
    (winnerId: string) => {
      if (!current) return
      const loser = current.left === winnerId ? current.right : current.left
      const next = [...results, { winner: winnerId, loser }]
      setResults(next)
      if (next.length >= total) setPhase('result')
    },
    [current, results, total],
  )

  const undo = useCallback(() => {
    setResults((r) => r.slice(0, -1))
    setPhase('battle')
  }, [])

  const replay = useCallback(() => start(players), [start, players])
  const backToSetup = useCallback(() => setPhase('setup'), [])

  const ranking = useMemo(() => rank(players, matches, results), [players, matches, results])
  const byId = useMemo(() => new Map(players.map((p) => [p.id, p])), [players])

  return {
    phase,
    round,
    total,
    current: current
      ? { left: byId.get(current.left)!, right: byId.get(current.right)!, knockout: current.knockout }
      : null,
    ranking,
    start,
    pick,
    undo,
    replay,
    backToSetup,
  }
}
