import LibraryShelvesLayout from "@/components/library/shelves/LibraryShelvesLayout";
import ShelfEditModal from "@/components/library/shelves/modals/ShelfEditModal";
import ShelfDeleteModal from "@/components/library/shelves/modals/ShelfDeleteModal";
import ShelvesContent from "@/components/library/shelves/content/ShelvesContent";
import ShelvesList from "@/components/library/shelves/list/ShelvesList";
import BookUpdateContext from "@/components/library/BookUpdateContext";
import { getShelf, getShelfContent, getShelves } from "@/core/shelves";
import { useContext, useEffect, useState } from "react";
import { getBooksInShelf } from "@/api/shelves";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function LibraryShelvesId(props) {
    const [update, setUpdate] = useContext(BookUpdateContext);
    const [shelves, setShelves] = useState(props.shelves);
    const [shelf, setShelf] = useState(props.shelf);
    const [content, setContent] = useState(props.content);
    const router = useRouter();

    useEffect(() => {
        setShelves(props.shelves);
    }, [props.shelves]);

    useEffect(() => {
        setShelf(props.shelf);
    }, [props.shelf]);

    useEffect(() => {
        setContent(props.content);
    }, [props.content]);

    // Handle book add/recreate/delete
    useEffect(() => {
        if (update.add) {
            if (update.add.shelf === shelf.id) {
                refreshContent();
            }
        }
        if (update.recreate) {
            refreshContent();
        }
        if (update.delete) {
            refreshContent();
        }
    }, [update]);

    function refreshContent() {
        getBooksInShelf(shelf.id).then(
            res => setContent(res.data),
            err => console.error(err)
        )
    }

    function onShelfEdit(data) {
        let allShelves = shelves;
        let i = allShelves.findIndex(s => s.id === data.id);
        allShelves[i].name = data.name;
        setShelves(allShelves);
        setShelf(data);
    }

    function onShelfDelete(data) {
        router.push('/library/shelves');
    }

    return (
        <>
            <Head>
                <title>{shelf.name}</title>
            </Head>
            <ShelfEditModal update={onShelfEdit}/>
            <ShelfDeleteModal update={onShelfDelete}/>
            <div className="flex-grow-1 d-flex flex-row">
                <ShelvesList shelves={shelves} shelf={shelf}/>
                <ShelvesContent content={content}/>
            </div>
        </>
    );
}

LibraryShelvesId.getLayout = function getLayout(Component, pageProps) {
    return (
        <LibraryShelvesLayout>
            <Component {...pageProps}/>
        </LibraryShelvesLayout>
    );
}

export async function getServerSideProps(context) {
    const { shelfId } = context.params;
    const shelves = await getShelves();
    const id = parseInt(shelfId, 10);
    if (isNaN(id)) {
        return { notFound: true }
    }
    const shelf = await getShelf(id);
    if (!shelf) {
        return { notFound: true }
    }
    const content = await getShelfContent(shelf);
    return { props: { shelves, shelf, content } }
}
