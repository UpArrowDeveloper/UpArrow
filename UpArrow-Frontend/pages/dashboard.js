import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Button from '@material-ui/core/Button';

export default function Dashboard() {
  return (
    <div>
      {/* <ResponsiveAppBar /> */}

      <Box
        sx={{
          width: 1000,
          display: 'flex',
          alignItems: 'center',
        }}
        pl={5}
      >
        <Typography variant='h6'>
          <strong> What other investors think about stocks </strong>
        </Typography>
      </Box>
      <br />
      <br />
      <div></div>
      <form>
        <Button type='submit' color='secondary' variant='contained'>
          Submit
        </Button>
      </form>
      <br />
      <br />
      <Typography align='center' style={{ color: '#459BF2' }} variant='h5'>
        What’s your decision?
      </Typography>
      <br />
      <br />
      <br />
      <br />
      <Box textAlign='center'></Box>
    </div>
  );
}
