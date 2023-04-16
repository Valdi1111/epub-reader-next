import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function BookFooter({ chapter, section, location, percentage, left, right }) {
    function chapterLabel() {
        return chapter === null ? "" : chapter.label;
    }

    function sectionLabel() {
        return section === null ? "" : `${section.current + 1} of ${section.total}`;
    }

    function locationLabel() {
        return location === null ? "" : `${location.current + 1} of ${location.total}`;
    }

    function percentageLabel() {
        return percentage === null ? "" : `${Math.round(percentage * 100)}%`;
    }

    return (
        <footer className="p-2 border-top d-flex flex-row align-items-center">
            <button className="btn btn-icon btn-outline-secondary" onClick={left}>
                <FontAwesomeIcon icon={faAngleLeft} width={16} height={16}/>
            </button>
            <p id="book-location" className="col mb-0 text-center text-truncate px-2">
                {locationLabel()}
            </p>
            <p id="book-chapter" className="d-none d-md-block col mb-0 text-center text-truncate px-2"
               title={chapterLabel()}>
                {chapterLabel()}
            </p>
            <button className="btn btn-icon btn-outline-secondary" onClick={right}>
                <FontAwesomeIcon icon={faAngleRight} width={16} height={16}/>
            </button>
        </footer>
    );
}
