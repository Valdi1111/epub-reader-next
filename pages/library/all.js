import LibraryLayout from "@/components/library/LibraryLayout";
import LibraryItem from "@/components/library/item/LibraryItem";
import LibraryItemAdder from "@/components/library/item/LibraryItemAdder";
import { BOOKS_PER_PAGE, getBooksAll } from "@/api/library";
import { getAll } from "@/core/library";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function LibraryAll(props) {
    const [hasMore, setHasMore] = useState(false);
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setBooks(props.books.slice(0, BOOKS_PER_PAGE));
        setHasMore(props.books.length > BOOKS_PER_PAGE);
        setPage(1);
    }, [props.books]);

    useEffect(() => {
        if (!props.onUpdate.add && !props.onUpdate.recreate && !props.onUpdate.delete) {
            return;
        }
        refreshBooks();
    }, [props.onUpdate]);

    function refreshBooks() {
        getBooksAll(BOOKS_PER_PAGE * page + 1, 0).then(
            res => {
                setBooks(res.data.slice(0, BOOKS_PER_PAGE * page));
                setHasMore(res.data.length > BOOKS_PER_PAGE * page);
            },
            err => console.error(err)
        );
    }

    function loadMore() {
        getBooksAll(BOOKS_PER_PAGE + 1, BOOKS_PER_PAGE * page).then(
            res => {
                setBooks([...books, ...res.data.slice(0, BOOKS_PER_PAGE)]);
                setHasMore(res.data.length > BOOKS_PER_PAGE);
                setPage(page + 1);
            },
            err => console.error(err)
        );
    }

    return (
        <>
            <Head>
                <title>All books</title>
            </Head>
            <div className="scroll-pane flex-grow-1">
                <div className="scroll-pane-inner row mx-0">
                    {books.map(book =>
                        <div className="col-auto p-2" key={book.id}>
                            <LibraryItem book={book}/>
                        </div>
                    )}
                    <div className="col-auto p-2">
                        <LibraryItemAdder hasMore={hasMore} loadMore={loadMore}/>
                    </div>
                </div>
            </div>
        </>
    );
}

LibraryAll.getLayout = function getLayout(settings, setSetting, Component, pageProps) {
    return (
        <LibraryLayout settings={settings} setSetting={setSetting}>
            <Component {...pageProps} settings={settings} setSetting={setSetting}/>
        </LibraryLayout>
    );
}

export async function getServerSideProps() {
    const books = await getAll(BOOKS_PER_PAGE + 1);
    return { props: { books } }
}
