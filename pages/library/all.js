import LibraryLayout from "@/components/library/LibraryLayout";
import LibraryItem from "@/components/library/item/LibraryItem";
import LibraryItemAdder from "@/components/library/item/LibraryItemAdder";
import { useLibraryUpdate } from "@/components/library/LibraryUpdateContext";
import { BOOKS_PER_PAGE, getBooksAll } from "@/api/library";
import { getAll } from "@/core/library";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function LibraryAll(props) {
    const [update, setUpdate] = useLibraryUpdate();
    const [hasMore, setHasMore] = useState(false);
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setBooks(props.books.slice(0, BOOKS_PER_PAGE));
        setHasMore(props.books.length > BOOKS_PER_PAGE);
        setPage(1);
    }, [props.books]);

    // Handle book add/recreate/delete
    useEffect(() => {
        if (!update.add && !update.recreate && !update.delete) {
            return;
        }
        refreshBooks();
    }, [update]);

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
                    {books.map(book => <LibraryItem key={book.id} book={book}/>)}
                    <div className="col-auto p-2">
                        <LibraryItemAdder hasMore={hasMore} loadMore={loadMore}/>
                    </div>
                </div>
            </div>
        </>
    );
}

LibraryAll.getLayout = function getLayout(Component, pageProps) {
    return (
        <LibraryLayout>
            <Component {...pageProps}/>
        </LibraryLayout>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            books: await getAll(BOOKS_PER_PAGE + 1)
        }
    };
}
