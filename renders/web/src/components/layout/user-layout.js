import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserLayout() {
    const [pageMenuOpen, setPageMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const pageMenu = [
        {
            name: "Trang chủ",
            key: "home",
            path: "/",
        },
        {
            name: "Truyện tranh",
            key: "manga",
            path: "/manga",
        },
        {
            name: "Novel",
            key: "novel",
            path: "/novel",
        },
        {
            name: "Tìm kiếm nâng cao",
            key: "search",
            path: "/tim-kiem",
        },
    ];
    return (
        <>
            <nav className="bg-gray-800">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* <!-- Mobile menu button--> */}
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                                onClick={() => setPageMenuOpen(!pageMenuOpen)}
                            >
                                <span className="sr-only">Open main menu</span>
                                {pageMenuOpen ? (
                                    <FontAwesomeIcon icon="times" fixedWidth />
                                ) : (
                                    <FontAwesomeIcon
                                        icon="align-justify"
                                        fixedWidth
                                    />
                                )}
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="hidden lg:block font-mono text-2xl text-purple-50">
                                    Virtuoso Translation
                                </span>
                                <span className="block lg:hidden font-mono text-2xl text-purple-50">
                                    VT
                                </span>
                            </div>
                            <div className="hidden sm:block sm:ml-6">
                                <div className="flex space-x-4">
                                    {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                                    {pageMenu.map((_menu, _idx) => (
                                        <Link
                                            key={_idx}
                                            to={_menu.path}
                                            className="text-gray-300 text-center self-center hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            {_menu.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button
                                type="button"
                                className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            >
                                <span className="sr-only">
                                    View notifications
                                </span>
                                <FontAwesomeIcon icon="bell" fixedWidth />
                            </button>

                            {/* <!-- Profile dropdown --> */}
                            <div className="ml-3 relative">
                                <div>
                                    <button
                                        type="button"
                                        className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                        id="user-menu-button"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                        onClick={() =>
                                            setProfileMenuOpen(!profileMenuOpen)
                                        }
                                    >
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                    </button>
                                </div>

                                {/* <!--
                          Dropdown menu, show/hide based on menu state.
                        
                          Entering: "transition ease-out duration-100"
                            From: "transform opacity-0 scale-95"
                            To: "transform opacity-100 scale-100"
                          Leaving: "transition ease-in duration-75"
                            From: "transform opacity-100 scale-100"
                            To: "transform opacity-0 scale-95"
                        --> */}
                                {profileMenuOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button"
                                        tabIndex="-1"
                                    >
                                        {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                                        <div
                                            className="block px-4 py-2 text-sm text-gray-700"
                                            role="menuitem"
                                            tabIndex="-1"
                                            id="user-menu-item-0"
                                        >
                                            Your Profile
                                        </div>
                                        <div
                                            className="block px-4 py-2 text-sm text-gray-700"
                                            role="menuitem"
                                            tabIndex="-1"
                                            id="user-menu-item-1"
                                        >
                                            Settings
                                        </div>
                                        <div
                                            className="block px-4 py-2 text-sm text-gray-700"
                                            role="menuitem"
                                            tabIndex="-1"
                                            id="user-menu-item-2"
                                        >
                                            Sign out
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Mobile menu, show/hide based on menu state. --> */}
                {pageMenuOpen && (
                    <div className="sm:hidden" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                            {pageMenu.map((_menu, _idx) => (
                                <Link
                                    key={_idx}
                                    to={_menu.path}
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {_menu.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <main>
                <Outlet />
            </main>
        </>
    );
}

export default UserLayout;
