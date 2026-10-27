# 4EVE? (versus-pick)

เกมเลือกของที่ชอบแบบ 1 vs 1 — สุ่มจับคู่จนทุกตัวเจอกันครบ (round robin) แล้วจัดอันดับ 3 อันดับแรก

React + TypeScript + Tailwind CSS v4 + Vite

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

## เพิ่มตัวเลือก

- แก้ใน `src/data/options.ts` (ใส่ `id`, `name`, และ `emoji` หรือ `image`)
- หน้าแรกมีแค่ปุ่ม START (หรือกด Enter) เกมจะใช้ตัวเลือกทั้งหมดในไฟล์นี้

## วิธีจัดอันดับ

นับจำนวนครั้งที่ชนะ ถ้าเท่ากันดูผลตอนที่สองตัวนั้นเจอกันเอง
จำนวนรอบ = n × (n − 1) / 2 (10 ตัวเลือก = 45 รอบ)

## โครงสร้าง

```
src/
  data/options.ts        ตัวเลือกเริ่มต้น
  lib/tournament.ts      สร้างคู่ + จัดอันดับ
  hooks/useTournament.ts สถานะเกม
  components/            หน้า Start / Battle / Result + พื้นหลังดาว (ธีม galaxy 8-bit)
```
