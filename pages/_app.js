import '@/styles/custom.scss'
import { useEffect, useState } from "react";
import Head from "next/head";
import {
    FONT,
    FONT_SIZE, FONTS,
    FORCE_FONT,
    FORCE_FONT_SIZE, JUSTIFY,
    LAYOUT, LAYOUTS,
    MARGINS,
    SPACING,
    THEME, THEMES,
    WIDTH
} from "@/components/Settings";
import LoadingComponent from "@/components/LoadingComponent";

export default function App({ Component, pageProps }) {
    const [settings, setSettings] = useState({});
    const [readySettings, setReadySettings] = useState(false);

    // Load settings
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
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
            {Component.getLayout(settings, setSetting, Component, pageProps)}
        </>
    );
}
