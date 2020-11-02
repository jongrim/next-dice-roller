import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'emotion-theming';
import theme from './theme.json';
import Amplify from 'aws-amplify';
import config from '../src/aws-exports';
import '@reach/dialog/styles.css';
import 'react-tippy/dist/tippy.css';
import './App.css';

// handle redirect URI for local vs deployed
const isLocalhost = process.env.NODE_ENV === 'development';

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
// https://docs.amplify.aws/lib/auth/social/q/platform/js#amazon-cognito-user-pool-setup
const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = config.oauth.redirectSignIn.split(',');

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = config.oauth.redirectSignOut.split(',');

const updatedAwsConfig = {
  ...config,
  oauth: {
    ...config.oauth,
    redirectSignIn: isLocalhost
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isLocalhost
      ? localRedirectSignOut
      : productionRedirectSignOut,
  },
};

Amplify.configure({
  ...updatedAwsConfig,
  ssr: true,
});

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Roll With Me</title>
        <link rel="icon" href="/TheR.png" />
      </Head>
      <div className="container">
        <Component {...pageProps} />
        <style jsx>{`
          .container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
