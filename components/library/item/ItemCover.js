import { getCoverUrl } from "@/api/library";
import Link from "next/link";
import Image from "next/image";

export default function ItemCover({ id, cover, title, creator }) {
    if (cover) {
        return (
            <Link className="d-flex justify-content-center align-items-center position-relative" title={title}
                  href={`/books/${id}`} style={{ height: "225px" }}>
                <Image className="img-fluid mt-auto" src={getCoverUrl(id)} alt="Book cover" loading="lazy"
                       fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       style={{ objectFit: "contain", objectPosition: "bottom" }}/>
            </Link>
        );
    }
    return (
        <Link className="d-flex justify-content-center align-items-center border" title={title} href={`/books/${id}`}
              style={{ height: "225px" }}>
            <div className="h-100 w-100 d-flex flex-column justify-content-center py-3">
                <p className="overflow-hidden border-top border-bottom p-2 mb-1"
                   style={{ fontWeight: 500, fontSize: "95%" }}>
                    {title}
                </p>
                <span className="small align-self-end px-2">{creator}</span>
            </div>
        </Link>
    );
}
