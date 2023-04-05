import axios from 'axios';
import { env } from '../config';

export const getUploadUrl = async (image, originUrl) => {
  if (image) {
    const formData = new FormData();
    formData.append('image', image);
    const { link } = (
      await axios.post(`${env.serverUrl}/file/upload`, formData)
    ).data;
    return link;
  }
  if (originUrl) {
    return originUrl;
  }

  console.log('unwork');
};
