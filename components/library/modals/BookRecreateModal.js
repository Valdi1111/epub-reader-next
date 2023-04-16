import { useEffect, useRef, useState } from "react";
import { recreateBookCache } from "@/api/book";

export default function BookRecreateModal({ update }) {
    const [id, setId] = useState(null);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const btn = useRef();
    const modal = useRef();

    useEffect(() => {
        modal.current.addEventListener("show.bs.modal", (e) => {
            setId(e.relatedTarget.getAttribute("data-bs-id"));
            setTitle(e.relatedTarget.getAttribute("data-bs-title"));
            setUrl(e.relatedTarget.getAttribute("data-bs-url"));
        });
        modal.current.addEventListener("shown.bs.modal", (e) => {
            btn.current.focus();
        });
        modal.current.addEventListener("hidden.bs.modal", (e) => {
            setId(null);
            setTitle("");
            setUrl("");
        });
    }, []);

    function confirm() {
        if (id === null) {
            return;
        }
        recreateBookCache(url, id).then(
            data => {
                console.log("Book", data.id, "Cache recreated successfully!");
                update(data);
            },
            err => console.error(err)
        );
    }

    return (
        <div className="modal fade" id="book-invalidate-modal" tabIndex={-1} aria-hidden={true}
             aria-labelledby="book-invalidate-modal-label" ref={modal}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="book-invalidate-modal-label">Confirm cache recreation</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        <h6>{title}</h6>
                        <p className="mb-0">Are you sure you want to recreate the cache for this book?</p>
                        <p>This process cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={confirm}
                                ref={btn}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
