import { Box, Typography } from '@mui/material';
import React from 'react';

export const FormTitle = ({ children }) => {
  return (
    <Box>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ marginTop: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}
      >
        {children ? children : <>&#8203;</>}
      </Typography>
    </Box>
  );
};
