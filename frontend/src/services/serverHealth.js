/**
 * serverHealth.js
 *
 * Starts polling /api/health the moment the app loads.
 * Any auth action (signup/login) awaits `waitUntilReady()` first —
 * so we never send a real API call to a sleeping Render server.
 */
import axios from 'axios';

const BACKEND = import.meta.env.VITE_API_URL; // undefined in local dev
const HEALTH_URL = BACKEND ? `${BACKEND}/api/health` : null;

const POLL_INTERVAL_MS = 3000;   // check every 3 seconds
const MAX_WAIT_MS      = 90000;  // give up after 90 seconds

let _readyPromise = null;
let _isReady      = false;
let _startTime    = null;

// Called once from main.jsx on app load
export const initServerWarmUp = () => {
  if (!HEALTH_URL) {
    // Local dev — backend is always running
    _isReady = true;
    _readyPromise = Promise.resolve();
    return;
  }

  _startTime = Date.now();

  _readyPromise = new Promise((resolve, reject) => {
    const poll = async () => {
      if (Date.now() - _startTime > MAX_WAIT_MS) {
        reject(new Error('Server did not respond within 90 seconds. Please refresh and try again.'));
        return;
      }
      try {
        await axios.get(HEALTH_URL, { timeout: 6000 });
        _isReady = true;
        resolve();
      } catch {
        // Server still sleeping — wait and try again
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    };
    poll();
  });
};

// Returns true immediately if already awake, otherwise waits
export const waitUntilReady = () => {
  if (!_readyPromise) {
    // initServerWarmUp wasn't called yet — start now
    initServerWarmUp();
  }
  return _readyPromise;
};

// Reactive: returns elapsed wake-up seconds (for UI display)
export const getWakeElapsed = () =>
  _startTime ? Math.floor((Date.now() - _startTime) / 1000) : 0;

export const isServerReady = () => _isReady;
