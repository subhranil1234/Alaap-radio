import { useEffect, useRef } from 'react';
import type { Station } from '../config/stations';
import type { AudioState } from '../hooks/useAudio';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, ExternalLink, RefreshCw } from 'lucide-react';

interface RadioProps {
  audio: {
    state: AudioState;
    currentStation: Station | null;
    togglePlayPause: () => void;
    setVolume: (vol: number) => void;
    toggleMute: () => void;
  };
  stations: Station[];
  activeStationId: string;
  onStationChange: (id: string) => void;
}

export function Radio({ audio, stations, activeStationId, onStationChange }: RadioProps) {
  const { state, currentStation, togglePlayPause, setVolume, toggleMute } = audio;
  const displayRef = useRef<HTMLDivElement>(null);

  const currentIndex = stations.findIndex(s => s.id === activeStationId);
  
  const handlePrev = () => {
    const newIdx = (currentIndex - 1 + stations.length) % stations.length;
    onStationChange(stations[newIdx].id);
  };
  
  const handleNext = () => {
    const newIdx = (currentIndex + 1) % stations.length;
    onStationChange(stations[newIdx].id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field (like alarm time)
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(state.volume + 5);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(state.volume - 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, toggleMute, setVolume, state.volume]);

  return (
    <div className="radio-cabinet">
      <div className="speaker-grille"></div>
      
      <div className="radio-content">
        <div className="display-panel" ref={displayRef}>
          <div className={`display-amber-glow ${state.isPlaying || state.isBuffering ? 'active' : ''}`}></div>
          
          <div className="station-info">
            <div className="station-subtitle">{currentStation?.subtitle || '---'}</div>
            <div className="station-name">{currentStation?.name || 'OFF'}</div>
            
            <div className="status-indicator">
              <div className={`status-dot ${state.isPlaying ? 'live' : state.error ? 'error' : ''}`}></div>
              <span>{state.statusText}</span>
            </div>
          </div>
          
          {/* Tuning Dial Visual */}
          <div style={{ width: '100%', height: '40px', borderTop: '2px solid var(--color-brass-dark)', borderBottom: '2px solid var(--color-brass-dark)', position: 'relative', marginTop: '1rem', overflow: 'hidden' }}>
             <div style={{
                position: 'absolute',
                top: 0,
                left: `${(currentIndex / Math.max(1, stations.length - 1)) * 90 + 5}%`,
                width: '4px',
                height: '100%',
                backgroundColor: 'var(--color-danger)',
                boxShadow: '0 0 10px var(--color-danger)',
                transition: 'left 0.5s ease-in-out',
                zIndex: 2
             }}></div>
             
             <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                padding: '0 10%',
                opacity: 0.3
             }}>
                {[...Array(20)].map((_, i) => (
                  <div key={i} style={{ width: i % 5 === 0 ? '2px' : '1px', height: i % 5 === 0 ? '20px' : '10px', backgroundColor: 'var(--color-amber-dim)' }}></div>
                ))}
             </div>
          </div>
        </div>

        {currentStation && !currentStation.streamUrl && (
          <div className="fallback-warning">
            <p>Direct streaming for this station is not available or officially supported. Please use the official broadcast portal to listen.</p>
            <a href={currentStation.fallbackUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className="action-btn">
                <ExternalLink size={18} /> Open Official Player
              </button>
            </a>
          </div>
        )}

        <div className="controls-row">
          <button className="knob" onClick={handlePrev} title="Previous Station">
             <SkipBack size={24} />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
             <button className="knob knob-large" onClick={togglePlayPause} title="Play/Pause (Space)">
                {state.isBuffering ? (
                  <RefreshCw size={32} className="lucide-spin" style={{ animation: 'spin 2s linear infinite' }} />
                ) : state.isPlaying ? (
                  <Pause size={32} />
                ) : (
                  <Play size={32} style={{ marginLeft: '4px' }} />
                )}
             </button>
             <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-brass-light)', fontSize: '0.8rem' }}>POWER / PLAY</div>
          </div>

          <button className="knob" onClick={handleNext} title="Next Station">
             <SkipForward size={24} />
          </button>
        </div>
        
        <div className="slider-container" style={{ marginTop: '1rem', padding: '0 2rem' }}>
          <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'var(--color-brass-light)', cursor: 'pointer' }}>
             {state.isMuted || state.volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input 
             type="range" 
             className="slider" 
             min="0" 
             max="100" 
             value={state.isMuted ? 0 : state.volume}
             onChange={(e) => setVolume(parseInt(e.target.value))}
             title="Volume (Up/Down)"
          />
          <div style={{ fontFamily: 'var(--font-mono)', width: '3ch', textAlign: 'right', color: 'var(--color-brass-light)', fontSize: '0.9rem' }}>
            {state.isMuted ? '0' : Math.round(state.volume)}%
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
