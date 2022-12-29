import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';

const ArgumentBox = (props) => {
  var argumentList = [];
  if (props.isPro == true) {
    argumentList = props.pros;
  } else {
    argumentList = props.cons;
  }
  return (
    <div>
      <List
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          maxHeight: 300,
          '& ul': { padding: 0 },
        }}
        subheader={<li />}
      >
        <ul>
          {argumentList.map((argument) => (
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary={`${argument}`} />
              <Divider />
            </ListItem>
          ))}
        </ul>
      </List>
    </div>
  );
};

export default ArgumentBox;
