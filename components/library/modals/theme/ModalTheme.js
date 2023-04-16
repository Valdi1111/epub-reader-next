import { CHECKBOX_NAME, PREFIX } from "@/components/library/modals/theme/ThemeChangeModal";
import { THEME } from "@/components/Settings";

export default function ModalTheme({settings, id, name}) {
    const item = `${PREFIX}-theme-${id}`;

    return (
        <div className="form-check">
            <input className="form-check-input" type="radio" id={item} name={CHECKBOX_NAME} value={id}
                   defaultChecked={settings[THEME] === id}/>
            <label className="w-100 form-check-label" htmlFor={item}>{name}</label>
        </div>
    );
}
