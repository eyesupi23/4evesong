export interface Option {
  id: string
  name: string
  /** อีโมจิที่แสดงบนการ์ด (ใช้เมื่อไม่มีรูป) */
  emoji?: string
  /** path รูปใน public เช่น "/images/1.png" หรือ URL รูป — ถ้ามีจะแสดงแทนอีโมจิ */
  image?: string
}

export interface Match {
  left: string
  right: string
  /** ลำดับช่วงการแข่ง (0 = รอบแรก) */
  stage: number
  /** true = รอบน็อกเอาต์ (แพ้ตกรอบ), false = รอบสุดท้ายพบกันหมด */
  knockout: boolean
}

export interface MatchResult {
  winner: string
  loser: string
}

export interface RankedOption {
  option: Option
  wins: number
  played: number
}

export type Phase = 'setup' | 'battle' | 'result'
