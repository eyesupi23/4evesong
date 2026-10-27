import { useEffect, useState } from "react";
import type { Option } from "../types";
import Equalizer from "./Equalizer";
import OptionArt from "./OptionArt";

interface Props {
  options: Option[];
  onStart: () => void;
}

const rules = [
  "เลือกเพลงที่ชอบที่สุดในแต่ละรอบ ทั้งหมด 72 รอบ",
  "เลือกแล้วเปลี่ยนใจไม่ได้",
  "ตัวเลือกจะถูกตัดเรื่อยๆ จนได้เพลงที่ชนะ",
  "เวลาในการเลือกในแต่ละรอบจะลดลงเรื่อยๆ เพราะฉะนั้น เชื่อเซนส์แรกนะคะ ><",
  "หวังว่าฟอร์อายจะสนุกน้า enjoy คับบ!",
];

export default function SetupScreen({ options, onStart }: Props) {
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // เปิด modal อยู่: Esc = ยกเลิก ส่วน Enter ให้ปุ่มที่โฟกัสอยู่ (เริ่มได้เลย) จัดการเอง
      if (showRules) {
        if (e.key === "Escape") setShowRules(false);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setShowRules(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showRules]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <p className="font-pixel text-xl tracking-widest text-comet sm:text-sm">
        ♪ 4EVE SONG ♪
      </p>
      <h1 className="pixel-text mt-3 font-pixel text-2xl font-bold leading-tight text-star sm:text-5xl">
        จัดอันดับเพลงฟีฟในใจคุณ
      </h1>
      <Equalizer className="mt-6" />
      <p className="mt-6 max-w-md text-white/80">
        เพลงเยอะแต่ไม่คิดเยอะ <br />
        เพราะเราจะไม่ให้เวลาคุณได้คิดแน่นอล ;P
      </p>

      <ul
        className="mt-5 flex flex-wrap justify-center gap-3"
        aria-label="ศิลปินในเกม"
      >
        {options.map((o, i) => (
          <li
            key={o.id}
            className="animate-float"
            style={{ ["--delay" as string]: `${(i % 4) * 0.3}s` }}
          >
            <OptionArt
              option={o}
              className="pixel-box h-12 w-12 [--edge:var(--color-ink)]"
              emojiClass="text-2xl"
            />
            <span className="sr-only">{o.name}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setShowRules(true)}
        disabled={options.length < 2}
        className="pixel-box animate-stage mt-8 bg-plasma px-10 py-5 font-pixel text-lg text-white
          transition-transform active:translate-x-1 active:translate-y-1 disabled:opacity-40
          hover:bg-nebula focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-star sm:text-2xl"
      >
        ▶ PLAY
      </button>
      <p className="animate-blink mt-3 font-pixel text-[10px] text-white/70 sm:text-xs">
        PRESS ENTER
      </p>
      {/* <p className="mt-3 font-pixel text-[10px] text-comet sm:text-xs">⏱ เลือกให้ทันเวลา ยิ่งท้ายยิ่งเร็ว!</p> */}

      {showRules && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-space/80 p-4"
          onClick={() => setShowRules(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
            onClick={(e) => e.stopPropagation()}
            className="animate-rise pixel-box max-h-full w-full max-w-md overflow-y-auto bg-void px-5 py-7 text-left
              [--edge:var(--color-star)] sm:px-8"
          >
            <h2
              id="rules-title"
              className="pixel-text text-center font-pixel text-base text-star sm:text-lg"
            >
              ♪ HOW TO PLAY ♪
            </h2>
            <ol className="mt-6 space-y-3">
              {rules.map((rule, i) => (
                <li key={i} className="flex gap-4">
                  <span className="pixel-box grid h-7 w-7 shrink-0 place-items-center bg-comet font-pixel text-[10px] text-ink [--edge:var(--color-ink)]">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-white/90">{rule}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-4 font-display sm:flex-row-reverse">
              <button
                autoFocus
                onClick={onStart}
                className="pixel-box animate-stage flex-1 bg-plasma px-4 py-3 font-semibold text-white
                  active:translate-x-1 active:translate-y-1 hover:bg-nebula
                  focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-star"
              >
                เข้าใจแล้ว เริ่มได้เลย
              </button>
              <button
                onClick={() => setShowRules(false)}
                className="pixel-box bg-ink px-4 py-3 text-white/80 [--edge:var(--color-white)]
                  active:translate-x-1 active:translate-y-1 hover:text-white"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
