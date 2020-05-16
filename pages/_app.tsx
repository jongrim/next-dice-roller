import * as React from 'react';
import { AppProps } from 'next/app';
import Footer from '../components/Footer';
import { ThemeProvider } from 'emotion-theming';
import theme from './theme.json';
import './App.css';
import '@reach/dialog/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <Component {...pageProps} />
        <Footer />
        <style jsx>{`
          .container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
