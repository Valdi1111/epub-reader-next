import { markRead, markUnread } from "@/api/book";

/**
 * Dropdown menu - mark as read/unread
 * @param {int} id
 * @param {int} page
 * @param {function} setRead
 * @param {function} setUnread
 * @returns {JSX.Element}
 * @constructor
 */
export default function ItemReadToggle({ id, page, setRead, setUnread }) {
    const unread = () => markUnread(id).then(res => setUnread());
    const read = () => markRead(id).then(res => setRead());
    if (page === -1) {
        return (
            <li className="cursor-pointer">
                <span className="dropdown-item" onClick={unread}>Mark as Unread</span>
            </li>
        );
    }
    return (
        <li className="cursor-pointer">
            <span className="dropdown-item" onClick={read}>Mark as Read</span>
        </li>
    );
}
