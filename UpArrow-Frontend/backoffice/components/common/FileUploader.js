import { Box, Button } from '@mui/material';
import React from 'react';
import FilePreview from '../../../components/common/FilePreview';

export const FileUploader = ({ name, file, url, setImage, onChange }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '10rem' }}>
      <div style={{ marginBottom: '0.4rem' }}>
        <FilePreview file={file} url={url} />
      </div>
      <Button variant='contained' component='label'>
        Upload File
        <input
          type='file'
          id={name}
          name={name}
          hidden
          onChange={(e) => {
            setImage?.(e.target.files[0]);
            onChange?.(e);
          }}
        />
      </Button>
    </Box>
  );
};
