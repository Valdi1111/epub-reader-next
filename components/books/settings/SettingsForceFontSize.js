import { FORCE_FONT_SIZE, useSettings } from "@/components/books/SettingsContext";

export default function SettingsForceFontSize() {
    const [settings, setSetting] = useSettings();

    function forceFontSize(e) {
        setSetting(FORCE_FONT_SIZE, e.target.checked ? "true" : "false");
    }

    return (
        <div className="row mx-0 mb-2">
            <div className="col">
                <div className="form-check">
                    <input id="input-force-font-size" className="form-check-input" type="checkbox"
                           defaultChecked={settings[FORCE_FONT_SIZE] === "true"} onChange={forceFontSize}/>
                    <label className="form-check-label w-100" htmlFor="input-force-font-size">Force font size</label>
                </div>
            </div>
        </div>
    );
}
