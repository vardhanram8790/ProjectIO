import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarLoader } from 'react-spinners';

const BarLoaderWrapper = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
    >
      <BarLoader color="#1976d2" height={4} width={150} />
      <Typography variant="body1" color="text.secondary" mt={2}>
        Loading...
      </Typography>
    </Box>
  );
};

export default BarLoaderWrapper;
