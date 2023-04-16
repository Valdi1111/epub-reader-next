import ShelvesListAddButton from "@/components/library/shelves/list/buttons/ShelvesListAddButton";
import ShelvesListEditButton from "@/components/library/shelves/list/buttons/ShelvesListEditButton";
import ShelvesListDeleteButton from "@/components/library/shelves/list/buttons/ShelvesListDeleteButton";

export default function ShelvesListButtons({ shelf }) {

    if (!shelf) {
        return <ShelvesListAddButton/>;
    }

    return (
        <>
            <ShelvesListAddButton/>
            <ShelvesListEditButton id={shelf.id} name={shelf.name} path={shelf.path}/>
            <ShelvesListDeleteButton id={shelf.id} name={shelf.name}/>
        </>
    );
}
