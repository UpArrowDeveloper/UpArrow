import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

export const useConfig = (initConfig) => {
  const [config, setConfig] = useState(initConfig);
  const [loading, setLoading] = useState(false);
  const getConfig = async () => {
    setLoading(true);
    try {
      const config = (
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/config`)
      ).data;
      setConfig(config);
    } catch (err) {
      console.error(`get config error : ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!config) {
      getConfig();
    }
  }, []);

  return { config, loading, getConfig };
};
