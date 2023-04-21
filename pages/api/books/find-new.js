import { findNew } from "@/core/library";
import { checkToken, handleError } from "@/core/utils";

export default async function handler(req, res) {
    const user = await checkToken(req, res);
    if (!user) {
        return;
    }
    if (req.method !== 'GET') {
        return res.status(405).json({ error: true, message: 'Wrong method!' });
    }
    try {
        // Get all available new books
        const found = await findNew();
        return res.status(200).json(found);
    } catch (e) {
        handleError(res, e);
    }
}
