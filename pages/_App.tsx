import * as React from 'react';
import { AppProps } from 'next/app';
import Footer from '../components/Footer';
import './App.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Component {...pageProps} />
      <Footer />
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}

export default MyApp;
