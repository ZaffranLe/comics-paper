import React from "react";
import { Link } from "react-router-dom";

function BookThumbnail({ info }) {
    return (
        <>
            <Link to={`/series/${info.url}`}>
                <div>
                    <div
                        style={{
                            backgroundImage: `url(${info.img})`,
                            backgroundSize: "cover",
                            backgroundPositionX: "center",
                        }}
                        className="peer rounded-xl h-60 cursor-pointer overflow-hidden ring-1 ring-gray-800"
                    >
                        <div className="h-full bg-gradient-to-t from-black via-transparent p-2">
                            <div className="flex h-1/2 items-start justify-end">
                                <span className="float-right bg-gray-800 text-white px-2 py-1 rounded">
                                    {info.category}
                                </span>
                            </div>
                            <div className="flex h-1/2 items-end">
                                <div className="flex grid grid-cols-3 items-center w-full">
                                    <div className="bg-gray-800 text-white px-2 py-1 rounded w-fit h-fit">
                                        CH.1
                                    </div>
                                    <div className="col-span-2 text-white text-right">
                                        1 tháng trước
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center font-bold cursor-pointer peer-hover:underline">
                        {info.title}
                    </div>
                </div>
            </Link>
        </>
    );
}

export default BookThumbnail;
