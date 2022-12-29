import React, { useRef } from 'react';
import '../styles/reset.css';
import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
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
            <UserProvider>
              <Head>
                <Script
                  src='https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js'
                  integrity='sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl'
                  crossOrigin='anonymous'
                ></Script>
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                  rel='preconnect'
                  href='https://fonts.gstatic.com'
                  crossOrigin
                />
                <link
                  href='https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Merriweather&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Quicksand:wght@300&family=Sacramento&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap'
                  rel='stylesheet'
                ></link>
              </Head>
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
            </UserProvider>
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
