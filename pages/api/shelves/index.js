import { addShelf, getShelves } from "@/core/shelves";
import { checkBodyParams, handleError } from "@/core/utils";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Get shelves
        try {
            const shelves = await getShelves();
            return res.status(200).json(shelves);
        } catch (e) {
            return handleError(res, e);
        }
    }
    if (req.method === 'POST') {
        // Add shelf
        const { path, name } = req.body;
        if (!checkBodyParams(res, { path, name })) {
            return;
        }
        try {
            const shelf = await addShelf(path, name);
            return res.status(200).json(shelf);
        } catch (e) {
            return handleError(res, e);
        }
    }
    return res.status(405).json({ error: true, message: 'Wrong method!' });
}
