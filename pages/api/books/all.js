import { getAll } from "@/core/library";
import { getIntParam, handleError } from "@/core/utils";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: true, message: 'Wrong method!' });
    }
    // Get all books
    const offset = getIntParam(req.query.offset, 0, { gt: -1 });
    const limit = getIntParam(req.query.limit, 20, { gt: 0 });
    try {
        const books = await getAll(limit, offset);
        return res.status(200).json(books);
    } catch (e) {
        handleError(res, e);
    }
}
