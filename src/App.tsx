import React from 'react';
import { Radio } from './components/Radio.tsx';
import { SleepTimer } from './components/SleepTimer.tsx';
import { Alarm } from './components/Alarm.tsx';
import { FallingFlowers } from './components/FallingFlowers.tsx';
import { STATIONS } from './config/stations';
import { useAudio } from './hooks/useAudio';
import { Radio as RadioIcon } from 'lucide-react';

const TARGET_DATE = '2026-10-10T04:00:00';

function App() {
  const [countdown, setCountdown] = React.useState('');

  const audio = useAudio(50);
  const [activeStationId, setActiveStationId] = React.useState(STATIONS[0].id);

  React.useEffect(() => {
    // Load persisted settings
    const savedStationId = localStorage.getItem('lastStationId');
    if (savedStationId && STATIONS.some(s => s.id === savedStationId)) {
      setActiveStationId(savedStationId);
    }
  }, []);

  React.useEffect(() => {
    const station = STATIONS.find(s => s.id === activeStationId) || STATIONS[0];
    audio.playStation(station);
    localStorage.setItem('lastStationId', station.id);
  }, [activeStationId, audio.playStation]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Handle the target date string properly for Asia/Kolkata timezone if needed, 
      // but for simplicity, assuming local time evaluation for now as requested by user.
      const target = new Date(TARGET_DATE);
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown('MAHALAYA IS HERE');
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        setCountdown(`${d}d ${h}h ${m}m to go`);
      }
    }, 60000); // update every minute
    
    // Run immediately once
    const initialNow = new Date();
    const initialTarget = new Date(TARGET_DATE);
    const initialDiff = initialTarget.getTime() - initialNow.getTime();
    if (initialDiff <= 0) {
      setCountdown('MAHALAYA IS HERE');
    } else {
      const d = Math.floor(initialDiff / (1000 * 60 * 60 * 24));
      const h = Math.floor((initialDiff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((initialDiff / 1000 / 60) % 60);
      setCountdown(`${d}d ${h}h ${m}m to go`);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <FallingFlowers />
      <div className="app-container">
        <div className="mist-container">
          <div className="mist"></div>
        </div>
      
      <header className="cinematic-header">
        <div className="brand-cinematic">
          <h1 className="bengali-title">শুভ মহালয়া</h1>
          <div className="decorative-separator"></div>
          <h2 className="bengali-subtitle">“মহিষাসুরমর্দিনী — ভোরের আবাহন”</h2>
          <p className="english-subtitle">A morning of devotion, memories & the arrival of Maa Durga.</p>
        </div>
        <div className="header-meta cinematic-meta">
          <div className="countdown-text">{countdown}</div>
          <div className="date-text">{new Date().toLocaleDateString()}</div>
        </div>
      </header>

      <main className="main-content">
        <Radio 
          audio={audio} 
          stations={STATIONS} 
          activeStationId={activeStationId}
          onStationChange={setActiveStationId} 
        />
        
        <div className="secondary-panels">
          <div className="panel">
            <h2 className="panel-title">Presets</h2>
            <div className="station-list">
              {STATIONS.map(station => (
                <button 
                  key={station.id}
                  className={`station-btn ${activeStationId === station.id ? 'active' : ''}`}
                  onClick={() => setActiveStationId(station.id)}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{station.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{station.subtitle}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-brass)' }}>
                    {station.frequency}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SleepTimer onExpire={audio.stop} />
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <Alarm 
              stations={STATIONS} 
              onTrigger={(stationId) => setActiveStationId(stationId)} 
            />
          </div>
        </div>
      </main>
      
      <footer style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem', paddingBottom: '2rem' }}>
        <p>Aalap — Radio for Mahalaya. Best experienced before dawn.</p>
        <p style={{ marginTop: '0.5rem' }}>
          Shortcuts: Space to Play/Pause, M to Mute, Up/Down for Volume.
        </p>
      </footer>
    </div>
    </>
  );
}

export default App;
