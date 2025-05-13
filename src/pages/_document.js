/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/_document.js
  Summary: Custom Document collecting styled-components styles for SSR
*/

/*──────── imports ────────*/
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

/*──────── impl ───────────*/
export default class ZeroUnboundDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRender = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRender({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initial = await Document.getInitialProps(ctx);
      return {
        ...initial,
        styles: (
          <>
            {initial.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* minimal favicon to silence 404 */}
          <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><rect width=%2216%22 height=%2216%22 fill=%22%23ff5e00%22/></svg>" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

/* What changed & why
   • ServerStyleSheet collects styled-components rules, guaranteeing matching
     classNames on server + client, eliminating hydration warnings.
   • Added inline SVG favicon to stop 404 in dev.
*/
