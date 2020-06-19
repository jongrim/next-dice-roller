import * as React from 'react';
import { Box } from 'rebass';
import { useTheme } from 'emotion-theming';

const CheckSvg = React.forwardRef((props, ref) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        visibility: 'hidden',
        transform: 'scale(0.6, 0.6)',
      }}
      ref={ref}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={theme.colors.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </Box>
  );
});

export default CheckSvg;
