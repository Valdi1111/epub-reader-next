import LibraryShelvesLayout from "@/components/library/shelves/LibraryShelvesLayout";
import ShelfEditModal from "@/components/library/shelves/modals/ShelfEditModal";
import ShelfDeleteModal from "@/components/library/shelves/modals/ShelfDeleteModal";
import ShelvesContent from "@/components/library/shelves/content/ShelvesContent";
import ShelvesList from "@/components/library/shelves/list/ShelvesList";
import { getShelf, getShelfContent, getShelves } from "@/core/shelves";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { getBooksInShelf } from "@/api/shelves";

export default function LibraryShelvesId(props) {
    const { refresh } = props;
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

    useEffect(() => {
        if (props.onUpdate.add) {
            if (props.onUpdate.add.shelf === shelf.id) {
                refreshContent();
            }
        }
        if (props.onUpdate.recreate) {
            refreshContent();
        }
        if (props.onUpdate.delete) {
            refreshContent();
        }
    }, [props.onUpdate]);

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
                <title>Shelf</title>
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

LibraryShelvesId.getLayout = function getLayout(settings, setSetting, Component, pageProps) {
    return (
        <LibraryShelvesLayout settings={settings} setSetting={setSetting}>
            <Component {...pageProps} settings={settings} setSetting={setSetting}/>
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
