import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader, NotFound } from "../../../../components";
import * as comicApi from "../../../../utils/api/comics";

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
                                        className="border border-gray-800 rounded-lg"
                                    />
                                </div>
                                <div className="col-span-3 py-4">
                                    Test
                                </div>
                            </div>
                            <div className="w-full text-center text-2xl font-bold my-4">
                                Danh sách chương
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
