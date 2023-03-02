import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import React from 'react';
import backofficeConfig from '../config';
import { useRecoilState } from 'recoil';
import { menuState } from '../store';

export const SidemenuContent = () => {
  const [menu, setMenu] = useRecoilState(menuState);
  return (
    <List>
      {backofficeConfig.menus.map((text, index) => (
        <ListItem
          key={text}
          disablePadding
          onClick={() => {
            setMenu(text);
          }}
        >
          <ListItemButton selected={menu === text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
