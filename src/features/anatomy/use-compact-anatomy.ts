'use client';

import { useSyncExternalStore } from 'react';

const key = 'alile-workout:compact-anatomy';
const changeEvent = 'alile-workout:anatomy-preference';
let fallback: boolean | null = null;

function snapshot() {
  if (fallback !== null) return fallback;
  try {
    return localStorage.getItem(key) !== 'false';
  } catch {
    return true;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function useCompactAnatomy() {
  const compact = useSyncExternalStore(subscribe, snapshot, () => true);
  function toggle() {
    const next = !compact;
    fallback = next;
    try {
      localStorage.setItem(key, String(next));
      fallback = null;
    } catch {
      // The control still works for this session when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(changeEvent));
  }
  return { compact, toggle };
}
