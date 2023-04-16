import ContentToc from "@/components/books/contents/toc/ContentToc";
import ContentSearch from "@/components/books/contents/search/ContentSearch";
import { ANNOTATIONS, BOOKMARKS, SEARCH, TOC } from "@/components/books/contents/BookContents";

export default function ContentsBody({ content, close, search, chapter, navigation, navigateTo }) {
    if (content === TOC) {
        return <ContentToc close={close} chapter={chapter} navigation={navigation} navigateTo={navigateTo}/>;
    }
    if (content === ANNOTATIONS) {
        return <></>;
    }
    if (content === BOOKMARKS) {
        return <></>;
    }
    if (content === SEARCH) {
        return <ContentSearch close={close} navigateTo={navigateTo} search={search}/>;
    }
    return <></>;
}
