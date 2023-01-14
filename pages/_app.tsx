import "../styles/globals.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";

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
