/**
 * Safe localStorage cache helper.
 * Wraps setItem in a try-catch so a QuotaExceededError
 * never crashes the React tree via an ErrorBoundary.
 */

export const safeSetCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    // Storage full – silently discard the cache write.
    // The app continues to work, it just won't have this data pre-loaded on next visit.
    console.warn(`[cache] Skipped writing "${key}" – ${err.message}`);
    // Attempt to free space by removing THIS key's stale entry
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
};

export const safeGetCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Corrupt data – wipe it
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    return null;
  }
};

export const safeClearCache = (key) => {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
};
