import { useState, useEffect } from 'react';
import { Timer, X } from 'lucide-react';

interface SleepTimerProps {
  onExpire: () => void;
}

export function SleepTimer({ onExpire }: SleepTimerProps) {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<string>('');

  const PRESETS = [15, 30, 45, 60];

  const startTimer = (minutes: number) => {
    setEndTime(Date.now() + minutes * 60000);
  };

  const cancelTimer = () => {
    setEndTime(null);
    setRemaining('');
  };

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setEndTime(null);
        setRemaining('');
        onExpire();
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setRemaining(`${m}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  return (
    <div>
      <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Timer size={18} /> Sleep Timer
      </h3>
      
      {endTime ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-ivory-dim)' }}>Timer Active</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--color-amber-glow)' }}>{remaining}</div>
          </div>
          <button className="action-btn-outline" onClick={cancelTimer} style={{ padding: '0.5rem' }}>
            <X size={18} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PRESETS.map(mins => (
            <button 
              key={mins} 
              className="action-btn-outline" 
              onClick={() => startTimer(mins)}
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
            >
              {mins}m
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
