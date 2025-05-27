import React from 'react';
import { Box } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { keyframes } from '@mui/system';

const scanLine = keyframes`
  0% { top: 0%; opacity: 0.9; }
  50% { top: 100%; opacity: 0.3; }
  100% { top: 0%; opacity: 0.9; }
`;

const maskAnimation = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 0% 100%; }
  100% { background-position: 0% 0%; }
`;

const cornerStyle = {
  position: 'absolute' as const,
  width: '10px',
  height: '10px',
  border: '2px solid #00ffff',
};

const FingerprintScanner: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 60,
        height: 60,
        marginRight: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Masked Glow Box */}
      <Box
        sx={{
          position: 'absolute',
          zIndex: 1,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,1) 20%, transparent 80%)',
          filter: 'blur(4px)',
          animation: `${maskAnimation} 2s linear infinite`,
          backgroundSize: '100% 200%',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Fingerprint Icon with dimming effect via background mask */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        <FingerprintIcon sx={{ fontSize: 32, color: '#00ffff' }} />
        {/* Dimmer overlay to simulate glow off while scan passes */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 30%, transparent 70%, rgba(0,0,0,0.5))',
            animation: `${maskAnimation} 2s linear infinite`,
            backgroundSize: '100% 200%',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      </Box>

      {/* Scan Line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 14,
          right: 14,
          height: '2px',
          background: 'rgba(0, 255, 255, 0.8)',
          animation: `${scanLine} 2s linear infinite`,
          zIndex: 4,
        }}
      />

      {/* Corner Borders */}
      <Box sx={{ ...cornerStyle, top: 0, left: 0, borderRight: 'none', borderBottom: 'none' }} />
      <Box sx={{ ...cornerStyle, top: 0, right: 0, borderLeft: 'none', borderBottom: 'none' }} />
      <Box sx={{ ...cornerStyle, bottom: 0, left: 0, borderRight: 'none', borderTop: 'none' }} />
      <Box sx={{ ...cornerStyle, bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' }} />
    </Box>
  );
};

export default FingerprintScanner;
