const colors = ['#ffffff', '#ffffff', '#ffffff', '#fff04d', '#4dfff3', '#ff3ea5']
const notes = ['♪', '♫', '♬', '♥']

// สุ่มแบบกำหนด seed เพื่อให้ตำแหน่งดาวเหมือนเดิมทุกครั้งที่ render
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

const rand = rng(42)
const stars = Array.from({ length: 90 }, () => ({
  x: rand() * 100,
  y: rand() * 100,
  size: rand() < 0.8 ? 2 : 4,
  color: colors[Math.floor(rand() * colors.length)],
  dur: 1.5 + rand() * 3,
  delay: rand() * 3,
}))
const floatingNotes = Array.from({ length: 12 }, (_, i) => ({
  x: rand() * 100,
  y: rand() * 100,
  note: notes[i % notes.length],
  color: colors[3 + (i % 3)],
  delay: rand() * 2.4,
}))

/** พื้นหลังดาวพิกเซลกระพริบ + โน้ตเพลงลอย */
export default function Starfield() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            ['--dur' as string]: `${s.dur}s`,
            ['--delay' as string]: `${s.delay}s`,
          }}
        />
      ))}
      {floatingNotes.map((n, i) => (
        <span
          key={`n${i}`}
          className="animate-float absolute font-pixel text-base opacity-60 sm:text-xl"
          style={{ left: `${n.x}%`, top: `${n.y}%`, color: n.color, ['--delay' as string]: `${n.delay}s` }}
        >
          {n.note}
        </span>
      ))}
    </div>
  )
}
