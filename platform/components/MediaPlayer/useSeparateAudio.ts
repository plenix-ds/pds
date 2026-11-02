/* Plenix · useSeparateAudio
   Summary: Synchronize a separate sound source with native video transport and controls.
   Usage: const failed = useSeparateAudio(videoRef, audioRef, src, audio, kind);
   Props: refs point to the native elements; src/audio identify the current sources; kind defaults to video.
   Behavior: Video drives play, pause, seeking, rate, volume and mute. Correct drift above a quarter second.
   Notes: The video source is expected to be silent when its sound is supplied separately. No autoplay is added. */
import React from 'react';
const DRIFT_SECONDS = 0.25;
export function useSeparateAudio(video, sound, src, audio, kind) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    setFailed(false);
    const v = video.current, a = sound.current;
    if (!v) return undefined;
    if (kind === 'audio' || !audio || !a) return () => v.pause();
    let live = true, broken = false, mutedBeforeFailure = false;
    const fail = () => {
      if (!live || broken) return;
      broken = true; mutedBeforeFailure = v.muted; a.pause(); v.muted = true; setFailed(true);
    };
    const align = (force = false) => {
      if (broken) { if (!v.muted) v.muted = true; return; }
      a.playbackRate = v.playbackRate; a.volume = v.volume; a.muted = v.muted;
      if (a.readyState >= 1 && (force || Math.abs(a.currentTime - v.currentTime) > DRIFT_SECONDS)) {
        try { a.currentTime = v.currentTime; } catch (error) { /* retry when metadata or the next time update arrives */ }
      }
    };
    const play = () => {
      if (!live || broken || v.paused || v.seeking || v.ended || v.readyState < 3) return;
      if (!a.paused) { align(false); return; }
      align(true);
      const result = a.play();
      if (result && result.catch) result.catch(error => { if (live && !v.paused && !v.seeking && error.name !== 'AbortError') fail(); });
    };
    const pause = () => a.pause(), seek = () => { pause(); align(true); }, tick = () => align(false), resume = () => { align(true); play(); };
    const events = { play, playing: play, pause, ended: pause, waiting: pause, stalled: pause, seeking: seek, seeked: resume, ratechange: tick, volumechange: tick, timeupdate: tick, error: pause, emptied: pause };
    Object.entries(events).forEach(([name, handler]) => v.addEventListener(name, handler));
    a.addEventListener('loadedmetadata', resume); a.addEventListener('canplay', play); a.addEventListener('error', fail);
    align(true); if (a.error) fail(); else play();
    return () => {
      live = false; Object.entries(events).forEach(([name, handler]) => v.removeEventListener(name, handler));
      a.removeEventListener('loadedmetadata', resume); a.removeEventListener('canplay', play); a.removeEventListener('error', fail);
      a.pause(); v.pause(); if (broken) v.muted = mutedBeforeFailure;
    };
  }, [video, sound, src, audio, kind]);
  return failed;
}
