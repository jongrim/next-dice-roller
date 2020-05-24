import * as React from 'react';
import { Link, Flex } from 'rebass';

const Footer: React.FC = () => (
  <Flex
    as="footer"
    bg="background"
    height="100px"
    justifyContent="center"
    alignItems="center"
    width="100%"
    sx={{
      zIndex: 2,
      boxShadow: `0 -0.3px 2.2px rgba(0, 0, 0, 0.02),
  0 -0.7px 5.3px rgba(0, 0, 0, 0.028),
  0 -1.3px 10px rgba(0, 0, 0, 0.035),
  0 -2.2px 17.9px rgba(0, 0, 0, 0.042),
  0 -4.2px 33.4px rgba(0, 0, 0, 0.05),
  0 -10px 80px rgba(0, 0, 0, 0.07)`,
    }}
  >
    <p>
      Made by{' '}
      <Link
        href="https://twitter.com/jonjongrim"
        target="blank"
        rel="noreferrer"
      >
        Jon Grim
      </Link>{' '}
      for nerds
    </p>
  </Flex>
);

export default Footer;
