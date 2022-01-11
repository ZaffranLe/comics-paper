import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AdminLayout() {
    const [activeMenu, setActiveMenu] = useState("");

    const menu = [
        {
            name: "Tài khoản",
            path: "/dashboard/users",
            icon: "user",
        },
        {
            name: "Bảo mật",
            path: "/series",
            icon: "unlock-alt",
        },
        {
            name: "Truyện",
            path: "/series",
            icon: "book",
            subMenu: [
                {
                    name: "Thể loại",
                    path: "/dashboard/series/tags",
                },
                {
                    name: "Tác giả",
                    path: "/dashboard/series/authors",
                },
                {
                    name: "Danh sách truyện",
                    path: "/series",
                },
            ],
        },
    ];
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <div className="flex grow">
                    <div className="bg-gray-900 p-4 text-white w-1/6">
                        <div className="text-center my-2">
                            <Link to="/dashboard">
                                <span className="hidden lg:block font-mono text-2xl text-purple-50">
                                    Virtuoso
                                </span>
                            </Link>
                            <Link to="/dashboard">
                                <span className="block lg:hidden font-mono text-2xl text-purple-50">
                                    VT
                                </span>
                            </Link>
                        </div>
                        <div className="ring-2 ring-white rounded p-2">
                            {menu.map((_item, _idx) => (
                                <div
                                    key={_idx}
                                    className="flex font-semibold cursor-pointer hover:bg-gray-500 my-1 p-2 rounded"
                                >
                                    <div className="grow">
                                        <FontAwesomeIcon
                                            icon={_item.icon}
                                            fixedWidth
                                        />{" "}
                                        {_item.name}
                                    </div>
                                    {_item.subMenu && (
                                        <div>
                                            <FontAwesomeIcon
                                                icon="chevron-right"
                                                fixedWidth
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grow grid grid-rows-1 gap-16 mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                        <Outlet />
                    </div>
                </div>
                <div className="flex items-center bg-gray-800 text-gray-300 p-3">
                    <span className="mx-auto">
                        Player Zaff, 2020. All rights reserved.
                    </span>
                </div>
            </div>
        </>
    );
}

export default AdminLayout;
