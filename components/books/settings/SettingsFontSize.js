import { FONT_SIZE, FONT_SIZES, useSettings } from "@/components/books/SettingsContext";

export default function SettingsFontSize() {
    const [settings, setSetting] = useSettings();

    function fontSize(e) {
        setSetting(FONT_SIZE, e.target.value);
    }

    return (
        <div className="row mx-0 mb-2">
            <label className="col-4 col-form-label" htmlFor="input-font-size">Font size</label>
            <div className="col-8">
                <select id="input-font-size" className="form-select" defaultValue={settings[FONT_SIZE]}
                        onChange={fontSize}>
                    {FONT_SIZES.map(i =>
                        <option key={i} value={i}>{i}</option>
                    )}
                </select>
            </div>
        </div>
    );
}
