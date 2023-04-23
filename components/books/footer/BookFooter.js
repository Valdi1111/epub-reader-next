import BookChapter from "@/components/books/footer/BookChapter";
import BookLocation from "@/components/books/footer/BookLocation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function BookFooter({ chapter, section, location, percentage, prev, next }) {
    return (
        <footer className="p-2 border-top d-flex flex-row align-items-center">
            <button className="btn btn-icon btn-outline-secondary" onClick={prev}>
                <FontAwesomeIcon icon={faAngleLeft} width={16} height={16}/>
            </button>
            <BookLocation location={location}/>
            <BookChapter chapter={chapter}/>
            <button className="btn btn-icon btn-outline-secondary" onClick={next}>
                <FontAwesomeIcon icon={faAngleRight} width={16} height={16}/>
            </button>
        </footer>
    );
}
