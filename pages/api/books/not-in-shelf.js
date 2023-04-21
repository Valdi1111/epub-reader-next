import { getNotInShelf } from "@/core/library";
import { checkToken, getIntParam, handleError } from "@/core/utils";

export default async function handler(req, res) {
    const user = await checkToken(req, res);
    if (!user) {
        return;
    }
    if (req.method !== 'GET') {
        return res.status(405).json({ error: true, message: 'Wrong method!' });
    }
    // Get books not in shelf
    const offset = getIntParam(req.query.offset, 0, { gt: -1 });
    const limit = getIntParam(req.query.limit, 20, { gt: 0 });
    try {
        const books = await getNotInShelf(limit, offset);
        return res.status(200).json(books);
    } catch (e) {
        handleError(res, e);
    }
}
