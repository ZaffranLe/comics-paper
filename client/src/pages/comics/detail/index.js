import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, NotFound } from "../../../components";
import InfoSection from "./info-section";
import * as comicApi from "../../../utils/api/comics";
import { toast } from "react-toastify";

function ComicDetail() {
    const [comic, setComic] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const params = useParams();
    const navigate = useNavigate();

    const fetchComic = async (url) => {
        try {
            const resp = await comicApi.getComicByUrl(url);
            setComic(resp.data.comic);
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Lấy thông tin truyện thất bại! Vui lòng thử lại sau."
            );
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchComic(params.url);
    }, [params]);

    const handleViewChapter = (chapter) => {
        navigate(`/comics/${params.url}/chapter/${chapter.name}&${chapter.id}`);
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {comic ? (
                        <div className="mb-8">
                            <div className="w-full text-center text-4xl font-bold my-4">
                                {comic.name}
                            </div>
                            <div className="grid grid-cols-4 gap-12">
                                <div>
                                    <img
                                        src={`${process.env.REACT_APP_ORIGIN_BACKEND}/public/${comic.thumbnail}`}
                                        alt={comic.name}
                                    />
                                </div>
                                <div className="col-span-3 py-4">
                                    <InfoSection comic={comic} />
                                </div>
                            </div>
                            <div className="w-full text-center text-2xl font-bold my-4">
                                Danh sách chương
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div
                                    onClick={() =>
                                        handleViewChapter({ name: "test", id: "abcdefu" })
                                    }
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
                                </div>
                                <div
                                    onClick={() => handleViewChapter()}
                                    className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                >
                                    <div>Chương 1 - Khởi đầu mới</div>
                                    <span className="font-light">01-01-2022</span>
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

export default ComicDetail;
