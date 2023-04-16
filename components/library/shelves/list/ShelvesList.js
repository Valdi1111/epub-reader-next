import ShelvesListButtons from "@/components/library/shelves/list/buttons/ShelvesListButtons";
import ShelvesListItem from "@/components/library/shelves/list/ShelvesListItem";

export default function ShelvesList({ shelves, shelf }) {
    function isShelfActive(s) {
        return shelf && s.id === shelf.id;
    }

    return (
        <div className={`d-md-flex flex-column col-12 col-md-4 col-lg-3 ${!shelf ? "d-flex" : "d-none"}`}>
            <div className="flex-grow-1 scroll-pane">
                <ul className="scroll-pane-inner list-group list-group-flush">
                    {shelves.map(s =>
                        <ShelvesListItem key={s.id} id={s.id} path={s.path} name={s.name} books={s._count.book}
                                         active={isShelfActive(s)}/>
                    )}
                </ul>
            </div>
            <div className="d-flex flex-row border-top p-2">
                <ShelvesListButtons shelf={shelf}/>
            </div>
        </div>
    );
}
