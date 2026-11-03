// ─── useSoundAlert Hook ─────────────────────────────────────────────────────
// Plays notification sounds with graceful fallback when audio permissions
// are denied or unavailable.

import { useCallback, useRef } from 'react';

interface SoundAlertOptions {
  volume?: number;
  loop?: boolean;
}

export function useSoundAlert() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((src: string, options: SoundAlertOptions = {}) => {
    try {
      // Reuse or create audio element
      if (!audioRef.current || audioRef.current.src !== src) {
        audioRef.current = new Audio(src);
      }

      const audio = audioRef.current;
      audio.volume = options.volume ?? 0.5;
      audio.loop = options.loop ?? false;

      // Reset to start if already playing
      audio.currentTime = 0;

      audio.play().catch(() => {
        // Audio permission denied — degrade gracefully
        console.warn('[Sound] Audio playback blocked by browser policy');
      });
    } catch {
      // Audio API not available
      console.warn('[Sound] Audio API unavailable');
    }
  }, []);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { playSound, stopSound };
}
