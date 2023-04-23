import LibraryShelvesLayout from "@/components/library/shelves/LibraryShelvesLayout";
import { getShelves } from "@/core/shelves";

export default function LibraryShelves() {
    return <></>;
}

LibraryShelves.getLayout = function getLayout(Component, pageProps) {
    return (
        <LibraryShelvesLayout shelvesList={pageProps.shelves}>
            <Component {...pageProps}/>
        </LibraryShelvesLayout>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            shelves: await getShelves()
        }
    };
}
