import LibraryShelvesLayout from "@/components/library/shelves/LibraryShelvesLayout";
import ShelvesList from "@/components/library/shelves/list/ShelvesList";
import { getShelves } from "@/core/shelves";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function LibraryShelves(props) {
    const { refresh } = props;
    const [shelves, setShelves] = useState([]);
    const router = useRouter();

    useEffect(() => {
        setShelves(props.shelves);
    }, [props.shelves]);

    return (
        <>
            <Head>
                <title>Shelves</title>
            </Head>
            <div className="flex-grow-1 d-flex flex-row">
                <ShelvesList shelves={shelves}/>
            </div>
        </>
    );
}

LibraryShelves.getLayout = function getLayout(settings, setSetting, Component, pageProps) {
    return (
        <LibraryShelvesLayout settings={settings} setSetting={setSetting}>
            <Component {...pageProps} settings={settings} setSetting={setSetting}/>
        </LibraryShelvesLayout>
    );
}

export async function getServerSideProps(context) {
    const shelves = await getShelves();
    return { props: { shelves } }
}
