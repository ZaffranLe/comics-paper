import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader, NotFound } from "../../../components";
import * as comicApi from "../../../utils/api/comics";

function ComicChapter() {
    const [comic, setComic] = React.useState(null);
    const [chapterInfo, setChapterInfo] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        const [, comicId] = params.url.split("&");
        const [, chapterId] = params.chapterUrl.split("&");
        fetchChapter(comicId, chapterId);
    }, [params]);

    const fetchChapter = async (comicId, chapterId) => {
        try {
            setLoading(true);
            const chapterResp = await comicApi.getComicChapter(comicId, chapterId);
            const chapter = chapterResp.data;
            setChapterInfo(chapter);
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Lấy thông tin truyện thất bại! Vui lòng thử lại sau."
            );
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {comic ? (
                        <div className="mb-8">
                            {/* Header section */}
                            <div className="w-full text-center text-4xl font-bold my-4">
                                {comic.name}
                            </div>
                            <div className="w-full text-center text-2xl font-semibold my-4">
                                {chapterInfo.name}
                            </div>
                            <div className="text-sm my-4">
                                <Link className="font-semibold" to="/">
                                    Trang chủ
                                </Link>{" "}
                                /{" "}
                                <Link className="font-semibold" to="/comics">
                                    Danh sách truyện
                                </Link>{" "}
                                /{" "}
                                <Link
                                    className="font-semibold"
                                    to={`/comics/${comic.url}&${comic.id}`}
                                >
                                    {comic.name}
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
                                <Link className="font-semibold" to="/comics">
                                    Danh sách truyện
                                </Link>{" "}
                                /{" "}
                                <Link
                                    className="font-semibold"
                                    to={`/comics/${comic.url}&${comic.id}`}
                                >
                                    {comic.name}
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

export default ComicChapter;
