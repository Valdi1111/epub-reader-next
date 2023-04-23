import BookContents from "@/components/books/contents/BookContents";
import BookSettings from "@/components/books/settings/BookSettings";
import BookTitle from "@/components/books/header/BookTitle";

export default function BookHeader({ title, chapter, navigation, navigateTo, search }) {

    return (
        <header className="p-2 border-bottom d-flex flex-row align-items-center">
            <BookContents chapter={chapter} navigation={navigation} navigateTo={navigateTo} search={search}/>
            <BookTitle title={title}/>
            <BookSettings/>
        </header>
    );
}
