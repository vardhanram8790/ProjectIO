import React from 'react';
import { Box, Typography } from '@mui/material';

const CircleRingLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#fdfdfd"
    >
      <Box position="relative" width={100} height={100}> {/* Reduced size */}
        <span data-loader="logo-circle" />
      </Box>

      <Typography mt={2} variant="h6" fontWeight="bold" color="primary" fontSize="16px">
        Loading...
      </Typography>

      <style>{`
        [data-loader] {
          margin: 8px;
        }

        [data-loader='logo-circle'] {
          width: 40px;  /* Reduced size */
          height: 40px; /* Reduced size */
          animation: circle 0.75s linear infinite;
          border: 4px solid #1e3a8a;  /* Blue border color */
          border-top-color: transparent;
          border-radius: 50%;
          display: block;
          margin: auto;
        }

        @keyframes circle {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default CircleRingLoader;
