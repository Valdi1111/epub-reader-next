import { Formidable } from "formidable";
import { v4 } from "uuid";
import prisma from "@/core/prisma";
import fs from "fs/promises";
import path from "path";

export async function findCover(id) {
    return prisma.book_cache.findUnique({
        select: { cover: true },
        where: { book_id: id }
    });
}

export async function updateCover(id, filename) {
    return prisma.book_cache.update({
        data: { cover: filename },
        where: { book_id: id }
    });
}

export async function nullCover(id) {
    return prisma.book_cache.update({
        data: { cover: null },
        where: { book_id: id }
    });
}

/**
 * Remove cover file if exists
 * @param id the book id
 * @returns {Promise<void>}
 */
export async function removeFile(id) {
    let cache = await findCover(id);
    if (!cache || !cache.cover) {
        return;
    }
    const cf = path.join(process.cwd(), 'public', 'covers', cache.cover);
    try {
        await fs.readFile(cf);
        return fs.unlink(cf);
    } catch (err) {
        console.error("Cannot delete cover file", cf);
        return null;
    }
}

export async function saveFile(req) {
    const fileDir = path.join(process.cwd(), 'public', 'covers');
    try {
        await fs.readdir(fileDir);
    } catch (error) {
        await fs.mkdir(fileDir, { recursive: true });
    }
    const form = new Formidable({
        allowEmptyFiles: false,
        uploadDir: fileDir,
        filename: v4,
        filter: function ({ name, originalFilename, mimetype }) {
            // keep only images
            return name === 'cover' && mimetype && mimetype.includes('image');
        }
    });
    return await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                reject(err);
            }
            resolve({ fields, files });
        });
    });
}
