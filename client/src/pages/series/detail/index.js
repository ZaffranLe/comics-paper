import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, NotFound } from "../../../components";
import { mangaList } from "../../../utils/mock-data";
import InfoSection from "./info-section";

function SerieDetail() {
    const [mangaInfo, setMangaInfo] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        const [slug, id] = params.url.split("&");
        const _mangaInfo = mangaList.find((_manga) => _manga.id === id && _manga.url === slug);
        setMangaInfo(_mangaInfo);
    }, [params]);

    const handleViewChapter = (chapter) => {
        navigate(`/series/${params.url}/chapter/${chapter.name}&${chapter.id}`);
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {mangaInfo ? (
                        <div className="mb-8">
                            <div className="w-full text-center text-4xl font-bold my-4">
                                {mangaInfo.title}
                            </div>
                            <div className="grid grid-cols-4 gap-12">
                                <div>
                                    <img src={mangaInfo.img} alt={mangaInfo.title} />
                                </div>
                                <div className="col-span-3 py-4">
                                    <InfoSection mangaInfo={mangaInfo} />
                                </div>
                            </div>
                            <div className="w-full text-center text-2xl font-bold my-4">
                                Danh sách chương
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div onClick={() => handleViewChapter({name: "test", id: "abcdefu"})} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
                                <div onClick={() => handleViewChapter()} className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"><div>Chương 1 - Khởi đầu mới</div><span className="font-light">01-01-2022</span></div>
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

export default SerieDetail;
