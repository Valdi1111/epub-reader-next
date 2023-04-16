import prisma from "@/core/prisma";
import getConfig from "next/config";
import path from "path";
import fs from "fs";

export function getBookWithTotal(book) {
    book.book_progress.total = book.book_cache.locations.length;
    delete book.book_cache.locations;
    return book;
}

export async function getAll(limit = 20, offset = 0) {
    const books = await prisma.book.findMany({
        select: {
            id: true,
            url: true,
            book_metadata: { select: { title: true, creator: true } },
            book_cache: { select: { cover: true, locations: true } },
            book_progress: { select: { page: true } },
            shelf_id: true
        },
        orderBy: [{ book_progress: { last_read: 'desc' } }, { id: 'desc' }],
        take: limit,
        skip: offset,
    });
    return books.map(getBookWithTotal);
}

export async function getNotInShelf(limit = 20, offset = 0) {
    const books = await prisma.book.findMany({
        select: {
            id: true,
            url: true,
            book_metadata: { select: { title: true, creator: true } },
            book_cache: { select: { cover: true, locations: true } },
            book_progress: { select: { page: true } },
        },
        where: { shelf_id: null },
        orderBy: [{ url: 'asc' }],
        take: limit,
        skip: offset,
    });
    return books.map(getBookWithTotal);
}

export async function findNew() {
    // get all files from disk
    const files = searchFiles();
    // get all books in database
    const results = await prisma.book.findMany({
        where: { url: { in: files } }
    });
    // filter books not in database
    const present = results.map(item => item.url);
    const filtered = files.filter(item => present.indexOf(item) === -1);
    // regroup based on folder
    let res = { "/": [] };
    filtered.forEach(b => {
        const path = b.split("/", 2);
        const folder = path.length === 1 ? "/" : path[0];
        const file = path.length === 1 ? b : b.replace(`${folder}/`, "");
        if (!res[folder]) {
            res[folder] = [{ path: b, file }];
        } else {
            res[folder] = [...res[folder], { path: b, file }];
        }
    });
    return res;
}

function searchFiles(p = '', all = []) {
    const { serverRuntimeConfig } = getConfig();
    const fp = path.join(serverRuntimeConfig.EPUB_FOLDER, p);
    if (fs.statSync(fp).isDirectory()) {
        fs.readdirSync(fp).map(f => searchFiles(path.join(p, f), all));
    } else if (p.split('.').pop() === 'epub') {
        // TODO added for windows compatibility, check in linux
        const str = p.replaceAll("\\", "/");
        all.push(str);
        //all.push(p);
    }
    return all;
}
