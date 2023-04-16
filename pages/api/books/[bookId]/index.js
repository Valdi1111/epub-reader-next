import { checkBodyParams, checkIntParam, handleError, handleUpdateError } from "@/core/utils";
import { recreate, deleteById, getById } from "@/core/book";
import { removeFile } from "@/core/cover";

export default async function handler(req, res) {
    const id = checkIntParam(res, req.query.bookId, 'Invalid book id!', { gt: 0 });
    if (!id) {
        return;
    }
    if (req.method === 'GET') {
        // Get book by id
        try {
            const book = await getById(id);
            if(!book) {
                return res.status(400).json({ error: true, message: 'Book not found!' });
            }
            return res.status(200).json(book);
        } catch (e) {
            return handleError(res, e);
        }
    }
    if (req.method === 'DELETE') {
        // Delete book
        try {
            await removeFile(id);
            await deleteById(id);
            return res.status(200).json({ success: true });
        } catch (e) {
            return handleUpdateError(res, e, 'Book not found!');
        }
    }
    if (req.method === 'PUT') {
        // Recreate book cache
        const { locations, navigation, metadata } = req.body;
        if (!checkBodyParams(res, { locations, navigation, metadata })) {
            return;
        }
        try {
            const book = await recreate(id, locations, navigation, metadata);
            return res.status(200).json(book);
        } catch (e) {
            return handleUpdateError(res, e, 'Book not found!');
        }
    }
    return res.status(405).json({ error: true, message: 'Wrong method!' });
}
