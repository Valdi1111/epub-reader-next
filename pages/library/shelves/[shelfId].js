import LibraryShelvesLayout from "@/components/library/shelves/LibraryShelvesLayout";
import ShelfEditModal from "@/components/library/shelves/modals/ShelfEditModal";
import ShelfDeleteModal from "@/components/library/shelves/modals/ShelfDeleteModal";
import ShelvesContent from "@/components/library/shelves/content/ShelvesContent";
import { useBookUpdate } from "@/components/library/BookUpdateContext";
import { useShelves } from "@/components/library/shelves/ShelvesContext";
import { getShelf, getShelfContent, getShelves } from "@/core/shelves";
import { getBooksInShelf } from "@/api/shelves";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function LibraryShelvesId(props) {
    const [update, setUpdate] = useBookUpdate();
    const [shelves, setShelves, shelf, setShelf] = useShelves();
    const [content, setContent] = useState(props.content);
    const router = useRouter();

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
            res => {
                // Update content
                setContent(res.data);
                // Update shelf book count
                let allShelves = shelves;
                let i = allShelves.findIndex(s => s.id === shelf.id);
                allShelves[i]._count.book = res.data._count.book;
                setShelves([...allShelves]);
            },
            err => console.error(err)
        );
    }

    function onShelfEdit(data) {
        let allShelves = shelves;
        let i = allShelves.findIndex(s => s.id === data.id);
        allShelves[i].name = data.name;
        setShelves([...allShelves]);
        setShelf(data);
    }

    function onShelfDelete(data) {
        router.push('/library/shelves');
    }

    if (!shelf) {
        return <></>;
    }

    return (
        <>
            <Head>
                <title>{shelf.name}</title>
            </Head>
            <ShelfEditModal update={onShelfEdit}/>
            <ShelfDeleteModal update={onShelfDelete}/>
            <ShelvesContent content={content.items}/>
        </>
    );
}

LibraryShelvesId.getLayout = function getLayout(Component, pageProps) {
    return (
        <LibraryShelvesLayout shelvesList={pageProps.shelves} shelfActive={pageProps.shelf}>
            <Component {...pageProps}/>
        </LibraryShelvesLayout>
    );
}

export async function getServerSideProps({ params }) {
    const { shelfId } = params;
    const id = parseInt(shelfId, 10);
    if (isNaN(id)) {
        return { notFound: true }
    }
    const shelf = await getShelf(id);
    if (!shelf) {
        return { notFound: true }
    }
    const content = await getShelfContent(shelf);
    return {
        props: {
            shelves: await getShelves(),
            shelf,
            content
        }
    };
}
