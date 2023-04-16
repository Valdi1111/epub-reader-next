import Link from "next/link";

/**
 * Dropdown menu - go to shelf
 * @param shelf_id
 * @returns {JSX.Element}
 * @constructor
 */
export default function ItemGoToShelf({ shelf_id }) {
    if (!shelf_id) {
        return <></>;
    }
    return (
        <li>
            <Link href={`/library/shelves/${shelf_id}`} className="dropdown-item">Go to shelf</Link>
        </li>
    );
}
