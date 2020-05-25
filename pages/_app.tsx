import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'emotion-theming';
import theme from './theme.json';
import '@reach/dialog/styles.css';
import 'react-tippy/dist/tippy.css';
import './App.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Roll With Me</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="container">
        <Component {...pageProps} />
        <style jsx>{`
          .container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            height: 100%;
            align-items: center;
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
