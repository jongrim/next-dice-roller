import * as React from 'react';
import Head from 'next/head';

const sum = (x: number, y: number) => x + y;

export default function Home() {
  const [nums, setNums] = React.useState([]);
  const [d6, setD6] = React.useState('');
  const [d8, setD8] = React.useState('');
  const [d10, setD10] = React.useState('');
  const [d12, setD12] = React.useState('');
  const [d20, setD20] = React.useState('');

  const results = nums.reduce(
    (acc, cur) => {
      if (acc.d6.length != d6) {
        acc.d6.push(cur);
      } else if (acc.d8.length != d8) {
        acc.d8.push(cur);
      } else if (acc.d10.length != d10) {
        acc.d10.push(cur);
      } else if (acc.d12.length != d12) {
        acc.d12.push(cur);
      } else if (acc.d20.length != d20) {
        acc.d20.push(cur);
      }
      return acc;
    },
    {
      d6: [],
      d8: [],
      d10: [],
      d12: [],
      d20: [],
    }
  );

  const roll = (e) => {
    e.preventDefault();
    window
      .fetch('/api/random', {
        method: 'POST',
        body: JSON.stringify({
          size: [d6, d8, d10, d12, d20]
            .map((n) => n && Number.parseInt(n, 10))
            .filter(Boolean)
            .reduce(sum, 0),
        }),
      })
      .then((res) => res.json())
      .then(({ nums }) => {
        setNums(nums.data);
      });
  };

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Welcome to Next Dice Roller</h1>
        <section>
          <h2>Dice Selection</h2>
          <form>
            <label htmlFor="d6">Number of d6</label>
            <input
              type="number"
              name="d6"
              id="d6"
              min="1"
              max="20"
              onChange={(e) => setD6(e.target.value)}
              value={d6}
            />
            <label htmlFor="d8">Number of d8</label>
            <input
              type="number"
              name="d8"
              id="d8"
              min="1"
              max="20"
              onChange={(e) => setD8(e.target.value)}
              value={d8}
            />
            <label htmlFor="d10">Number of d10</label>
            <input
              type="number"
              name="d10"
              id="d10"
              min="1"
              max="20"
              onChange={(e) => setD10(e.target.value)}
              value={d10}
            />
            <label htmlFor="d12">Number of d12</label>
            <input
              type="number"
              name="d12"
              id="d12"
              min="1"
              max="20"
              onChange={(e) => setD12(e.target.value)}
              value={d12}
            />
            <label htmlFor="d20">Number of d20</label>
            <input
              type="number"
              name="d20"
              id="d20"
              min="1"
              max="20"
              onChange={(e) => setD20(e.target.value)}
              value={d20}
            />
            <button onClick={roll}>Roll dice</button>
          </form>
        </section>
        <section>
          <h2>Results</h2>
          <h3>D6</h3>
          {results.d6.map((num, i) => (
            <p key={`d6-${i}`}>{(num % 6) + 1}</p>
          ))}
          <h3>D8</h3>
          {results.d8.map((num, i) => (
            <p key={`d8-${i}`}>{(num % 8) + 1}</p>
          ))}
          <h3>D10</h3>
          {results.d10.map((num, i) => (
            <p key={`d10-${i}`}>{(num % 10) + 1}</p>
          ))}
          <h3>D12</h3>
          {results.d12.map((num, i) => (
            <p key={`d12-${i}`}>{(num % 12) + 1}</p>
          ))}
          <h3>D20</h3>
          {results.d20.map((num, i) => (
            <p key={`d20-${i}`}>{(num % 20) + 1}</p>
          ))}
        </section>
      </main>

      <footer>
        <p>
          Made by{' '}
          <a
            href="https://twitter.com/jonjongrim"
            target="blank"
            rel="noreferrer">
            Jon Grim
          </a>{' '}
          for nerds
        </p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        form {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }

        input {
          width: 3rem;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          color: #0070f3;
          text-decoration: none;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
