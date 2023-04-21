import LoadingComponent from "@/components/LoadingComponent";
import ImageViewModal from "@/components/books/modals/ImageViewModal";
import {
    FONT, FONTS, FONT_SIZE,
    SPACING, MARGINS, WIDTH,
    FORCE_FONT, FORCE_FONT_SIZE, JUSTIFY,
    LAYOUT, LAYOUTS,
    UPDATE_LAST_READ, SettingsProvider
} from "@/components/books/SettingsContext";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function BookLayout({ children }) {
    const [settings, setSettings] = useState({});
    const [readySettings, setReadySettings] = useState(false);

    // Load settings or set defaults
    useEffect(() => {
        const s = {};
        getSettingOrSave(s, FONT, Object.keys(FONTS)[0]);
        getSettingOrSave(s, FONT_SIZE, 19);
        getSettingOrSave(s, FORCE_FONT, true);
        getSettingOrSave(s, FORCE_FONT_SIZE, true);
        getSettingOrSave(s, SPACING, 1.4);
        getSettingOrSave(s, MARGINS, 100);
        getSettingOrSave(s, WIDTH, 1700);
        getSettingOrSave(s, LAYOUT, Object.keys(LAYOUTS)[0]);
        getSettingOrSave(s, JUSTIFY, true);
        getSettingOrSave(s, UPDATE_LAST_READ, true);
        setSettings(s);
        setReadySettings(true);
    }, []);

    function getSettingOrSave(s, key, def) {
        const value = localStorage.getItem(key);
        if (value != null) {
            s[key] = value;
            return;
        }
        localStorage.setItem(key, def);
        s[key] = def;
    }

    function setSetting(key, value) {
        localStorage.setItem(key, value);
        const s = settings;
        s[key] = value;
        setSettings({ ...s });
    }

    // Wait for settings
    if (!readySettings) {
        return (
            <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
                <LoadingComponent/>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Book</title>
            </Head>
            <ImageViewModal/>
            <SettingsProvider value={[settings, setSetting]}>
                {children}
            </SettingsProvider>
        </>
    );
}
