import { deleteShelf, editShelf } from "@/core/shelves";
import { checkIntParam, handleUpdateError } from "@/core/utils";

export default async function handler(req, res) {
    const id = checkIntParam(res, req.query.shelfId, 'Invalid shelf id!', { gt: 0 });
    if (!id) {
        return;
    }
    if (req.method === 'PUT') {
        // Edit shelf
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: true, message: 'Invalid name!' });
        }
        try {
            const shelf = await editShelf(id, name);
            return res.status(200).json(shelf);
        } catch (e) {
            return handleUpdateError(res, e, 'Shelf not found!');
        }
    }
    if (req.method === 'DELETE') {
        // Delete shelf
        try {
            await deleteShelf(id);
            return res.status(200).json({ success: true });
        } catch (e) {
            return handleUpdateError(res, e, 'Shelf not found!');
        }
    }
    return res.status(405).json({ error: true, message: 'Wrong method!' });
}
