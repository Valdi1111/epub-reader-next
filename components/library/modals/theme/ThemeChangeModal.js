import ModalTheme from "@/components/library/modals/theme/ModalTheme";
import { useEffect, useRef, useState } from "react";
import { THEME, THEMES } from "../../../Settings";

export const PREFIX = 'theme-modal';
export const CHECKBOX_NAME = PREFIX + '-select-theme';

export default function ThemeChangeModal({ settings, setSetting }) {
    const modal = useRef();
    const [themes, setThemes] = useState({});

    useEffect(() => {
        modal.current.addEventListener("show.bs.modal", (e) => {
            setThemes(THEMES);
        });
        modal.current.addEventListener("hidden.bs.modal", (e) => {
            setThemes({});
        });
    }, []);

    function confirm() {
        const theme = modal.current.querySelector(`div.modal-body input[name='${CHECKBOX_NAME}']:checked`);
        setSetting(THEME, theme.value);
    }

    return (
        <div className="modal fade" id="theme-change-modal" tabIndex={-1} aria-hidden={true}
             aria-labelledby="theme-change-modal-label" ref={modal}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="theme-change-modal-label">Change theme</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        {Object.entries(themes).map(([id, value]) =>
                            <ModalTheme key={id} settings={settings} id={id} name={value.name}/>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={confirm}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
