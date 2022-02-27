import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

function ComicTrending({ comic, idx }) {
    return (
        <>
            <Link to={`/comics/${comic.slug}&${comic.id}`}>
                <div className="group cursor:pointer p-4 grid grid-cols-8 gap-4">
                    <div className="col-span-1 text-center flex items-center">
                        <button className="ring ring-gray-800 rounded-xl w-6 h-6">
                            {idx + 1}
                        </button>
                    </div>
                    <div className="col-span-2">
                        <img
                            src={`${process.env.REACT_APP_ORIGIN_BACKEND}/public/${comic.thumbnailImg}`}
                            alt={comic.name}
                            className="h-24 w-full ring-1 ring-gray-800 rounded"
                        />
                    </div>
                    <div className="col-span-5">
                        <div className="font-bold group-hover:underline">
                            {comic.name}
                        </div>
                        <div>
                            <FontAwesomeIcon
                                icon="star"
                                className="text-orange-400"
                            />{" "}
                            {comic.likes} - {comic.likes} đánh giá
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default ComicTrending;
