import LoadingComponent from "@/components/LoadingComponent";
import UniversalLayout from "@/components/UniversalLayout";
import { THEME, THEMES } from "@/components/ThemeContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
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
            <UniversalLayout session={session} theme={theme} setTheme={setTheme}>
                <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
                    <LoadingComponent/>
                </div>
            </UniversalLayout>
        );
    }

    // Use the layout defined at the page level, if available
    if (!Component.getLayout) {
        return (
            <UniversalLayout session={session} theme={theme} setTheme={setTheme}>
                <Component {...pageProps} />
            </UniversalLayout>
        );
    }

    return (
        <UniversalLayout session={session} theme={theme} setTheme={setTheme}>
            {Component.getLayout(Component, pageProps)}
        </UniversalLayout>
    );
}

export async function getServerSideProps({ req, res }) {
    return {
        props: {
            session: await getServerSession(req, res, authOptions)
        }
    }
}
