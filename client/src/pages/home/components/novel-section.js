import React from "react";
import { mangaList } from "../../../utils/mock-data";
import { ComicThumbnail } from "../../../components";

function ComicSection() {
    return (
        <>
            <div>
                <div>
                    <div className="flex gap-4 text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
                        <div>
                            <span className="bg-gray-900 text-white px-2 py-1 rounded">
                                Novel
                            </span>
                        </div>
                        <div>
                            <span className="underline">Mới nhất</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                    {mangaList.map((_comic) => (
                        <ComicThumbnail key={_comic.id} comic={_comic} url={`/comics/${_comic.slug}&${_comic.id}`} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default ComicSection;
