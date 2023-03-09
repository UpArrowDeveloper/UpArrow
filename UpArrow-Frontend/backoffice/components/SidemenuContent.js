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
import { useRouter } from 'next/router';

export const SidemenuContent = () => {
  const router = useRouter();
  const menu = router.asPath.slice('/').at(-1);
  return (
    <List>
      {backofficeConfig.menus.map((text, index) => (
        <ListItem
          key={text}
          disablePadding
          onClick={() => {
            router.push('/backoffice/' + text.toLocaleLowerCase());
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
