import { THEME, ThemeProvider, THEMES } from "@/components/ThemeContext";
import LoadingComponent from "@/components/LoadingComponent";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import "@/styles/custom.scss";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    const [theme, setTheme] = useState('');

    // Load theme or set default
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min");
        setTheme(localStorage.getItem(THEME) || Object.keys(THEMES)[0]);
    }, []);

    useEffect(() => {
        if (!theme) {
            return;
        }
        localStorage.setItem(THEME, theme);
        const elem = document.getElementsByTagName('html')
        if (!elem || elem.length !== 1) {
            return;
        }
        elem[0].setAttribute('data-bs-theme', theme);
    }, [theme]);

    // Wait for theme
    if (!theme) {
        return (
            <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
                <LoadingComponent/>
            </div>
        );
    }

    // Use the layout defined at the page level, if available
    if (!Component.getLayout) {
        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                </Head>
                <SessionProvider session={session}>
                    <ThemeProvider value={[theme, setTheme]}>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </SessionProvider>
            </>
        );
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <SessionProvider session={session}>
                <ThemeProvider value={[theme, setTheme]}>
                    {Component.getLayout(Component, pageProps)}
                </ThemeProvider>
            </SessionProvider>
        </>
    );
}
