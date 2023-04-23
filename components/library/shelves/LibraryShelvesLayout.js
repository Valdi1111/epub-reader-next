import { ShelvesProvider } from "@/components/library/shelves/ShelvesContext";
import ShelfAddModal from "@/components/library/shelves/modals/ShelfAddModal";
import ShelvesList from "@/components/library/shelves/list/ShelvesList";
import LibraryLayout from "@/components/library/LibraryLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function LibraryShelvesLayout({ shelvesList, shelfActive, children }) {
    const [shelves, setShelves] = useState(shelvesList);
    const [shelf, setShelf] = useState(shelfActive);
    const router = useRouter();

    useEffect(() => {
        setShelves(shelvesList);
    }, [shelvesList]);

    useEffect(() => {
        setShelf(shelfActive);
    }, [shelfActive]);

    function onShelfAdd(data) {
        router.push(`/library/shelves/${data.id}`);
    }

    return (
        <ShelvesProvider value={[shelves, setShelves, shelf, setShelf]}>
            <Head>
                <title>Shelves</title>
            </Head>
            <LibraryLayout>
                <div className="flex-grow-1 d-flex flex-row">
                    <ShelfAddModal update={onShelfAdd}/>
                    <ShelvesList shelves={shelves} shelf={shelf}/>
                    {children}
                </div>
            </LibraryLayout>
        </ShelvesProvider>
    )
}
