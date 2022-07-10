import React from "react";
import { ComicThumbnail } from "../../../components";

function ComicList({ comics = [] }) {
    return (
        <>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8">
                {comics.map((_comic) => (
                    <div key={_comic.id}>
                        <ComicThumbnail
                            comic={_comic}
                            url={`/comics/${_comic.slug}`}
                            newTab={true}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default ComicList;
