import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

function BookTrending({ info, idx }) {
    return (
        <>
            <Link to={`/${info.type}/${info.url}`}>
                <div className="group cursor:pointer p-4 grid grid-cols-8">
                    <div className="col-span-1 text-center flex items-center">
                        <button className="ring ring-gray-800 rounded-xl w-6 h-6">
                            {idx + 1}
                        </button>
                    </div>
                    <div className="col-span-2">
                        <img
                            src={info.img}
                            alt={info.title}
                            className="h-24 ring-1 ring-gray-800 rounded"
                        />
                    </div>
                    <div className="col-span-5">
                        <div className="font-bold group-hover:underline">
                            {info.title}
                        </div>
                        <div>
                            <FontAwesomeIcon
                                icon="star"
                                className="text-orange-400"
                            />{" "}
                            {info.rating} - {info.reviews} đánh giá
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default BookTrending;
