import React from 'react';
import '../styles/reset.css';
import '../styles/globals.css';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import createEmotionCache from '../src/createEmotionCache';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Popup } from '../components/Popup';

const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Hydrate state={pageProps.dehydratedState}>
          <CacheProvider value={emotionCache}>
            <Component {...pageProps} />
            <Popup />
          </CacheProvider>
        </Hydrate>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
