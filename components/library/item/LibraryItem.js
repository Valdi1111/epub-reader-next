import ItemCover from "@/components/library/item/ItemCover";
import ItemProgress from "@/components/library/item/ItemProgress";
import ItemGoToShelf from "@/components/library/item/ItemGoToShelf";
import ItemAbout from "@/components/library/item/ItemAbout";
import ItemReadToggle from "@/components/library/item/ItemReadToggle";
import ItemInvalidate from "@/components/library/item/ItemInvalidate";
import ItemRemove from "@/components/library/item/ItemRemove";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function LibraryItem(props) {
    const { id, shelf_id, url } = props.book;
    const { cover } = props.book.book_cache;
    const { title, creator } = props.book.book_metadata;
    const { total } = props.book.book_progress;
    const [page, setPage] = useState(props.book.book_progress.page);

    function setRead(val) {
        setPage(val ? -1 : 0);
    }

    return (
        <div className="col-auto p-2">
            <div className="d-flex flex-column" style={{ width: "150px" }}>
                <ItemCover id={id} cover={cover} title={title} creator={creator}/>
                <div className="d-flex flex-row justify-content-between align-items-center mt-1">
                    <ItemProgress page={page} total={total}/>
                    <div className="dropdown">
                        <button type="button" id="book-other" className="btn btn-outline-secondary px-2 py-0"
                                data-bs-toggle="dropdown" aria-expanded={false}>
                            <FontAwesomeIcon icon={faEllipsis} width={16} height={16}/>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end min-width-0" aria-labelledby="book-other">
                            <ItemGoToShelf shelf_id={shelf_id}/>
                            <ItemAbout id={id} url={url} cover={cover}/>
                            <ItemReadToggle id={id} page={page} setRead={setRead}/>
                            <ItemInvalidate id={id} url={url} title={title}/>
                            <ItemRemove id={id} title={title}/>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
