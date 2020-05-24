import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            data-goatcounter="https://rollwithme.goatcounter.com/count"
            async
            src="//gc.zgo.at/count.js"
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
