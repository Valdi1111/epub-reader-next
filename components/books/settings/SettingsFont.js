import { FONT, FONTS, useSettings } from "@/components/books/SettingsContext";

export default function SettingsFont() {
    const [settings, setSetting] = useSettings();

    function font(e) {
        setSetting(FONT, e.target.value);
    }

    return (
        <div className="row mx-0 mb-2">
            <label className="col-4 col-form-label" htmlFor="input-font">Font</label>
            <div className="col-8">
                <select id="input-font" className="form-select" defaultValue={settings[FONT]} onChange={font}>
                    {Object.entries(FONTS).map(([id, value]) =>
                        <option key={id} value={id}>{value}</option>
                    )}
                </select>
            </div>
        </div>
    );
}
