import SettingsContext from "@/components/SettingsContext";
import { JUSTIFY } from "../../Settings";
import { useContext } from "react";

export default function SettingsFullJustification() {
    const [settings, setSetting] = useContext(SettingsContext);

    function justify(e) {
        setSetting(JUSTIFY, e.target.checked ? "true" : "false");
    }

    return (
        <div className="row mx-0 mb-2">
            <div className="col">
                <div className="form-check">
                    <input id="input-justify" className="form-check-input" type="checkbox" onChange={justify}
                           defaultChecked={settings[JUSTIFY] === "true"}/>
                    <label className="form-check-label w-100" htmlFor="input-justify">Full Justification</label>
                </div>
            </div>
        </div>
    );
}
