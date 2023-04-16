import ImageViewModal from "@/components/books/modals/ImageViewModal";
import BookHeader from "@/components/books/BookHeader";
import BookBody from "@/components/books/BookBody";
import BookFooter from "@/components/books/BookFooter";
import { EPUB_URL, updatePosition } from "@/api/book";
import { getById } from "@/core/book";
import { useEffect, useState } from "react";
import { Book, EpubCFI } from "epubjs";
import {
    FONT, FONT_SIZE, SPACING, MARGINS, WIDTH, FORCE_FONT, FORCE_FONT_SIZE,
    JUSTIFY, LAYOUT, THEME, FONTS, LAYOUTS, THEMES, isWheelAllowed
} from "@/components/Settings";
import Head from "next/head";

export default function BookId(props) {
    const { settings, setSetting } = props;
    const { id, url } = props.book;
    const { title } = props.book.book_metadata;
    const { navigation, locations } = props.book.book_cache;
    // book
    const [book, setBook] = useState(null);
    const [ready, setReady] = useState(false);
    // data
    const [mark, setMark] = useState({ position: null, page: 0 }); // current position and page
    const [chapter, setChapter] = useState(null); // current chapter
    const [section, setSection] = useState(null); // current section (from spine)
    const [location, setLocation] = useState(null);
    const [percentage, setPercentage] = useState(null);

    useEffect(() => {
        setReady(false);
        console.log("Loading book", id);
        const epub = new Book(EPUB_URL + url);
        setMark(props.book.book_progress);
        setBook(epub);
    }, [id]);

    useEffect(() => {
        if (!book) {
            return;
        }
        // Generate locations
        book.ready.then(() => {
            console.log("Loading locations...");
            book.locations.load(locations);
            console.log("Locations loaded!");
            setReady(true);
        });
        document.onkeydown = onKeyDown;
        updateLayout();
    }, [book]);

    useEffect(() => {
        if (!mark.position) {
            return;
        }
        // TODO setting for auto update last read
        updatePosition(id, mark.position, mark.page, true).then(
            res => console.debug("Position updated!"),
            err => console.error(err)
        );
    }, [mark]);

    function updateLayout() {
        const area = document.getElementById('book-view');
        area.innerHTML = '';
        const layout = settings[LAYOUT];
        const gap = parseFloat(settings[MARGINS]);
        const width = parseFloat(settings[WIDTH]) + gap;
        let rendition = book.renderTo(area, {
            ...LAYOUTS[layout].settings,
            width: width + 'px',
            height: '100%',
            gap: gap
        });
        if (!mark.position) {
            rendition.display();
        } else {
            rendition.display(mark.position);
        }
        rendition.on('relocated', updatePage);
        rendition.on('keydown', onKeyDown);
        // Open image view modal when clicking on img or image tag
        rendition.on('click', e => {
            if (e.target.tagName.toLowerCase() === 'img' || e.target.tagName.toLowerCase() === 'image') {
                const { Modal } = require("bootstrap");
                new Modal(document.getElementById('image-view-modal')).show(e.target);
            }
        });
        // Turn page on mouse wheel
        rendition.hooks.content.register(contents => {
            if (!isWheelAllowed(settings[LAYOUT])) {
                return;
            }
            contents.documentElement.onwheel = e => {
                if (e.deltaY < 0) {
                    onLeft();
                }
                if (e.deltaY > 0) {
                    onRight();
                }
            }
        });
        // Turn page on touch swipe
        rendition.hooks.content.register(contents => {
            let start, end;
            contents.documentElement.ontouchstart = e => {
                start = e.changedTouches[0];
            }
            contents.documentElement.ontouchend = e => {
                end = e.changedTouches[0];
                const area = document.getElementById('book-view');
                if (area) {
                    const bound = area.getBoundingClientRect();
                    const hr = (end.screenX - start.screenX) / bound.width;
                    const vr = Math.abs((end.screenY - start.screenY) / bound.height);
                    if (hr > 0.1 && vr < 0.1) {
                        onLeft();
                    }
                    if (hr < -0.1 && vr < 0.1) {
                        onRight();
                    }
                }
            }
        });
        // Hide cursor after 3 seconds
        rendition.hooks.content.register(contents => {
            let mouseTimer = null;
            let cursorVisible = true;
            contents.documentElement.onmousemove = e => {
                if (mouseTimer) {
                    window.clearTimeout(mouseTimer);
                }
                if (!cursorVisible) {
                    contents.documentElement.style.cursor = 'default';
                    cursorVisible = true;
                }
                mouseTimer = window.setTimeout(() => {
                    mouseTimer = null;
                    contents.documentElement.style.cursor = 'none';
                    cursorVisible = false;
                }, 3000);
            }
        });
        updateDefaultTheme();
        Object.entries(THEMES).map(([id, value]) => rendition.themes.register(id, value.css));
        updateTheme();
    }

    function flattenNav(items) {
        return [].concat.apply([], items.map(item => [].concat.apply([item], flattenNav(item.subitems))));
    }

    function getChapFromCfi(pos) {
        let prev = null;
        flattenNav(navigation).forEach(s => {
            if (s.cfi !== null) {
                if (new EpubCFI().compare(pos, s.cfi) === -1) {
                    return;
                }
                prev = s;
            }
        })
        return prev;
    }

    function updatePage(loc) {
        const { cfi, href, displayed } = loc.start;
        // update current chapter
        setChapter(getChapFromCfi(loc.end.cfi));
        // update section
        setSection({ current: book.spine.get(cfi).index, total: book.spine.last().index });
        // update location
        const page = book.locations.locationFromCfi(cfi);
        setLocation({ current: page, total: book.locations.length() });
        // update percentage
        setPercentage(book.locations.percentageFromCfi(cfi));
        // update cache position
        setMark({ position: cfi, page: page });
    }

    function updateDefaultTheme() {
        const theme = {};
        theme['font-family'] = FONTS[settings[FONT]] + (settings[FORCE_FONT] === 'true' ? ' !important' : '');
        theme['font-size'] = settings[FONT_SIZE] + (settings[FORCE_FONT_SIZE] === 'true' ? 'px !important' : 'px');
        theme['line-height'] = settings[SPACING];
        theme['text-align'] = settings[JUSTIFY] === 'true' ? 'justify' : 'left';
        book.rendition.themes.default({ body: theme });
    }

    function updateTheme() {
        book.rendition.themes.select(settings[THEME]);
    }

    function changeSetting(key, value) {
        setSetting(key, value);
        if (key === FONT || key === FONT_SIZE || key === SPACING || key === JUSTIFY
            || key === FORCE_FONT || key === FORCE_FONT_SIZE) {
            updateDefaultTheme();
        }
        if (key === WIDTH) {
            const width = parseFloat(settings[WIDTH]) + parseFloat(settings[MARGINS]);
            book.rendition.resize(width + 'px', '100%');
        }
        if (key === LAYOUT || key === MARGINS) {
            updateLayout()
        }
        if (key === THEME) {
            updateTheme();
        }
    }

    function navigateTo(href) {
        book.rendition.display(href);
        console.debug("Navigate", href);
    }

    function searchSpine(item, value) {
        return item.load(book.load.bind(book))
            .then(item.find.bind(item, value))
            .finally(item.unload.bind(item))
            .then(elems => elems.map(e => {
                e.chapter = getChapFromCfi(e.cfi);
                return e;
            }));
    }

    function search(value, all) {
        if (all) {
            return Promise.all(book.spine.spineItems.map(item => searchSpine(item, value)))
                .then(results => Promise.resolve([].concat.apply([], results)));
        }
        const item = book.spine.get(book.rendition.location.start.cfi);
        return searchSpine(item, value);
    }

    function onKeyDown(e) {
        let code = e.keyCode || e.which;
        if (code === 37) {
            onLeft();
        }
        if (code === 39) {
            onRight();
        }
    }

    function onLeft() {
        book.rendition.prev();
    }

    function onRight() {
        book.rendition.next();
    }

    if (!book) {
        return <></>;
    }

    return (
        <>
            <Head>
                <title>Book</title>
            </Head>
            <ImageViewModal/>
            <div className="vw-100 vh-100 d-flex flex-column">
                <BookHeader settings={settings} setSetting={changeSetting} title={title} chapter={chapter}
                            navigation={navigation} navigateTo={navigateTo} search={search}/>
                <BookBody ready={ready}/>
                <BookFooter chapter={chapter} section={section} location={location} percentage={percentage}
                            left={onLeft} right={onRight}/>
            </div>
        </>
    );
}

BookId.getLayout = function getLayout(settings, setSetting, Component, pageProps) {
    return <Component {...pageProps} settings={settings} setSetting={setSetting}/>;
}

export async function getServerSideProps(context) {
    const { bookId } = context.params;
    const id = parseInt(bookId, 10);
    if (isNaN(id)) {
        return { notFound: true }
    }
    const book = await getById(id);
    if (!book) {
        return { notFound: true }
    }
    return { props: { book } }
}
