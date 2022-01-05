import React from "react";

function MangaThumbnail({ manga }) {
    return (
        <>
            <div>
                <div className="peer bg-gray-900 rounded-xl h-60 cursor-pointer overflow-hidden">
                    <div className="h-full bg-gradient-to-b from-transparent to-black p-2">
                        <div className="flex h-1/2 items-start justify-end">
                            <span className="float-right bg-gray-800 text-white px-2 py-1 rounded">
                                Manga
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
                    {manga.title}
                </div>
            </div>
        </>
    );
}

export default MangaThumbnail;
