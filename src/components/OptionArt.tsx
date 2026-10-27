import { useState } from 'react'
import type { Option } from '../types'

const tints = ['bg-star', 'bg-plasma', 'bg-comet', 'bg-nebula', 'bg-lime-300', 'bg-orange-300']

function tintFor(id: string) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return tints[h % tints.length]
}

interface Props {
  option: Option
  className?: string
  emojiClass?: string
}

/** รูปของตัวเลือก: ใช้รูปถ้ามี (โหลดไม่ได้จะใช้ตัวอักษรแรกบนพื้นสีแทน) */
export default function OptionArt({ option, className = '', emojiClass = 'text-6xl' }: Props) {
  const [broken, setBroken] = useState(false)

  if (option.image && !broken) {
    return (
      <img
        src={option.image}
        alt=""
        onError={() => setBroken(true)}
        className={`bg-ink object-cover object-center ${className}`}
      />
    )
  }
  return (
    <div className={`grid place-items-center ${tintFor(option.id)} ${className}`}>
      <span className={`${emojiClass} leading-none text-ink font-display`} aria-hidden>
        {option.emoji || option.name.slice(0, 1)}
      </span>
    </div>
  )
}
