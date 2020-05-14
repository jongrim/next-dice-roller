import * as React from 'react';
import Router from 'next/router';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Roll Together</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Roll Together</h1>
        <button
          onClick={() => {
            window
              .fetch('/api/new-room', { method: 'POST' })
              .then((res) => res.json())
              .then(({ name }) => {
                Router.push(`/room/${name}`);
              });
          }}>
          Make a new room
        </button>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
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
      `}</style>
    </div>
  );
}
