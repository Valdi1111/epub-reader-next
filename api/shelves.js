import axios from "axios";

export async function getShelves() {
    return axios.get(
        `/api/shelves`,
        {}
    );
}

export async function getBooksInShelf(id) {
    return axios.get(
        `/api/shelves/${id}/books`,
        {}
    );
}

export async function addShelf(path, name) {
    return axios.post(
        `/api/shelves`,
        { path, name },
        {}
    );
}

export async function editShelf(id, name) {
    return axios.put(
        `/api/shelves/${id}`,
        { name },
        {}
    );
}

export async function deleteShelf(id) {
    return axios.delete(
        `/api/shelves/${id}`,
        {}
    );
}
