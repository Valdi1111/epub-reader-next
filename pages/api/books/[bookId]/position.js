import { updatePosition } from "@/core/book";
import { checkBodyParams, checkIntParam, checkToken, handleUpdateError } from "@/core/utils";

export default async function handler(req, res) {
    const user = await checkToken(req, res);
    if (!user) {
        return;
    }
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: true, message: 'Wrong method!' });
    }
    const id = checkIntParam(res, req.query.bookId, 'Invalid book id!', { gt: 0 });
    if (!id) {
        return;
    }
    // Update book position
    const { position } = req.body;
    if (!checkBodyParams(res, { position })) {
        return;
    }
    const page = checkIntParam(res, req.body.page, 'Invalid page!', { gt: -1 });
    if (page === null) {
        return;
    }
    // TODO check page < total pages?
    try {
        const progress = await updatePosition(id, position, page, req.body.update);
        return res.status(200).json(progress);
    } catch (e) {
        console.error(e)
        return handleUpdateError(res, e, 'Book not found!');
    }
}
