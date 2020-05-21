import * as React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'emotion-theming';
import theme from './theme.json';
import './App.css';
import '@reach/dialog/styles.css';
import 'react-tippy/dist/tippy.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <Component {...pageProps} />
        <style jsx>{`
          .container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            height: 100%;
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
