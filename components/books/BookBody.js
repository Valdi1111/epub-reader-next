import BookLoadingScreen from "@/components/books/BookLoadingScreen";

export default function BookBody({ ready }) {
    return (
        <div className="position-relative flex-grow-1">
            <div id="book-view" className="position-absolute w-100 h-100 d-flex justify-content-center"/>
            <BookLoadingScreen ready={ready}/>
        </div>
    );
}
