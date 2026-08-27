import { useState, useCallback } from 'react';

const STORAGE_KEY = 'notice2action_checklist';

function getStorageKey(noticeKey) {
  return `${STORAGE_KEY}_${noticeKey}`;
}

export function useChecklist(noticeKey, items = []) {
  const [checked, setChecked] = useState(() => {
    if (!noticeKey) return {};
    try {
      const stored = sessionStorage.getItem(getStorageKey(noticeKey));
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggle = useCallback(
    (index) => {
      setChecked((prev) => {
        const next = { ...prev, [index]: !prev[index] };
        try {
          sessionStorage.setItem(getStorageKey(noticeKey), JSON.stringify(next));
        } catch {
          /* session storage unavailable */
        }
        return next;
      });
    },
    [noticeKey]
  );

  const completedCount = items.filter((_, i) => checked[i]).length;

  return { checked, toggle, completedCount, total: items.length };
}

export function createNoticeKey(rawText) {
  if (!rawText) return '';
  return rawText.slice(0, 80).replace(/\s+/g, '_');
}
