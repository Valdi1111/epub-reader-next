import ModalSections from "@/components/library/modals/add/ModalSections";
import { useEffect, useRef, useState } from "react";
import { findNewBooks } from "@/api/library";
import { createBook } from "@/api/book";

export const PREFIX = 'book-add-modal';
export const CHECKBOX_NAME = PREFIX + '-select-book';

export default function BookAddModal({ update }) {
    const [content, setContent] = useState({});
    const [selected, setSelected] = useState(0);
    const modal = useRef();

    useEffect(() => {
        modal.current.addEventListener("show.bs.modal", (e) => {
            findNewBooks().then(
                res => setContent(res.data),
                err => console.error(err)
            );
        });
        modal.current.addEventListener("hidden.bs.modal", (e) => {
            setContent({});
            setSelected(0);
        });
    }, []);

    function updateSelected() {
        const elems = modal.current.querySelectorAll(`div.modal-body input[name='${CHECKBOX_NAME}']:checked`);
        setSelected(elems.length);
    }

    function confirm() {
        const elems = modal.current.querySelectorAll(`div.modal-body input[name='${CHECKBOX_NAME}']:checked`);
        if (elems.length === 0) {
            // TODO prevent close with zero elements selected or send toast error
            return;
        }
        for (let i = 0; i < elems.length; i++) {
            createBook(elems[i].value).then(
                data => {
                    console.log("Book", data.id, "Created successfully!");
                    update(data);
                },
                err => console.error(err)
            );
        }
    }

    return (
        <div className="modal fade" id="book-add-modal" tabIndex={-1} aria-hidden={true}
             aria-labelledby="book-add-modal-label" ref={modal}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="book-add-modal-label">Add books to Library</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div id="book-add-modal-accordion" className="modal-body p-0 accordion accordion-flush">
                        <ModalSections content={content} update={updateSelected}/>
                    </div>
                    <div className="modal-footer">
                        <p className="me-auto">{selected} items selected</p>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={confirm}>
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
