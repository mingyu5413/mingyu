import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// NEIS(교육행정정보시스템) 관행: EUC-KR 기준, 한글 음절 1자 = 2바이트, 그 외(영문/숫자/공백/기호) = 1바이트
export function getNeisByteLength(text: string): number {
  let bytes = 0
  for (const ch of text) {
    bytes += ch.codePointAt(0)! > 127 ? 2 : 1
  }
  return bytes
}
