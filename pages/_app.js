import '@/styles/custom.scss'
import LoadingComponent from "@/components/LoadingComponent";
import SettingsContext from "@/components/SettingsContext";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    FONT,
    FONT_SIZE, FONTS,
    FORCE_FONT,
    FORCE_FONT_SIZE, JUSTIFY,
    LAYOUT, LAYOUTS,
    MARGINS,
    SPACING,
    THEME, THEMES, UPDATE_LAST_READ,
    WIDTH
} from "@/components/Settings";
import Head from "next/head";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    const [settings, setSettings] = useState({});
    const [readySettings, setReadySettings] = useState(false);

    // Load settings
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min");
        const s = {};
        getSettingOrSave(s, FONT, Object.keys(FONTS)[0]);
        getSettingOrSave(s, FONT_SIZE, 19);
        getSettingOrSave(s, FORCE_FONT, true);
        getSettingOrSave(s, FORCE_FONT_SIZE, true);
        getSettingOrSave(s, SPACING, 1.4);
        getSettingOrSave(s, MARGINS, 100);
        getSettingOrSave(s, WIDTH, 1700);
        getSettingOrSave(s, THEME, Object.keys(THEMES)[0]);
        getSettingOrSave(s, LAYOUT, Object.keys(LAYOUTS)[0]);
        getSettingOrSave(s, JUSTIFY, true);
        getSettingOrSave(s, UPDATE_LAST_READ, true);
        setSettings(s);
        setReadySettings(true);
    }, []);

    function getSettingOrSave(s, key, def) {
        const value = window.localStorage.getItem(key);
        if (value != null) {
            s[key] = value;
            return;
        }
        window.localStorage.setItem(key, def);
        s[key] = def;
    }

    function setSetting(key, value) {
        window.localStorage.setItem(key, value);
        const s = settings;
        s[key] = value;
        setSettings({ ...s });
    }

    useEffect(() => {
        if (!settings[THEME]) {
            return;
        }
        const elem = document.getElementsByTagName('html')
        if (!elem || elem.length !== 1) {
            return;
        }
        elem[0].setAttribute('data-theme', settings[THEME]);
    }, [settings[THEME]]);

    // Wait for settings
    if (!readySettings) {
        return (
            <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
                <LoadingComponent/>
            </div>
        );
    }

    // Use the layout defined at the page level, if available
    if (!Component.getLayout) {
        return <Component {...pageProps} />
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <SessionProvider session={session}>
                <SettingsContext.Provider value={[settings, setSetting]}>
                    {Component.getLayout(Component, pageProps)}
                </SettingsContext.Provider>
            </SessionProvider>
        </>
    );
}
