import React from 'react';

const ShiuliSvg = () => (
  <svg viewBox="0 0 100 100" className="shiuli-flower" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50, 50)">
      {/* 6 Petals */}
      <path d="M 0,-10 C 15,-40 -15,-40 0,-10 Z" fill="#Fdfbf7" transform="rotate(0)" />
      <path d="M 0,-10 C 15,-40 -15,-40 0,-10 Z" fill="#Fdfbf7" transform="rotate(60)" />
      <path d="M 0,-10 C 15,-40 -15,-40 0,-10 Z" fill="#Fdfbf7" transform="rotate(120)" />
      <path d="M 0,-10 C 15,-40 -15,-40 0,-10 Z" fill="#Fdfbf7" transform="rotate(180)" />
      <path d="M 0,-10 C 15,-40 -15,-40 0,-10 Z" fill="#Fdfbf7" transform="rotate(240)" />
      <path d="M 0,-10 C 15,-40 -15,-40 0,-10 Z" fill="#Fdfbf7" transform="rotate(300)" />
      {/* Orange Center */}
      <circle cx="0" cy="0" r="10" fill="#FF7F00" />
      <circle cx="0" cy="0" r="4" fill="#E65C00" />
    </g>
  </svg>
);

export const FallingFlowers: React.FC = () => {
  const flowers = Array.from({ length: 18 }); // 18 flowers

  return (
    <div className="falling-flowers-container">
      {flowers.map((_, i) => {
        const leftPos = Math.random() * 100; // random start X
        const delay = Math.random() * -20; // random negative delay to stagger immediately
        const duration = 12 + Math.random() * 10; // 12-22s fall
        const size = 0.5 + Math.random() * 0.8; // varied sizes
        const rotationDir = Math.random() > 0.5 ? 1 : -1;
        
        return (
          <div 
            key={i} 
            className="flower-wrapper"
            style={{
              left: `${leftPos}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `scale(${size})`,
              '--rot-dir': rotationDir
            } as React.CSSProperties}
          >
            <ShiuliSvg />
          </div>
        );
      })}
    </div>
  );
};
