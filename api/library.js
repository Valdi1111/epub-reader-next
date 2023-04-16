import axios from "axios";

export const COVERS_URL = '/covers/';
export const MISSING_COVER_URL = '/missing-cover.png';
export const BOOKS_PER_PAGE = 20;

export async function getBooksAll(limit, offset) {
    return axios.get(
        `/api/books/all?limit=${limit}&offset=${offset}`,
        {}
    );
}

export async function getBooksNotInShelf(limit, offset) {
    return axios.get(
        `/api/books/not-in-shelf?limit=${limit}&offset=${offset}`,
        {}
    );
}

export async function findNewBooks() {
    return axios.get(
        `/api/books/find-new`,
        {}
    );
}
