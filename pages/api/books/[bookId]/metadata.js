import { checkIntParam, handleError } from "@/core/utils";
import { getMetadata } from "@/core/book";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: true, message: 'Wrong method!' });
    }
    const id = checkIntParam(res, req.query.bookId, 'Invalid book id!', { gt: 0 });
    if (!id) {
        return;
    }
    // Get book metadata
    try {
        const metadata = await getMetadata(id);
        if (!metadata) {
            return res.status(400).json({ error: true, message: 'Book not found!' });
        }
        return res.status(200).json(metadata);
    } catch (e) {
        return handleError(res, e);
    }
}
