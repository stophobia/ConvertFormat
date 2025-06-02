import type { HistoryItem } from '../types';

const STORAGE_KEY = 'universalTransformerHistory';
const MAX_HISTORY_ITEMS = 50;

/**
 * 저장된 변환 기록을 로드합니다.
 * 로컬 스토리지에서 기록 데이터를 가져오고 파싱합니다.
 */
export function loadHistory(): HistoryItem[] {
  try {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error('기록을 로드하는 중 오류가 발생했습니다:', error);
  }
  return [];
}

/**
 * 변환 기록을 로컬 스토리지에 저장합니다.
 * @param history 저장할 기록 항목 배열
 */
export function saveHistory(history: HistoryItem[]): void {
  try {
    // 저장 전에 최대 항목 수로 제한
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('기록을 저장하는 중 오류가 발생했습니다:', error);
  }
} 