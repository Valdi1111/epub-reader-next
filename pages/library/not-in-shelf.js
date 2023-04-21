import LibraryLayout from "@/components/library/LibraryLayout";
import LibraryItem from "@/components/library/item/LibraryItem";
import LibraryItemAdder from "@/components/library/item/LibraryItemAdder";
import BookUpdateContext from "@/components/library/BookUpdateContext";
import { BOOKS_PER_PAGE, getBooksNotInShelf } from "@/api/library";
import { useContext, useEffect, useState } from "react";
import { getNotInShelf } from "@/core/library";
import Head from "next/head";

export default function LibraryNotInShelf(props) {
    const [update, setUpdate] = useContext(BookUpdateContext);
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
        if (update.add) {
            if (update.add.shelf === null) {
                refreshBooks();
            }
        }
        if (update.recreate) {
            if (update.recreate.shelf === null) {
                refreshBooks();
            }
        }
        if (update.delete) {
            if (books.filter(b => b.id === parseInt(update.delete.id)).length === 1) {
                refreshBooks();
            }
        }
    }, [update]);

    function refreshBooks() {
        getBooksNotInShelf(BOOKS_PER_PAGE * page + 1, 0).then(
            res => {
                setBooks(res.data.slice(0, BOOKS_PER_PAGE * page));
                setHasMore(res.data.length > BOOKS_PER_PAGE * page);
            },
            err => console.error(err)
        );
    }

    function loadMore() {
        getBooksNotInShelf(BOOKS_PER_PAGE + 1, BOOKS_PER_PAGE * page).then(
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
                <title>Not in shelf</title>
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

LibraryNotInShelf.getLayout = function getLayout(Component, pageProps) {
    return (
        <LibraryLayout>
            <Component {...pageProps}/>
        </LibraryLayout>
    );
}

export async function getServerSideProps() {
    const books = await getNotInShelf(BOOKS_PER_PAGE + 1);
    return { props: { books } }
}
