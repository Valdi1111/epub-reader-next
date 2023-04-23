import { updateCover, nullCover, removeFile, saveFile, getFile } from "@/core/cover";
import { checkIntParam, checkToken, handleError, handleUpdateError } from "@/core/utils";

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res) {
    const id = checkIntParam(res, req.query.bookId, 'Invalid book id!', { gt: 0 });
    if (!id) {
        return;
    }
    const user = await checkToken(req, res);
    if (!user) {
        return;
    }
    if (req.method === 'GET') {
        try {
            const cover = await getFile(id);
            if (!cover) {
                return res.status(400).json({ error: true, message: 'Cover file not found for this book!' });
            }
            res.setHeader('Content-Type', 'image/jpeg');
            return res.send(cover);
        } catch (e) {
            return handleError(res, e);
        }
    }
    if (req.method === 'POST') {
        try {
            const { fields, files } = await saveFile(req);
            const cover = await updateCover(id, files.cover.newFilename);
            return res.status(200).json(cover);
        } catch (e) {
            return handleUpdateError(res, e, 'Book not found!');
        }
    }
    if (req.method === 'PUT') {
        try {
            const { fields, files } = await saveFile(req);
            await removeFile(id);
            const cover = await updateCover(id, files.cover.newFilename);
            return res.status(200).json(cover);
        } catch (e) {
            console.error(e)
            return handleUpdateError(res, e, 'Book not found!');
        }
    }
    if (req.method === 'DELETE') {
        try {
            await removeFile(id);
            await nullCover(id);
            return res.status(200).json({ success: true });
        } catch (e) {
            return handleUpdateError(res, e, 'Book not found!');
        }
    }
    return res.status(405).json({ error: true, message: 'Wrong method!' });
}
