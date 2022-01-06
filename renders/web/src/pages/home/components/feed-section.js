import React from "react";
import { Link } from "react-router-dom";
import { latestChapters } from "../../../utils/mock-data";

function FeedSection() {
    return (
        <>
            <div>
                <div>
                    <div className="flex gap-4 text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
                        <div>
                            <span className="bg-gray-900 text-white px-2 py-1 rounded">
                                Chương
                            </span>
                        </div>
                        <div>
                            <span className="underline">Mới nhất</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <table className="border-collapse table-auto w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="w-12 lg:w-36">Thể loại</th>
                                <th>Truyện</th>
                                <th>Chương</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestChapters.map((_chapter, _idx) => (
                                <tr key={_idx}>
                                    <td className="border-b border-gray-200 p-2">
                                        <span className="capitalize bg-gray-800 text-white px-2 py-1 rounded">
                                            {_chapter.type}
                                        </span>
                                    </td>
                                    <td className="border-b border-gray-200 p-2">
                                        <Link
                                            to={`/series/${_chapter.url}-${_chapter.id}`}
                                        >
                                            {_chapter.title}
                                        </Link>
                                    </td>
                                    <td className="border-b border-gray-200 p-2">
                                        <Link
                                            to={`/series/${_chapter.url}-${_chapter.id}/chapter/${_chapter.chapter}`}
                                        >
                                            <span className="block md:hidden">
                                                Ch.{_chapter.chapter}
                                            </span>
                                            <span className="hidden md:block">
                                                Chương {_chapter.chapter}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="border-b border-gray-200 p-2">
                                        {_chapter.time.toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default FeedSection;
