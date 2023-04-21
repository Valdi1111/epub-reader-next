import BookContents from "@/components/books/contents/BookContents";
import BookSettings from "@/components/books/settings/BookSettings";

export default function BookHeader({ title, chapter, navigation, navigateTo, search }) {
    function titleLabel() {
        return title === null ? '' : title;
    }

    return (
        <header className="p-2 border-bottom d-flex flex-row align-items-center">
            <BookContents chapter={chapter} navigation={navigation} navigateTo={navigateTo} search={search}/>
            <p id="book-title" className="flex-grow-1 mb-0 text-center text-truncate px-2" title={titleLabel()}>
                {titleLabel()}
            </p>
            <BookSettings/>
        </header>
    );
}
