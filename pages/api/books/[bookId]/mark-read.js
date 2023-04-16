import { checkIntParam, handleUpdateError } from "@/core/utils";
import { markRead } from "@/core/book";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: true, message: 'Wrong method!' });
    }
    const id = checkIntParam(res, req.query.bookId, 'Invalid book id!', { gt: 0 });
    if (!id) {
        return;
    }
    // Mark book as read
    try {
        await markRead(id);
        return res.status(200).json({ success: true });
    } catch (e) {
        return handleUpdateError(res, e, 'Book not found!');
    }
}
