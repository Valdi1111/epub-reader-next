import BookHeader from "@/components/books/BookHeader";
import BookFooter from "@/components/books/BookFooter";
import BookBody from "@/components/books/BookBody";
import { useEffect, useRef, useState } from "react";
import { EPUB_URL, updatePosition } from "@/api/book";
import { Book, EpubCFI } from "epubjs";
import { getById } from "@/core/book";
import { THEMES, useThemes } from "@/components/ThemeContext";
import {
    FONT, FONTS, FONT_SIZE,
    SPACING, MARGINS, WIDTH,
    FORCE_FONT, FORCE_FONT_SIZE, JUSTIFY,
    LAYOUT, LAYOUTS,
    UPDATE_LAST_READ, isWheelAllowed, useSettings
} from "@/components/books/SettingsContext";
import BookLayout from "@/components/books/BookLayout";

export default function BookId(props) {
    const [settings, setSetting] = useSettings();
    const [theme, setTheme] = useThemes();
    const { id, url } = props.book;
    const { title } = props.book.book_metadata;
    const { navigation, locations } = props.book.book_cache;
    // book
    const book = useRef(null);
    const ready = useRef(false);
    // State for loading screen
    const [loaded, setLoaded] = useState(false);
    // Book data
    const [mark, setMark] = useState({ position: null, page: 0 }); // current position and page
    const [chapter, setChapter] = useState(null); // current chapter
    const [section, setSection] = useState(null); // current section (from spine)
    const [location, setLocation] = useState(null);
    const [percentage, setPercentage] = useState(null);

    /**
     * Handle layout updates
     */
    useEffect(() => {
        if (!ready.current) {
            return;
        }
        ready.current = false;
        updateLayout();
    }, [settings[LAYOUT], settings[MARGINS]]);

    /**
     * Handle font settings updates
     */
    useEffect(() => {
        if (!ready.current) {
            return;
        }
        updateDefaultTheme();
    }, [
        settings[FONT],
        settings[FONT_SIZE],
        settings[SPACING],
        settings[JUSTIFY],
        settings[FORCE_FONT],
        settings[FORCE_FONT_SIZE]
    ]);

    /**
     * Handle dimension updates
     */
    useEffect(() => {
        if (!ready.current) {
            return;
        }
        const width = parseInt(settings[WIDTH]) + parseInt(settings[MARGINS]);
        book.current.rendition.resize(width, '100%');
    }, [settings[WIDTH]]);

    /**
     * Handle theme updates
     */
    useEffect(() => {
        if (!ready.current) {
            return;
        }
        updateTheme();
    }, [theme]);

    /**
     * Load book
     */
    useEffect(() => {
        if (book.current) {
            return;
        }
        console.log("Loading book", id);
        book.current = new Book(EPUB_URL + url);
        setMark(props.book.book_progress);
        // Generate locations
        book.current.ready.then(() => {
            console.log("Loading locations...");
            book.current.locations.load(locations);
            console.log("Locations loaded!");
            document.onkeydown = onKeyDown;
            updateLayout();
            setLoaded(true);
        });
    }, [id]);

    /**
     * Update position
     */
    useEffect(() => {
        if (!ready.current) {
            return;
        }
        // TODO setting for auto update last read
        const update = settings[UPDATE_LAST_READ] === 'true';
        updatePosition(id, mark.position, mark.page, update).then(
            res => console.debug("Position updated!"),
            err => console.error(err)
        );
    }, [mark]);

    /**
     * Render book
     */
    function updateLayout() {
        const area = document.getElementById('book-view');
        area.innerHTML = '';
        const gap = parseInt(settings[MARGINS]);
        const width = parseInt(settings[WIDTH]) + gap;
        let rendition = book.current.renderTo(area, {
            ...LAYOUTS[settings[LAYOUT]].settings,
            width: width,
            height: '100%',
            gap: gap
        });
        if (!mark.position) {
            rendition.display().then(r => ready.current = true);
        } else {
            rendition.display(mark.position).then(r => ready.current = true);
        }
        rendition.on('relocated', updatePage);
        rendition.on('keydown', onKeyDown);
        // Open image view modal when clicking on img or image tag
        rendition.on('click', async e => {
            if (e.target.tagName.toLowerCase() === 'img' || e.target.tagName.toLowerCase() === 'image') {
                const { default: Modal } = await import("bootstrap/js/dist/modal");
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
                    prev();
                }
                if (e.deltaY > 0) {
                    next();
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
                        prev();
                    }
                    if (hr < -0.1 && vr < 0.1) {
                        next();
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

    /**
     * Update default book theme settings
     */
    function updateDefaultTheme() {
        const theme = {};
        theme['font-family'] = FONTS[settings[FONT]] + (settings[FORCE_FONT] === 'true' ? ' !important' : '');
        theme['font-size'] = settings[FONT_SIZE] + (settings[FORCE_FONT_SIZE] === 'true' ? 'px !important' : 'px');
        theme['line-height'] = settings[SPACING];
        theme['text-align'] = settings[JUSTIFY] === 'true' ? 'justify' : 'left';
        book.current.rendition.themes.default({ body: theme });
    }

    /**
     * Update book theme
     */
    function updateTheme() {
        book.current.rendition.themes.select(theme);
    }

    function updatePage(loc) {
        const { cfi, href, displayed } = loc.start;
        // update current chapter
        setChapter(getChapFromCfi(loc.end.cfi));
        // update section
        setSection({ current: book.current.spine.get(cfi).index, total: book.current.spine.last().index });
        // update location
        const page = book.current.locations.locationFromCfi(cfi);
        setLocation({ current: page, total: book.current.locations.length() });
        // update percentage
        setPercentage(book.current.locations.percentageFromCfi(cfi));
        // update cache position
        setMark({ position: cfi, page: page });
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

    function searchSpine(item, value) {
        return item.load(book.current.load.bind(book.current))
            .then(item.find.bind(item, value))
            .finally(item.unload.bind(item))
            .then(elems => elems.map(e => {
                e.chapter = getChapFromCfi(e.cfi);
                return e;
            }));
    }

    function search(value, all) {
        if (all) {
            return Promise.all(book.current.spine.spineItems.map(item => searchSpine(item, value)))
                .then(results => Promise.resolve([].concat.apply([], results)));
        }
        const item = book.current.spine.get(book.current.rendition.location.start.cfi);
        return searchSpine(item, value);
    }

    /**
     * Navigate to location
     * @param href book location
     */
    function navigateTo(href) {
        book.current.rendition.display(href);
        console.debug("Navigate", href);
    }

    /**
     * Handle arrow right/left to navigate book pages
     * @param e event
     */
    function onKeyDown(e) {
        let code = e.keyCode || e.which;
        if (code === 37) {
            prev();
        }
        if (code === 39) {
            next();
        }
    }

    function prev() {
        if (!ready.current) {
            return;
        }
        book.current.rendition.prev();
    }

    function next() {
        if (!ready.current) {
            return;
        }
        book.current.rendition.next();
    }

    return (
        <div className="vw-100 vh-100 d-flex flex-column">
            <BookHeader title={title} chapter={chapter} navigation={navigation} navigateTo={navigateTo}
                        search={search}/>
            <BookBody loaded={loaded}/>
            <BookFooter chapter={chapter} section={section} location={location} percentage={percentage} prev={prev}
                        next={next}/>
        </div>
    );
}

BookId.getLayout = function getLayout(Component, pageProps) {
    return (
        <BookLayout>
            <Component {...pageProps}/>
        </BookLayout>
    );
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
