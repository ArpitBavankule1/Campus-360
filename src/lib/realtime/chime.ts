/**
 * CampusLens AI - Realtime Audio Synthesizer
 * Generates lightweight, synthesized audio tones using Web Audio API
 * without external audio asset downloads.
 */

const STORAGE_KEY = "campus_sound_enabled";

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
  } catch {
    // Ignore storage issues
  }
}

export type ChimeTone = "alert" | "message" | "broadcast" | "success";

export function playChime(tone: ChimeTone = "message"): void {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (tone) {
      case "alert":
      case "broadcast": {
        // High attention alert: Two-tone siren pulse (880 Hz -> 587.33 Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.18);
        osc.frequency.setValueAtTime(880, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.4);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

        osc.start(now);
        osc.stop(now + 0.55);
        break;
      }

      case "message": {
        // Friendly subtle chime (D5 -> A5)
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);

        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case "success": {
        // Ascending harmonic chime (C5 -> E5 -> G5)
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.45);

        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }
    }

    // Cleanup audio context after playback
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1000);
  } catch {
    // Autoplay restrictions or audio unsupported; fail silently
  }
}
