import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, NotFound } from "../../../components";
import InfoSection from "./info-section";
import * as comicApi from "../../../utils/api/comics";
import { toast } from "react-toastify";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserInfoFromToken } from "../../../utils/common";
import { useSelector } from "react-redux";

function ComicDetail() {
    const [comic, setComic] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [reviewData, setReviewData] = React.useState({
        reviewExist: false,
        ratingIcons: [0, 0, 0, 0, 0],
        content: "",
    });
    const { isAuthenticated } = useSelector((state) => state.auth);
    const params = useParams();
    const navigate = useNavigate();

    const fetchComic = async (url) => {
        try {
            setLoading(true);
            const comicResp = await comicApi.getComicByUrl(url);
            const _comic = comicResp.data.comic;
            const chaptersResp = await comicApi.getAllComicChapters(_comic.id);
            _comic.chapters = chaptersResp.data;
            const reviewsResp = await comicApi.getReviewsByComic(_comic.id);
            _comic.reviews = reviewsResp.data;
            setComic(_comic);
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

    const fetchUserInfo = () => {
        const userInfo = getUserInfoFromToken();
        setUser(userInfo);
    };

    React.useEffect(() => {
        fetchComic(params.url);
    }, [params]);

    React.useEffect(() => {
        if (isAuthenticated) {
            fetchUserInfo();
        } else {
            setUser(null);
        }
    }, [isAuthenticated]);

    React.useEffect(() => {
        if (comic) {
            document.title = `${comic.name} - Virtuoso Translation`;
            if (user) {
                const _reviewExist = comic.reviews.find((_review) => _review.user.id === user.id);
                setReviewData({ ...reviewData, reviewExist: _reviewExist });
            }
        }
    }, [comic, user]);

    const handleViewChapter = (chapter) => {
        navigate(`/comics/${params.url}/chapter/${chapter.name}&${chapter.id}`);
    };

    const handleUpdateRating = (rating) => {
        setReviewData({
            ...reviewData,
            ratingIcons: reviewData.ratingIcons.map((_rate, _idx) => (_idx <= rating ? 1 : 0)),
        });
    };

    const handleChangeReviewContent = (e) => {
        setReviewData({ ...reviewData, content: e.target.value });
    };

    const handleSubmitReview = async () => {
        try {
            const _review = {
                content: reviewData.content,
                rating: reviewData.ratingIcons.filter((_rating) => _rating).length,
                userId: user.id,
                comicId: comic.id,
            };
            await comicApi.createReview(_review);
            toast.success(
                "Cảm ơn bạn đã đóng góp cho truyện này! Đánh giá sẽ được hiển thị sau khi quản trị viên duyệt."
            );
            setReviewData({
                reviewExist: true,
                ratingIcons: [0, 0, 0, 0, 0],
                content: "",
            });
        } catch (e) {
            toast.error("Gửi đánh giá thất bại! Vui lòng thử lại sau.");
            console.error(e);
        }
    };

    const ratingIcons = [0, 0, 0, 0, 0];

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
                                        className="rounded-lg border-2 border-gray-800 w-full"
                                        src={`${process.env.REACT_APP_ORIGIN_BACKEND}/public/${comic.thumbnailImg}`}
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
                                {comic.chapters.map((_chapter) => (
                                    <div
                                        key={_chapter.id}
                                        onClick={() => handleViewChapter(_chapter)}
                                        className="border-2 border-gray-800 p-2 rounded-lg hover:font-semibold cursor-pointer"
                                    >
                                        <div>
                                            Chương {_chapter.chapterNumber} - {_chapter.name}
                                        </div>
                                        <span className="font-light">
                                            {moment(_chapter.createdAt).format("HH:mm DD/MM/YYYY")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="w-full text-2xl font-bold my-4">Đánh giá</div>
                            </div>
                            <div className="w-full">
                                {user && !reviewData.reviewExist && (
                                    <div>
                                        {reviewData.ratingIcons.map((_rate, _idx) => (
                                            <FontAwesomeIcon
                                                key={_idx}
                                                className="text-yellow-400 cursor-pointer text-xl"
                                                icon={_rate ? "fa-star" : "far fa-star"}
                                                onClick={() => handleUpdateRating(_idx)}
                                            />
                                        ))}
                                        <textarea
                                            className="input w-full mt-2"
                                            placeholder="Hãy cho chúng mình biết cảm nhận của bạn về bộ truyện này"
                                            value={reviewData.content}
                                            onChange={handleChangeReviewContent}
                                        />
                                        <button
                                            onClick={handleSubmitReview}
                                            className="bg-gray-800 text-white font-semibold rounded-lg py-2 px-20"
                                        >
                                            Đăng
                                        </button>
                                    </div>
                                )}
                                {!user && comic.reviews.length === 0 && (
                                    <>
                                        <span>
                                            Chưa có đánh giá nào. <span className="font-bold cursor-pointer">Đăng nhập</span> để trở
                                            thành người đầu tiên đưa ra nhận xét về bộ truyện này
                                            nhé
                                        </span>
                                    </>
                                )}
                                {comic.reviews.map((_review) => (
                                    <div key={_review.id} className="p-4">
                                        <div>
                                            <span className="font-semibold">
                                                {_review.user.nickname || _review.user.username}
                                            </span>
                                            {" - "}
                                            <span>
                                                {moment(_review.createdAt).format(
                                                    "HH:mm DD/MM/YYYY"
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            {ratingIcons.map((_icon, _idx) => (
                                                <FontAwesomeIcon
                                                    key={_idx}
                                                    className="text-yellow-400 cursor-pointer text-xl"
                                                    icon={
                                                        _idx < _review.rating
                                                            ? "fa-star"
                                                            : "far fa-star"
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <div>
                                            <pre>{_review.content}</pre>
                                        </div>
                                    </div>
                                ))}
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
