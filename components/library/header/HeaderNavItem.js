import { useRouter } from "next/router";
import Link from "next/link";

export default function HeaderNavItem({ path, name }) {
    const router = useRouter();

    if (!router.pathname.startsWith(path)) {
        return (
            <li className="nav-item">
                <Link href={path} className="nav-link text-center">{name}</Link>
            </li>
        );
    }

    return (
        <li className="nav-item">
            <Link href={path} className="nav-link text-center active" aria-current="page">{name}</Link>
        </li>
    );
}
