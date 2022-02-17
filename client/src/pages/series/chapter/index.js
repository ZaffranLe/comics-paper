import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader, NotFound } from "../../../components";
import { mangaList } from "../../../utils/mock-data";

function SerieChapter() {
    const [mangaInfo, setMangaInfo] = React.useState(null);
    const [chapterInfo, setChapterInfo] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        const [mangaSlug, mangaId] = params.url.split("&");
        const [chapterName, chapterId] = params.chapterUrl.split("&");
        const _mangaInfo = mangaList.find(
            (_manga) => _manga.id === mangaId && _manga.url === mangaSlug
        );
        setMangaInfo(_mangaInfo);
        setChapterInfo({ name: chapterName });
    }, [params]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {mangaInfo ? (
                        <div className="mb-8">
                            {/* Header section */}
                            <div className="w-full text-center text-4xl font-bold my-4">
                                {mangaInfo.title}
                            </div>
                            <div className="w-full text-center text-2xl font-semibold my-4">
                                {chapterInfo.name}
                            </div>
                            <div className="text-sm my-4">
                                <Link className="font-semibold" to="/">
                                    Trang chủ
                                </Link>{" "}
                                /{" "}
                                <Link className="font-semibold" to="/series">
                                    Danh sách truyện
                                </Link>{" "}
                                /{" "}
                                <Link
                                    className="font-semibold"
                                    to={`/series/${mangaInfo.url}&${mangaInfo.id}`}
                                >
                                    {mangaInfo.title}
                                </Link>{" "}
                                / {chapterInfo.name}
                            </div>
                            <div className="my-4 flex items-center">
                                <div>
                                    <select className="border border-gray-800 rounded-lg p-1 cursor-pointer">
                                        <option value="chap 1">Chương 1</option>
                                        <option value="chap 1">Chương 2</option>
                                        <option value="chap 1">Chương 3</option>
                                    </select>
                                </div>
                                <div className="flex-grow text-right">
                                    <button className="bg-gray-800 text-white hover:bg-gray-600 rounded-xl p-2 mr-1">
                                        Chương trước
                                    </button>
                                    <button className="bg-gray-800 text-white hover:bg-gray-600 rounded-xl p-2 ml-1">
                                        Chương sau
                                    </button>
                                </div>
                            </div>
                            {/* Content section */}
                            <div></div>
                            {/* Footer section */}
                            <div className="text-sm my-4">
                                <Link className="font-semibold" to="/">
                                    Trang chủ
                                </Link>{" "}
                                /{" "}
                                <Link className="font-semibold" to="/series">
                                    Danh sách truyện
                                </Link>{" "}
                                /{" "}
                                <Link
                                    className="font-semibold"
                                    to={`/series/${mangaInfo.url}&${mangaInfo.id}`}
                                >
                                    {mangaInfo.title}
                                </Link>{" "}
                                / {chapterInfo.name}
                            </div>
                            <div className="my-4 flex items-center">
                                <div>
                                    <select className="border border-gray-800 rounded-lg p-1 cursor-pointer">
                                        <option value="chap 1">Chương 1</option>
                                        <option value="chap 1">Chương 2</option>
                                        <option value="chap 1">Chương 3</option>
                                    </select>
                                </div>
                                <div className="flex-grow text-right">
                                    <button className="bg-gray-800 text-white hover:bg-gray-600 rounded-xl p-2 mr-1">
                                        Chương trước
                                    </button>
                                    <button className="bg-gray-800 text-white hover:bg-gray-600 rounded-xl p-2 ml-1">
                                        Chương sau
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <NotFound />
                    )}
                </>
            )}
        </>
    );
}

export default SerieChapter;
