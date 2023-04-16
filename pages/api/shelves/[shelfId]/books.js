import { getShelf, getShelfContent } from "@/core/shelves";
import { checkIntParam, handleError } from "@/core/utils";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: true, message: 'Wrong method!' });
    }
    const id = checkIntParam(res, req.query.shelfId, 'Invalid shelf id!', { gt: 0 });
    if (!id) {
        return;
    }
    // Get books in shelf
    try {
        const shelf = await getShelf(id);
        if (!shelf) {
            return res.status(400).json({ error: true, message: 'Shelf not found!' });
        }
        const content = await getShelfContent(shelf);
        return res.status(200).json(content);
    } catch (e) {
        return handleError(res, e);
    }
}
