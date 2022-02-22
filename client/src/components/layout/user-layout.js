import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Banner from "../../assets/img/megumi-bg.jpg";
import { useDispatch, useSelector } from "react-redux";
import { LoginModal, ProfileModal } from "..";
import * as authActions from "../../redux/slices/auth";

function UserLayout() {
    const [pageMenuOpen, setPageMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleOpenLoginModal = () => {
        dispatch(authActions.setLoginModal("login"));
    };

    const handleLogout = () => {
        dispatch(authActions.logout());
    };

    const handleOpenProfile = () => {
        dispatch(authActions.setProfileModal(true));
    };

    const pageMenu = [
        {
            name: "Trang chủ",
            key: "home",
            path: "/",
        },
        {
            name: "Danh sách truyện",
            key: "comic",
            path: "/comics",
        },
        {
            name: "Tìm kiếm",
            key: "search",
            path: "/advanced-search",
        },
    ];

    return (
        <>
            <nav className="bg-gray-800 sticky top-0">
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
                                <Link to="/">
                                    <span className="hidden lg:block font-mono text-2xl text-purple-50">
                                        Virtuoso Translation
                                    </span>
                                </Link>
                                <Link to="/">
                                    <span className="block lg:hidden font-mono text-2xl text-purple-50">
                                        VT
                                    </span>
                                </Link>
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
                        <div className="absolute gap-2 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <input
                                placeholder="Tìm kiếm..."
                                aria-placeholder="Tìm kiếm"
                                className="hidden sm:block p-1 rounded bg-gray-700 text-white"
                            />
                            {isAuthenticated ? (
                                <>
                                    <button
                                        type="button"
                                        className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                    >
                                        <span className="sr-only">
                                            View notifications
                                        </span>
                                        <FontAwesomeIcon
                                            icon="bell"
                                            fixedWidth
                                        />
                                    </button>
                                    {/* profile dropdown */}
                                    <div className="relative">
                                        <div>
                                            <button
                                                type="button"
                                                className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                                id="user-menu-button"
                                                aria-expanded="false"
                                                aria-haspopup="true"
                                                onClick={() =>
                                                    setProfileMenuOpen(
                                                        !profileMenuOpen
                                                    )
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
                                        {profileMenuOpen && (
                                            <div
                                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                role="menu"
                                                aria-orientation="vertical"
                                                aria-labelledby="user-menu-button"
                                            >
                                                <div
                                                    className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                                    role="menuitem"
                                                    onClick={handleOpenProfile}
                                                >
                                                    Thông tin cá nhân
                                                </div>
                                                <Link to="/dashboard">
                                                    <div
                                                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                                        role="menuitem"
                                                    >
                                                        Quản lý
                                                    </div>
                                                </Link>
                                                <div
                                                    className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                                    role="menuitem"
                                                    onClick={handleLogout}
                                                >
                                                    Đăng xuất
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div
                                    className="text-white cursor-pointer font-semibold hover:bg-gray-600 px-2 py-1 rounded"
                                    onClick={handleOpenLoginModal}
                                >
                                    Đăng nhập
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* <!-- Mobile menu, show/hide based on menu state. --> */}
                {pageMenuOpen && (
                    <div className="sm:hidden" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <input
                                placeholder="Tìm kiếm..."
                                aria-placeholder="Tìm kiếm"
                                className="w-full p-1 rounded bg-gray-700 text-white"
                            />
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
                <div id="home-banner" className="w-full shadow">
                    <img src={Banner} alt="megumi banner" className="mx-auto" />
                </div>
                <div className="max-w-screen-xl grid grid-rows-1 gap-16 mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    <Outlet />
                </div>
            </main>
            <footer>
                <div className="flex items-center bg-gray-800 text-gray-300 p-3">
                    <span className="mx-auto">
                        Player Zaff, 2020. All rights reserved.
                    </span>
                </div>
            </footer>
            <LoginModal />
            <ProfileModal />
        </>
    );
}

export default UserLayout;
