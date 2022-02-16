import React from "react";
import { useParams } from "react-router-dom";
import { Loader, NotFound } from "../../../components";
import { mangaList } from "../../../utils/mock-data";
import InfoSection from "./info-section";

function SerieDetail() {
    const [mangaInfo, setMangaInfo] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const params = useParams();

    React.useEffect(() => {
        const [slug, id] = params.url.split("&");
        const _mangaInfo = mangaList.find((_manga) => _manga.id === id && _manga.url === slug);
        setMangaInfo(_mangaInfo);
    }, [params]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {mangaInfo ? (
                        <div>
                            <div className="w-full text-center text-4xl font-bold my-4">
                                {mangaInfo.title}
                            </div>
                            <div className="grid grid-cols-6 gap-4">
                                <div className="col-span-2">
                                    <img src={mangaInfo.img} alt={mangaInfo.title} />
                                </div>
                                <div className="col-span-4 py-4">
                                    <InfoSection mangaInfo={mangaInfo} />
                                    <div className="ring ring-gray-800">Test</div>
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

export default SerieDetail;
