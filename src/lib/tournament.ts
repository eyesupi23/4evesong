import type { Match, MatchResult, Option, RankedOption } from '../types'

/** จำนวนตัวที่เข้ารอบสุดท้าย (พบกันหมด) */
export const FINALISTS = 8

/** สุ่มแบบกำหนด seed — ใช้ seed เดิมได้คู่เดิม (สำคัญตอนกดย้อนกลับ) */
export function seededRandom(seed: number): () => number {
  let s = seed % 2147483647 || 1
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const roundRobin = (n: number) => (n * (n - 1)) / 2

/**
 * จำนวนรอบทั้งหมด: รอบน็อกเอาต์ตัดทีละ 1 ตัวจนเหลือ FINALISTS
 * แล้วรอบสุดท้ายพบกันหมด เช่น 52 ตัว = 44 + 28 = 72 รอบ
 */
export function totalRounds(n: number): number {
  const finalists = Math.min(n, FINALISTS)
  return n - finalists + roundRobin(finalists)
}

const MAX_TIME = 5_000
const MIN_TIME = 1_000
/** เวลาต่ำสุดที่ให้จริง — ช่วงท้ายจะค้างอยู่ที่ค่านี้ */
const FLOOR_TIME = 2_500

/** เวลาให้เลือกต่อรอบ (ms): เริ่ม 5 วิ แล้วลดลงเร็วขึ้นเรื่อย ๆ จนเหลือ 2.5 วิแล้วคงที่ */
export function timeLimit(round: number, total: number): number {
  const p = total > 1 ? round / (total - 1) : 1
  return Math.max(FLOOR_TIME, Math.round(MAX_TIME - (MAX_TIME - MIN_TIME) * p * p))
}

/**
 * สร้างคู่แบบพบกันหมด (round robin) แล้วสุ่มลำดับ
 * พยายามไม่ให้ตัวเดิมออกมาสองรอบติดกัน
 */
export function buildMatches(ids: string[], stage = 0, random: () => number = Math.random): Match[] {
  const pool: Match[] = []
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const flip = random() < 0.5
      pool.push({ left: flip ? ids[j] : ids[i], right: flip ? ids[i] : ids[j], stage, knockout: false })
    }
  }

  const remaining = shuffle(pool, random)
  const ordered: Match[] = []
  while (remaining.length) {
    const prev = ordered[ordered.length - 1]
    let idx = 0
    if (prev) {
      const fresh = remaining.findIndex(
        (m) => ![m.left, m.right].some((id) => id === prev.left || id === prev.right),
      )
      if (fresh !== -1) idx = fresh
    }
    ordered.push(remaining.splice(idx, 1)[0])
  }
  return ordered
}

/**
 * ตารางแข่งเท่าที่รู้ได้จากผลที่มีอยู่
 * - น็อกเอาต์: ทุกรอบสุ่มจับคู่ตัวที่ยังอยู่ แพ้ตกรอบ (ตัวที่เหลือคี่ได้บาย)
 *   รอบสุดท้ายของน็อกเอาต์จะจับแค่พอให้เหลือ FINALISTS พอดี
 * - เหลือ FINALISTS ตัวแล้ว: พบกันหมด
 * คู่ของรอบถัดไปจะโผล่มาเมื่อเล่นรอบก่อนหน้าครบแล้ว
 */
export function schedule(ids: string[], results: MatchResult[], seed: number): Match[] {
  let alive = ids
  const matches: Match[] = []
  for (let stage = 0; ; stage++) {
    const random = seededRandom(seed + stage * 7919)
    if (alive.length <= FINALISTS) {
      return [...matches, ...buildMatches(alive, stage, random)]
    }

    const cut = Math.min(Math.floor(alive.length / 2), alive.length - FINALISTS)
    const order = shuffle(alive, random)
    const start = matches.length
    for (let i = 0; i < cut; i++) {
      matches.push({ left: order[2 * i], right: order[2 * i + 1], stage, knockout: true })
    }
    if (results.length < matches.length) return matches

    const out = new Set(results.slice(start, start + cut).map((r) => r.loser))
    alive = alive.filter((id) => !out.has(id))
  }
}

/**
 * จัดอันดับ: ตัวที่เข้ารอบสุดท้ายอยู่บนสุด เรียงตามจำนวนชนะในรอบสุดท้าย (เท่ากันดูผลเจอกันเอง)
 * ที่เหลือเรียงตามรอบที่ตกรอบ (อยู่ได้นานกว่าอยู่สูงกว่า) แล้วดูจำนวนชนะรวม
 */
export function rank(options: Option[], matches: Match[], results: MatchResult[]): RankedOption[] {
  const stats = new Map(
    options.map((o) => [o.id, { option: o, wins: 0, played: 0, finalWins: 0, outAt: Infinity }]),
  )
  results.forEach((r, i) => {
    const m = matches[i]
    const w = stats.get(r.winner)
    const l = stats.get(r.loser)
    if (w) {
      w.wins++
      w.played++
      if (m && !m.knockout) w.finalWins++
    }
    if (l) {
      l.played++
      if (m?.knockout) l.outAt = m.stage
    }
  })

  const headToHead = (a: string, b: string): number => {
    const r = results.find(
      (x) => (x.winner === a && x.loser === b) || (x.winner === b && x.loser === a),
    )
    if (!r) return 0
    return r.winner === a ? -1 : 1
  }

  return [...stats.values()]
    .sort(
      (a, b) =>
        b.outAt - a.outAt ||
        b.finalWins - a.finalWins ||
        (a.outAt === Infinity ? headToHead(a.option.id, b.option.id) : 0) ||
        b.wins - a.wins ||
        a.option.name.localeCompare(b.option.name, 'th'),
    )
    .map(({ option, wins, played }) => ({ option, wins, played }))
}
