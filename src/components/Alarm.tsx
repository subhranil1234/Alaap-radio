import { useState, useEffect } from 'react';
import { AlarmClock, BellRing, BellOff, AlertTriangle } from 'lucide-react';
import type { Station } from '../config/stations';

interface AlarmProps {
  stations: Station[];
  onTrigger: (stationId: string) => void;
}

export function Alarm({ stations, onTrigger }: AlarmProps) {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('04:00');
  const [stationId, setStationId] = useState(stations[0].id);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Load saved alarm
    const saved = localStorage.getItem('alarmConfig');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        if (config.time) setTime(config.time);
        if (config.stationId) setStationId(config.stationId);
      } catch (e) {}
    }
  }, []);

  const toggleAlarm = () => {
    if (!enabled) {
      localStorage.setItem('alarmConfig', JSON.stringify({ time, stationId }));
      setEnabled(true);
    } else {
      setEnabled(false);
      setStatus('');
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      // Calculate time remaining
      const [alarmH, alarmM] = time.split(':').map(Number);
      const targetTime = new Date(now);
      targetTime.setHours(alarmH, alarmM, 0, 0);
      if (targetTime.getTime() <= now.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      const diff = targetTime.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      
      setStatus(`in ${h}h ${m}m`);

      if (currentTime === time && now.getSeconds() < 2) { // check within first 2 seconds of the minute
        onTrigger(stationId);
        setEnabled(false);
        setStatus('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, time, stationId, onTrigger]);

  return (
    <div>
      <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlarmClock size={18} /> Wake-up Alarm
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="time" 
            value={time} 
            onChange={e => setTime(e.target.value)}
            disabled={enabled}
            style={{ 
              background: 'rgba(0,0,0,0.5)', 
              color: 'var(--color-amber-glow)', 
              border: '1px solid var(--color-brass)',
              padding: '0.5rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem'
            }}
          />
          
          <select 
            value={stationId} 
            onChange={e => setStationId(e.target.value)}
            disabled={enabled}
            style={{ 
              background: 'rgba(0,0,0,0.5)', 
              color: 'var(--color-ivory)', 
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '0.5rem',
              borderRadius: '6px',
              flex: 1
            }}
          >
            {stations.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <button 
          className={enabled ? 'action-btn-outline' : 'action-btn'} 
          onClick={toggleAlarm}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {enabled ? <><BellOff size={18} /> Cancel Alarm {status}</> : <><BellRing size={18} /> Enable Alarm</>}
        </button>

        {enabled && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-ivory-dim)', background: 'rgba(255,183,3,0.1)', padding: '0.8rem', borderRadius: '6px', borderLeft: '3px solid var(--color-amber-dim)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', color: 'var(--color-amber-dim)' }}>
              <AlertTriangle size={14} /> <strong>Prepare for wake-up:</strong>
            </div>
            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
              <li>Keep your laptop powered on and awake.</li>
              <li>Leave this page open and active.</li>
              <li>Check your device volume.</li>
              <li>Note: Browsers cannot wake sleeping devices.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
