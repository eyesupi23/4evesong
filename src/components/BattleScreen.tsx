import { useEffect, useState } from 'react'
import type { Option } from '../types'
import { timeLimit } from '../lib/tournament'
import Equalizer from './Equalizer'
import OptionArt from './OptionArt'

interface Props {
  left: Option
  right: Option
  round: number
  total: number
  knockout: boolean
  onPick: (id: string) => void
  onQuit: () => void
}

function Card({ option, side, onPick }: { option: Option; side: string; onPick: () => void }) {
  return (
    <button
      onClick={onPick}
      className="pixel-box animate-stage group mx-auto flex h-full w-full max-w-64 flex-col sm:max-w-72 bg-void text-white
        transition-transform hover:-translate-y-1 active:translate-x-1 active:translate-y-1
        focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-star"
    >
      <span className="bg-ink px-3 py-1.5 text-left font-pixel text-[8px] text-comet sm:text-[10px]">♪</span>
      <OptionArt option={option} className="aspect-[4/2] w-full" emojiClass="text-4xl sm:text-5xl" />
      {/* flex-1 ให้ชื่อยืดเต็มที่ว่าง การ์ดสองฝั่งสูงเท่ากันแม้ชื่ออีกฝั่งยาว 2 บรรทัด */}
      <span className="grid flex-1 place-items-center border-t-4 border-ink px-3 py-2.5 font-display text-base font-semibold group-hover:text-star sm:py-3 sm:text-xl">{option.name}</span>
      <span className="sr-only">เลือก{side}</span>
    </button>
  )
}

export default function BattleScreen({ left, right, round, total, knockout, onPick, onQuit }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPick(left.id)
      else if (e.key === 'ArrowRight') onPick(right.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [left.id, right.id, onPick])

  const limit = timeLimit(round, total)
  const [remaining, setRemaining] = useState(limit)

  // นับถอยหลัง หมดเวลาแล้วสุ่มเลือกให้
  useEffect(() => {
    const started = performance.now()
    setRemaining(limit)
    const id = setInterval(() => {
      const r = limit - (performance.now() - started)
      if (r <= 0) {
        clearInterval(id)
        onPick(Math.random() < 0.5 ? left.id : right.id)
      } else {
        setRemaining(r)
      }
    }, 50)
    return () => clearInterval(id)
  }, [round, limit, left.id, right.id, onPick])

  const danger = remaining <= 2000

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-5 py-6">
      <header className="flex items-center justify-between gap-4 font-pixel text-[10px] sm:text-xs">
        <button onClick={onQuit} className="text-white/70 hover:text-plasma">◀ EXIT</button>
        <span className="flex flex-col items-center gap-1.5">
          <span>
            TRACK <span className="text-star">{String(round + 1).padStart(2, '0')}</span>
          </span>
          {knockout ? (
            <span className="text-[8px] text-white/60 sm:text-[10px]">KNOCKOUT · แพ้ตกรอบ</span>
          ) : (
            <span className="animate-blink text-[8px] text-plasma sm:text-[10px]">★ FINAL STAGE ★</span>
          )}
        </span>
        {/* ตัวกันที่ให้ชื่อรอบอยู่กึ่งกลางพอดี */}
        <span className="invisible" aria-hidden>◀ EXIT</span>
      </header>
      <div className="mt-4 flex items-center gap-3" role="timer" aria-label="เวลาที่เหลือ">
        <span className={`w-10 font-pixel text-sm ${danger ? 'animate-blink text-plasma' : 'text-star'}`}>
          {Math.ceil(remaining / 1000)}s
        </span>
        <div className="h-4 flex-1 border-2 border-white/80 p-0.5">
          <div
            className={`pixel-bar h-full ${danger ? '[--color-star:var(--color-plasma)]' : ''}`}
            style={{ width: `${(remaining / limit) * 100}%` }}
          />
        </div>
      </div>

      <p className="pixel-text mt-8 text-center font-pixel text-2xl text-star sm:text-3xl">เลือกเพลง</p>

      {/* มือถือ: VS อยู่คั่นกลางระหว่างการ์ด / จอใหญ่: ลอยทับตรงกลาง */}
      <div key={round} className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-12">
        <Card option={left} side="ซ้าย" onPick={() => onPick(left.id)} />
        <div className="pointer-events-none flex justify-center
          sm:absolute sm:z-10 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
          <div className="animate-stamp pixel-box grid h-14 w-14 place-items-center bg-plasma font-pixel text-lg
            text-white [--edge:var(--color-ink)] sm:h-20 sm:w-20 sm:text-2xl">
            VS
          </div>
        </div>
        <Card option={right} side="ขวา" onPick={() => onPick(right.id)} />
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 pt-8">
        <Equalizer />
        {/* <p className="text-center font-pixel text-[10px] leading-relaxed text-white/60">
          ← → TO VOTE · BACKSPACE TO UNDO
        </p> */}
      </div>
    </main>
  )
}
