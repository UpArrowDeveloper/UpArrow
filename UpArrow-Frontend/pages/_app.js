import React, { useRef } from 'react';
import '../styles/reset.css';
import '../styles/globals.css';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import Script from 'next/script';
import Navbar, { navbarHeight } from '../components/Navbar';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import styled from '@emotion/styled';

const clientSideEmotionCache = createEmotionCache();

const ComponentWrapper = styled.div`
  margin-top: ${navbarHeight};
`;

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  const stockRef = useRef(null);
  const ideaRef = useRef(null);
  const investorRef = useRef(null);
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <CacheProvider value={emotionCache}>
            <Navbar
              stockRef={stockRef}
              ideaRef={ideaRef}
              investorRef={investorRef}
            ></Navbar>
            <ComponentWrapper>
              <Component
                stockRef={stockRef}
                ideaRef={ideaRef}
                investorRef={investorRef}
                {...pageProps}
              />
            </ComponentWrapper>
          </CacheProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
