
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import DottedGlowBackground from './components/DottedGlowBackground';

// --- Components ---

const MathematicalF = () => (
  <span className="math-f">ƒ</span>
);

const Orbitals = () => {
  // Generate 8 orbiting atoms with different radii and speeds
  return (
    <div className="orbit-system">
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className={`orbit-ring r-${i}`}
          style={{
            '--radius': `${60 + i * 20}px`,
            '--speed': `${3 + i * 0.8}s`,
            '--delay': `${i * -0.5}s`,
            '--color': i % 2 === 0 ? 'var(--neon-pink)' : 'var(--neon-green)'
          } as React.CSSProperties}
        >
          <div className="atom"></div>
        </div>
      ))}
    </div>
  );
};

const RetroHypercube = () => {
  const [rotation, setRotation] = useState({ x: -25, y: 45 });
  const [mutation, setMutation] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setRotation({
        x: -25 + y * 80,
        y: 45 + x * 80
      });
    };

    const mutationInterval = setInterval(() => {
      setMutation(prev => (prev === 1 ? 1.2 : 1));
    }, 2000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(mutationInterval);
    };
  }, []);

  return (
    <div className="hypercube-wrapper" ref={containerRef}>
      <div className="retro-grid-floor"></div>
      <div className="viewport">
        <div 
          className="scene" 
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            '--mutation-scale': mutation
          } as React.CSSProperties}
        >
          {/* Deep Fractal Wireframe Tesseract (4 Levels) */}
          {[160, 110, 70, 35].map((size, idx) => (
            <div 
              key={idx} 
              className={`cube-3d level-${idx}`}
              style={{ 
                width: size, 
                height: size,
                '--rotation-speed': `${10 + idx * 5}s`,
                '--depth': `${size / 2}px`
              } as React.CSSProperties}
            >
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face right"></div>
              <div className="face left"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          ))}

          <Orbitals />

          {/* Mutating Vector Axes */}
          <div className="vector-axis u-axis mutating">
            <div className="arrow-line"></div>
            <div className="arrow-head"></div>
            <div className="axis-label">U_VEC</div>
          </div>

          <div className="vector-axis s-axis mutating">
            <div className="arrow-line"></div>
            <div className="arrow-head"></div>
            <div className="axis-label">S_VEC</div>
          </div>

          <div className="vector-axis v-axis mutating">
            <div className="arrow-line"></div>
            <div className="arrow-head"></div>
            <div className="axis-label">V_DIM</div>
          </div>

          <div className="center-glow"></div>
        </div>
      </div>
    </div>
  );
};

const LoadingBar = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-label">BOOTING_CORE_INFERENCE_ENGINE... {Math.floor(progress)}%</div>
      <div className="progress-outer">
        <div className="progress-inner" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

const AccessTerminal = () => {
  const [val, setVal] = useState('');
  const [status, setStatus] = useState('READY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val) setStatus('U-AXIS_CALIBRATION_START...');
  };

  return (
    <div className="retro-terminal">
      <div className="terminal-header">SYSTEM.CONTROL.v1.0</div>
      {status === 'READY' ? (
        <form onSubmit={handleSubmit} className="terminal-input-row">
          <span className="cursor-prompt">&gt;</span>
          <input 
            type="text" 
            placeholder="ENTER_SEQUENCE" 
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
        </form>
      ) : (
        <div className="terminal-status blink">{status}</div>
      )}
    </div>
  );
};

function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setIsBooted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className={`os-container ${isBooted ? 'booted' : ''}`}>
      <div className="crt-overlay"></div>
      <div className="scanlines"></div>
      
      <DottedGlowBackground 
        gap={40} 
        radius={1} 
        color="rgba(0, 255, 255, 0.05)" 
        glowColor="rgba(255, 0, 255, 0.2)" 
        speedScale={0.1}
        repelRadius={200}
        repelStrength={0.5}
      />

      <header className="os-nav">
        <div className="node-id">NODE_77_ONLINE</div>
        <div className="timer">{currentTime.toLocaleTimeString()}</div>
      </header>

      {!loadingComplete ? (
        <main className="loading-stage">
           <LoadingBar onComplete={() => setLoadingComplete(true)} />
        </main>
      ) : (
        <main className="game-stage">
          <div className="brand-unit">
            <RetroHypercube />
            <div className="logo-group">
              <h1 className="logo-text">usin<MathematicalF />erence</h1>
              <div className="subtitle">STEALTH_INFERENCE_SUBSTRATE</div>
            </div>
          </div>

          <div className="action-hub">
            <p className="description-text">
              16-CELL HYPERTOPOLOGIES DETECTED. <br/>
              MULTIDIMENSIONAL INFERENCE SUBSTRATE ACTIVE.
            </p>
            <AccessTerminal />
          </div>
        </main>
      )}

      <footer className="meta-footer">
        <div className="meta-block">
          <label>VECTORS</label>
          <span>U/S/V_ACTIVE</span>
        </div>
        <div className="meta-block">
          <label>DIMENSIONS</label>
          <span>11_DIM_STRETCH</span>
        </div>
        <div className="meta-block">
          <label>SECURITY</label>
          <span>ENC_LEVEL_A+</span>
        </div>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
