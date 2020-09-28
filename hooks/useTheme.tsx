import * as React from 'react';
import lightTheme from '../pages/theme.json';
import darkTheme from '../pages/darkTheme.json';

export default function useTheme() {
  const [theme, setTheme] = React.useState<{ label: string; value: object }>({
    label: 'light',
    value: lightTheme,
  });

  const toggleTheme = () =>
    setTheme((curTheme) => {
      if (curTheme.label === 'light') {
        return { label: 'dark', value: darkTheme };
      }
      return { label: 'light', value: lightTheme };
    });

  React.useLayoutEffect(() => {
    const userTheme = window.localStorage.getItem('theme');
    if (!userTheme) {
      // user doesn't have a set theme, so use system preference
      const mqList = window.matchMedia('(prefers-color-scheme: dark)');
      if (mqList.matches) {
        setTheme({ label: 'dark', value: darkTheme });
      }
    }
    if (userTheme === 'dark') {
      setTheme({ label: 'dark', value: darkTheme });
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem('theme', theme.label);
  }, [theme]);

  return { theme, toggleTheme };
}
