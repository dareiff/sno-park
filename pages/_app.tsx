import React from 'react';
import PlausibleProvider from "next-plausible";

import type { AppProps } from "next/app";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <PlausibleProvider
            domain="sno-park.site"
            selfHosted={true}
            customDomain="https://io.fun-club.xyz"
        >
            <Component {...pageProps} />
        </PlausibleProvider>
    );
}
