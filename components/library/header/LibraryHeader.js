import HeaderNavItem from "@/components/library/header/HeaderNavItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function LibraryHeader() {

    function logout() {
        signOut().then(r => console.log("Logged out..."));
    }

    return (
        <nav className="navbar navbar-expand-md border-bottom">
            <div className="container-fluid">
                <button type="button" className="d-md-none btn btn-icon btn-outline-secondary" data-bs-toggle="collapse"
                        data-bs-target="#navigation" aria-controls="navigation" aria-expanded={false}
                        aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={faBars} width={16} height={16}/>
                </button>
                <div className="collapse navbar-collapse order-2 order-md-1" id="navigation">
                    <div className="d-md-none w-100 border-top my-2"/>
                    <ul className="nav flex-column flex-md-row nav-pills me-auto">
                        <HeaderNavItem path="/library/all" name="All books"/>
                        <HeaderNavItem path="/library/shelves" name="Shelves"/>
                        <HeaderNavItem path="/library/not-in-shelf" name="Not in shelf"/>
                    </ul>
                </div>
                <div className="dropdown order-1 order-md-2">
                    <div className="link-secondary dropdown-toggle cursor-pointer" data-bs-toggle="dropdown"
                         aria-expanded={false}>
                        <Image src="/avatar.png" alt="avatar" className="rounded-circle" width={40} height={40}/>
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><span className="dropdown-item cursor-pointer" data-bs-toggle="modal"
                                  data-bs-target="#book-add-modal">Add</span></li>
                        <li><span className="dropdown-item cursor-pointer" data-bs-toggle="modal"
                                  data-bs-target="#theme-change-modal">Theme</span></li>
                        <li>
                            <hr className="dropdown-divider"/>
                        </li>
                        <li><span className="dropdown-item cursor-pointer" onClick={logout}>Sign out</span></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
