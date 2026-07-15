/**
 * 후원 금액 등급. 오버레이(DonationAlert)·채팅(ChatPanel) 등 표시부가 공유하는 단일 기준.
 * 구간(임계값)과 이모지는 여기서만 정의하고, 각 화면은 등급(level)에 스타일만 입힌다.
 */
export type DonationGradeLevel = 'crown' | 'diamond' | 'heart'

export interface DonationGrade {
  /** 이 등급의 하한(포인트, 이상) */
  min: number
  level: DonationGradeLevel
  emoji: string
}

/** 최소 등급. find 가 못 찾는 경우(이론상 음수 금액)의 안전한 기본값이기도 하다. */
const HEART: DonationGrade = { min: 0, level: 'heart', emoji: '💝' }

/** 큰 금액이 앞에 오도록 정렬 — donationGradeOf 가 위에서부터 첫 매칭을 쓴다. */
export const DONATION_GRADES: readonly DonationGrade[] = [
  { min: 10000, level: 'crown', emoji: '👑' },
  { min: 5000, level: 'diamond', emoji: '💎' },
  HEART,
]

export function donationGradeOf(amount: number): DonationGrade {
  return DONATION_GRADES.find((grade) => amount >= grade.min) ?? HEART
}
