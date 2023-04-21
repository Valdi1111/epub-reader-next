import SettingsContext from "@/components/SettingsContext";
import { FORCE_FONT } from "../../Settings";
import { useContext } from "react";

export default function SettingsForceFont() {
    const [settings, setSetting] = useContext(SettingsContext);

    function forceFont(e) {
        setSetting(FORCE_FONT, e.target.checked ? "true" : "false");
    }

    return (
        <div className="row mx-0 mb-2">
            <div className="col">
                <div className="form-check">
                    <input id="input-force-font" className="form-check-input" type="checkbox" onChange={forceFont}
                           defaultChecked={settings[FORCE_FONT] === "true"}/>
                    <label className="form-check-label w-100" htmlFor="input-force-font">Force font</label>
                </div>
            </div>
        </div>
    );
}
