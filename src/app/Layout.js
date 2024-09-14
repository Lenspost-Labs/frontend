import Script from "next/script";
import Head from "next/head";

export const metadata = {
  title: "Poster.fun by Lenspost Labs",
  description: "Your onchain canvas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="icon" type="image/svg+xml" href="/favicon_io/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon_io/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon_io/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon_io/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Poster" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1"
        />
        <link
          href="https://unpkg.com/@blueprintjs/core@5/lib/css/blueprint.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta property="og:title" content="Poster" />
        <meta property="og:description" content="A web3 onchain canvas" />
        <meta property="og:image" content="/OG_logo_1200x630.png" />
        <meta property="og:url" content="https://app.poster.fun" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="app.poster.fun" />
        <meta property="twitter:url" content="https://app.poster.fun" />
        <meta name="twitter:title" content="Poster" />
        <meta name="twitter:description" content="A web3 onchain canvas" />
        <meta
          name="twitter:image"
          content="https://app.poster.fun/OG_logo_1200x630.png"
        />
      </Head>
      <body>
        <div id="root">{children}</div>
        <Script src="https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js" />
        <Script id="posthog-script">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('phc_CvXLACFkyLdhJjiGLxlix6ihbGjumRvGjUFSinPWJYD',{api_host:'https://eu.posthog.com'})
          `}
        </Script>
      </body>
    </html>
  );
}
