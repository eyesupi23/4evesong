const bars = [0.2, 0.5, 0.1, 0.7, 0.35, 0.6, 0.15, 0.45, 0.25, 0.55, 0.05, 0.4]
/** โทนพาสเทล: ชมพู ม่วง ฟ้า มิ้นต์ เหลือง พีช */
const colors = ['bg-pink-200', 'bg-violet-200', 'bg-sky-200', 'bg-emerald-200', 'bg-yellow-100', 'bg-orange-200']

/** อีควอไลเซอร์พิกเซลเต้นตามจังหวะ (ตกแต่ง) */
export default function Equalizer({ className = '' }: { className?: string }) {
  return (
    <div className={`flex h-10 items-end gap-1 ${className}`} aria-hidden>
      {bars.map((d, i) => (
        <span
          key={i}
          className={`animate-eq h-full w-2 origin-bottom ${colors[i % colors.length]}`}
          style={{ ['--delay' as string]: `-${d}s` }}
        />
      ))}
    </div>
  )
}
