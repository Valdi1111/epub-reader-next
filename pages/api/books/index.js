import { create } from "@/core/book";
import { checkBodyParams, handleError } from "@/core/utils";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: true, message: 'Wrong method!' });
    }
    // Create book
    const { url, locations, navigation, metadata } = req.body;
    if (!checkBodyParams(res, { url, locations, navigation, metadata })) {
        return;
    }
    try {
        const book = await create(url, locations, navigation, metadata);
        return res.status(200).json(book);
    } catch (e) {
        handleError(res, e);
    }
}
