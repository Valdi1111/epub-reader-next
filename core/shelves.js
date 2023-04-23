import prisma from "@/core/prisma";
import { getBookWithTotal } from "@/core/library";

export async function getShelf(id) {
    return prisma.shelf.findUnique({ where: { id } });
}

export async function getShelves() {
    return prisma.shelf.findMany({
        include: { _count: { select: { book: true } } },
        orderBy: [{ name: 'asc' }]
    });
}

export async function addShelf(path, name) {
    const shelf = await prisma.shelf.create({
        data: { path, name }
    });
    await prisma.book.updateMany({
        where: { url: { startsWith: path + '/' } },
        data: { shelf_id: shelf.id }
    });
    return shelf;
}

export async function editShelf(id, name) {
    return prisma.shelf.update({
        where: { id }, data: { name }
    });
}

export async function deleteShelf(id) {
    await prisma.book.updateMany({
        where: { shelf_id: id },
        data: { shelf_id: null }
    });
    return prisma.shelf.delete({
        where: { id }
    });
}

export async function getShelfContent(shelf) {
    const books = await prisma.book.findMany({
        select: {
            id: true,
            url: true,
            book_metadata: { select: { title: true, creator: true } },
            book_cache: { select: { cover: true, locations: true } },
            book_progress: { select: { page: true } },
        },
        where: { shelf_id: shelf.id },
        orderBy: [{ url: 'asc' }],
    });
    let data = {};
    books.map(getBookWithTotal).forEach(b => {
        const path = b.url.replace(`${shelf.path}/`, '').split('/', 2);
        const folder = path.length === 1 ? shelf.path : path[0];
        if (!data[folder]) {
            data[folder] = [b];
        } else {
            data[folder] = [...data[folder], b];
        }
    });
    return { _count: { book: books.length }, items: data };
}
