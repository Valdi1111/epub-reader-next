import LibraryHeader from "@/components/library/header/LibraryHeader";
import BookAddModal from "@/components/library/modals/add/BookAddModal";
import BookInfoModal from "@/components/library/modals/BookInfoModal";
import BookRecreateModal from "@/components/library/modals/BookRecreateModal";
import BookDeleteModal from "@/components/library/modals/BookDeleteModal";
import ThemeChangeModal from "@/components/library/modals/theme/ThemeChangeModal";
import { cloneElement, useState } from "react";

export default function LibraryLayout({ children }) {
    const [update, setUpdate] = useState({});

    function onBookAdd(data) {
        setUpdate({ add: { id: data.id, shelf: data.shelf_id } });
    }

    function onBookRecreate(data) {
        setUpdate({ recreate: { id: data.id } });
    }

    function onBookDelete(id) {
        setUpdate({ delete: { id } });
    }

    return (
        <>
            <BookAddModal update={onBookAdd}/>
            <BookInfoModal/>
            <BookRecreateModal update={onBookRecreate}/>
            <BookDeleteModal update={onBookDelete}/>
            <ThemeChangeModal/>
            <div className="d-flex flex-column min-vh-100">
                <LibraryHeader/>
                {cloneElement(children, { onUpdate: update })}
            </div>
        </>
    )
}
