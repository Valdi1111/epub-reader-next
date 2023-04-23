import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeContext";
import ThemeChangeModal from "@/components/library/modals/theme/ThemeChangeModal";

export default function UniversalLayout({ session, children, theme, setTheme }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <SessionProvider session={session}>
                <ThemeProvider value={[theme, setTheme]}>
                    <ThemeChangeModal/>
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </>
    );
}
