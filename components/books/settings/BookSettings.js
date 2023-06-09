import SettingsFont from "@/components/books/settings/SettingsFont";
import SettingsFontSize from "@/components/books/settings/SettingsFontSize";
import SettingsSpacing from "@/components/books/settings/SettingsSpacing";
import SettingsMargins from "@/components/books/settings/SettingsMargins";
import SettingsWidth from "@/components/books/settings/SettingsWidth";
import SettingsForceFont from "@/components/books/settings/SettingsForceFont";
import SettingsForceFontSize from "@/components/books/settings/SettingsForceFontSize";
import SettingsFullJustification from "@/components/books/settings/SettingsFullJustification";
import SettingsLayouts from "@/components/books/settings/SettingsLayouts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export default function BookSettings() {
    return (
        <div className="dropdown">
            <button className="btn btn-icon btn-outline-secondary" type="button" id="settings-dropdown"
                    data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded={false}>
                <FontAwesomeIcon icon={faGear} width={16} height={16}/>
            </button>
            <div className="dropdown-menu" aria-labelledby="settings-dropdown" style={{ width: "300px" }}>
                <SettingsFont/>
                <SettingsFontSize/>
                <SettingsSpacing/>
                <SettingsMargins/>
                <SettingsWidth/>
                <SettingsForceFont/>
                <SettingsForceFontSize/>
                <SettingsFullJustification/>
                <SettingsLayouts/>
            </div>
        </div>
    );
}
