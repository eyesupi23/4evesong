import type { RankedOption } from '../types'
import OptionArt from './OptionArt'

interface Props {
  ranking: RankedOption[]
  onReplay: () => void
  onHome: () => void
}

const placeColors = ['bg-star', 'bg-comet', 'bg-plasma']
const placeLabels = ['1ST PLACE', '2ND', '3RD']
/** การ์ดโผล่ทีละใบ: #3 → #2 → #1 */
const riseDelay = ['0.8s', '0.4s', '0s']

export default function ResultScreen({ ranking, onReplay, onHome }: Props) {
  const [first, ...runnersUp] = ranking.slice(0, 3)

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <p className="animate-blink font-pixel text-xs text-comet sm:text-sm text-center">♥ Fav 4EVE Song is... ♥</p>
      {/* <h1 className="pixel-text mt-4 font-pixel text-3xl text-star sm:text-5xl">ที่หนึ่งในใจคุณ</h1> */}

      {/* #1 การ์ดรางวัล */}
      {first && (
        <div className="animate-rise mt-10" style={{ ['--delay' as string]: riseDelay[0] }}>
          <div className="pixel-box [--edge:var(--color-star)]">
            <div className="relative bg-void px-4 pb-6 pt-10 sm:px-8 sm:pt-12">
              <span
                className="pixel-box absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-star
                  px-4 py-2 font-pixel text-xs text-ink [--edge:var(--color-ink)] sm:text-base"
              >
                ★ {placeLabels[0]} ★
              </span>
              {/* <span className="animate-float absolute right-4 top-3 font-pixel text-2xl text-star sm:text-3xl" aria-hidden>
                ♛
              </span> */}
              <OptionArt
                option={first.option}
                className="pixel-box animate-stage aspect-[4/2] w-full"
                emojiClass="text-7xl sm:text-9xl"
              />
              <p className="pixel-text mt-5 text-center font-display text-2xl font-semibold text-star sm:text-4xl">
                {first.option.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* #2 ใหญ่กว่า #3 เล็กกว่า อยู่แถวล่าง */}
      {runnersUp.length > 0 && (
        <div className="mt-10 grid grid-cols-[1.3fr_1fr] items-end gap-5 sm:gap-8">
          {runnersUp.map((r, j) => {
            const i = j + 1
            return (
              <div key={r.option.id} className="animate-rise" style={{ ['--delay' as string]: riseDelay[i] }}>
                <div className="relative">
                  <OptionArt
                    option={r.option}
                    className="pixel-box aspect-[4/2] w-full"
                    emojiClass={i === 1 ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'}
                  />
                  <span
                    className={`pixel-box absolute -left-2 -top-3 px-2 py-1.5 font-pixel text-ink [--edge:var(--color-ink)]
                      ${i === 1 ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} ${placeColors[i]}`}
                  >
                    {placeLabels[i]}
                  </span>
                </div>
                <p className={`mt-3 text-center font-display font-semibold ${i === 1 ? 'text-base sm:text-xl' : 'text-sm sm:text-lg'}`}>
                  {r.option.name}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {ranking.length > 3 && (
        <section className="mt-14">
          <h2 className="font-pixel text-sm text-comet">♪ FULL CHART</h2>
          <ol className="pixel-box mt-4 divide-y-2 divide-dashed divide-white/20 bg-void px-4 [--edge:var(--color-nebula)]">
            {ranking.map((r, i) => (
              <li key={r.option.id} className="flex items-center gap-3 py-3">
                <span className="w-8 text-right font-pixel text-xs text-star">{i + 1}.</span>
                <OptionArt option={r.option} className="aspect-[4/2] w-18 shrink-0" emojiClass="text-lg" />
                <span className="flex-1">{r.option.name}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-6 font-pixel text-xs sm:text-sm">
        <button
          onClick={onReplay}
          className="pixel-box animate-stage bg-plasma px-6 py-4 text-white active:translate-x-1 active:translate-y-1
            hover:bg-nebula focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-star"
        >
          ↻ Play again
        </button>
        <button
          onClick={onHome}
          className="pixel-box bg-void px-6 py-4 text-white [--edge:var(--color-comet)] active:translate-x-1 active:translate-y-1"
        >
          HOME
        </button>      </div>
    </main>
  )
}
