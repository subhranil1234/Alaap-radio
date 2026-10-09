import { useState, useEffect, useRef, useCallback } from 'react';
import Hls from 'hls.js';
import type { Station } from '../config/stations';

export interface AudioState {
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  isMuted: boolean;
  error: string | null;
  statusText: string;
}

export function useAudio(initialVolume: number = 50) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isBuffering: false,
    volume: initialVolume,
    isMuted: false,
    error: null,
    statusText: 'READY',
  });
  
  const [currentStation, setCurrentStation] = useState<Station | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    const handlePlaying = () => setState(s => ({ ...s, isPlaying: true, isBuffering: false, error: null, statusText: 'LIVE' }));
    const handleWaiting = () => setState(s => ({ ...s, isBuffering: true, statusText: 'BUFFERING' }));
    const handleStalled = () => setState(s => ({ ...s, isBuffering: true, statusText: 'STALLED' }));
    const handlePause = () => setState(s => ({ ...s, isPlaying: false, isBuffering: false, statusText: 'PAUSED' }));
    const handleError = () => {
      setState(s => ({ ...s, isPlaying: false, isBuffering: false, error: 'Stream error', statusText: 'OFFLINE' }));
    };
    const handleVolumeChange = () => {
      setState(s => ({ ...s, volume: audio.volume * 100, isMuted: audio.muted }));
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('volumechange', handleVolumeChange);
    
    audio.volume = initialVolume / 100;
    
    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('volumechange', handleVolumeChange);
      
      audio.pause();
      audio.src = '';
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  const playStation = useCallback((station: Station) => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentStation(station);

    if (!station.streamUrl) {
      audio.pause();
      setState(s => ({ ...s, isPlaying: false, isBuffering: false, error: 'Direct stream unsupported', statusText: 'UNSUPPORTED' }));
      return;
    }

    setState(s => ({ ...s, isBuffering: true, error: null, statusText: 'CONNECTING' }));
    
    // Clean up previous HLS instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (station.streamUrl.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      
      hls.loadSource(station.streamUrl);
      hls.attachMedia(audio);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play().catch((e) => {
          setState(s => ({ ...s, isPlaying: false, isBuffering: false, error: 'Playback blocked', statusText: 'BLOCKED' }));
          console.error("Audio playback error:", e);
        });
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setState(s => ({ ...s, isPlaying: false, isBuffering: false, error: 'Stream error', statusText: 'OFFLINE' }));
              break;
          }
        }
      });
    } else {
      if (audio.src !== station.streamUrl) {
        audio.src = station.streamUrl;
        audio.load();
      }
      
      audio.play().catch((e) => {
        setState(s => ({ ...s, isPlaying: false, isBuffering: false, error: 'Playback blocked', statusText: 'BLOCKED' }));
        console.error("Audio playback error:", e);
      });
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (audio.paused) {
      if (!audio.src || audio.src === window.location.href) {
         if (currentStation) {
            playStation(currentStation);
         }
      } else {
        setState(s => ({ ...s, isBuffering: true, statusText: 'CONNECTING' }));
        audio.play().catch(() => {
          setState(s => ({ ...s, isPlaying: false, isBuffering: false, error: 'Playback blocked', statusText: 'BLOCKED' }));
        });
      }
    } else {
      audio.pause();
    }
  }, [currentStation, playStation]);

  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.max(0, Math.min(100, vol)) / 100;
      if (audio.muted && vol > 0) {
        audio.muted = false;
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
    }
  }, []);
  
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
      setState(s => ({...s, isPlaying: false, isBuffering: false, statusText: 'READY'}));
    }
  }, []);

  return {
    state,
    currentStation,
    playStation,
    togglePlayPause,
    setVolume,
    toggleMute,
    stop,
  };
}
