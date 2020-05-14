import * as React from 'react';

const Footer: React.FC = () => (
  <footer>
    <p>
      Made by{' '}
      <a href="https://twitter.com/jonjongrim" target="blank" rel="noreferrer">
        Jon Grim
      </a>{' '}
      for nerds
    </p>
    <style jsx>{`
      footer {
        width: 100%;
        height: 100px;
        border-top: 1px solid #eaeaea;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: auto;
      }

      footer img {
        margin-left: 0.5rem;
      }

      footer a {
        color: #0070f3;
        text-decoration: none;
      }

      footer a:hover,
      footer a:focus,
      footer a:active {
        text-decoration: underline;
      }
    `}</style>
  </footer>
);

export default Footer;
