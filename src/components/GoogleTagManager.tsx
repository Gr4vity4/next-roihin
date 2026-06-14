import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T9LXPJDT'

// Loader script — rendered as high in the <head> as possible.
export function GoogleTagManagerScript() {
  if (!GTM_ID) {
    return null
  }

  return (
    <Script id="google-tag-manager" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  )
}

// noscript fallback — rendered immediately after the opening <body> tag.
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
