import prisma from "@/core/prisma";

export async function markRead(id) {
    return prisma.book_progress.update({
        where: { book_id: id },
        data: { position: null, page: -1 }
    });
}

export async function markUnread(id) {
    return prisma.book_progress.update({
        where: { book_id: id },
        data: { position: null, page: 0 }
    });
}

export async function updatePosition(id, position, page, update = false) {
    if (!update) {
        return prisma.book_progress.update({
            where: { book_id: id },
            data: { position, page }
        });
    }
    return prisma.book_progress.update({
        where: { book_id: id },
        data: { position, page, last_read: new Date() }
    });
}

export async function getMetadata(id) {
    return prisma.book_metadata.findUnique({
        where: { book_id: id }
    });
}

export async function getById(id) {
    return prisma.book.findUnique({
        select: {
            id: true,
            url: true,
            book_metadata: { select: { title: true } },
            book_cache: { select: { cover: true, navigation: true, locations: true } },
            book_progress: { select: { position: true, page: true } },
        },
        where: { id },
    });
}

export async function deleteById(id) {
    await prisma.book_cache.delete({
        where: { book_id: id }
    });
    await prisma.book_progress.delete({
        where: { book_id: id }
    });
    await prisma.book_metadata.delete({
        where: { book_id: id }
    });
    await prisma.book.delete({
        where: { id }
    });
}

export async function create(url, locations, navigation, metadata) {
    const splits = url.split('/');
    let shelfId = null;
    if (splits.length > 1) {
        const shelf = await prisma.shelf.findUnique({
            where: { path: splits[0] }
        });
        if (shelf) {
            shelfId = shelf.id;
        }
    }
    const book = await prisma.book.create({
        data: { url, shelf_id: shelfId }
    });
    book.book_metadata = await prisma.book_metadata.create({
        data: {
            book_id: book.id,
            identifier: metadata.identifier,
            title: metadata.title,
            creator: metadata.creator,
            pubdate: metadata.pubdate,
            publisher: metadata.publisher,
            language: metadata.language,
            rights: metadata.rights,
            modified_date: metadata.modified_date
        }
    });
    book.book_progress = await prisma.book_progress.create({
        data: { book_id: book.id }
    });
    book.book_cache = await prisma.book_cache.create({
        data: { book_id: book.id, navigation, locations }
    });
    return book;
}

export async function recreate(id, locations, navigation, metadata) {
    const book = { id };
    book.book_metadata = await prisma.book_metadata.update({
        data: {
            identifier: metadata.identifier,
            title: metadata.title,
            creator: metadata.creator,
            pubdate: metadata.pubdate,
            publisher: metadata.publisher,
            language: metadata.language,
            rights: metadata.rights,
            modified_date: metadata.modified_date
        },
        where: { book_id: id }
    });
    book.book_cache = await prisma.book_cache.update({
        data: { navigation, locations },
        where: { book_id: id }
    });
    return book;
}
