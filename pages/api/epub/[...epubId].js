import getConfig from "next/config";
import path from "path";
import fs from "fs";
import { checkToken } from "@/core/utils";
const { serverRuntimeConfig } = getConfig();

export const config = {
    api: {
        responseLimit: false
    }
}

export default async function handler(req, res) {
    const user = await checkToken(req, res);
    if (!user) {
        return;
    }
    const { epubId } = req.query;
    const p = path.join(serverRuntimeConfig.EPUB_FOLDER, ...epubId);
    if (fs.existsSync(p)) {
        const epub = fs.readFileSync(p)
        res.setHeader('Content-Type', 'application/epub+zip');
        return res.send(epub);
    }
    return res.status(404).send();
}
