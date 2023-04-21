import LibraryLayout from "@/components/library/LibraryLayout";
import ShelfAddModal from "@/components/library/shelves/modals/ShelfAddModal";
import { useRouter } from "next/navigation";

export default function LibraryShelvesLayout({ children }) {
    const router = useRouter();

    function onShelfAdd(data) {
        router.push(`/library/shelves/${data.id}`);
    }

    return (
        <>
            <ShelfAddModal update={onShelfAdd}/>
            <LibraryLayout>
                {children}
            </LibraryLayout>
        </>
    )
}
