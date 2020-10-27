import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { ThemeProvider } from 'emotion-theming';
import { Box, Text } from 'rebass';
import trophyDarkTheme from '../pages/trophyDarkTheme.json';

function Providers({ children }) {
  return (
    <ThemeProvider theme={trophyDarkTheme}>
      <Box backgroundColor="background">{children}</Box>
    </ThemeProvider>
  );
}

export default {
  title: 'Trophy Dark/Header',
  component: Providers,
} as Meta;

export const ThemedText = () => (
  <Providers>
    <Text color="text">testing</Text>
  </Providers>
);
