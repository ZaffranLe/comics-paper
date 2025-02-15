import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, NotFound } from "../../../components";
import InfoSection from "./info-section";
import * as comicApi from "../../../utils/api/comics";
import { toast } from "react-toastify";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../../../redux/slices/auth";
import { getImageUrl } from "../../../utils/common";

function ComicDetail() {
  const [comic, setComic] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [reviewData, setReviewData] = React.useState({
    reviewExist: false,
    ratingIcons: [0, 0, 0, 0, 0],
    content: "",
  });
  const {
    profile: { info: user },
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const fetchComic = async (slug) => {
    try {
      setLoading(true);
      const comicResp = await comicApi.getComicBySlug(slug);
      const _comic = comicResp.data.comic;
      const apiList = [
        comicApi.getAllComicChapters(_comic.id),
        comicApi.getReviewsByComic(_comic.id),
        comicApi.getFollowState(_comic.id),
      ];
      const resps = await Promise.all(apiList);
      const [chaptersResp, reviewsResp, followStateResp] = resps;
      _comic.chapters = chaptersResp.data;
      _comic.reviews = reviewsResp.data;
      _comic.isFollow = followStateResp.data;
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

  React.useEffect(() => {
    fetchComic(params.slug);
  }, [params]);

  React.useEffect(() => {
    if (comic) {
      document.title = `${comic.name} - Virtuoso Translation`;
      if (user) {
        const _reviewExist = comic.reviews.find(
          (_review) => _review.user.id === user.id
        );
        setReviewData({ ...reviewData, reviewExist: _reviewExist });
      }
    }
  }, [comic, user]);

  const handleViewChapter = (chapter) => {
    // Extract the current slug
    const { slug } = params;
    navigate(`/comics/${slug}/chapter/${chapter.name}&${chapter.id}`);
  };

  const handleUpdateRating = (rating) => {
    setReviewData({
      ...reviewData,
      ratingIcons: reviewData.ratingIcons.map((_rate, _idx) =>
        _idx <= rating ? 1 : 0
      ),
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

  const handleOpenLoginModal = () => {
    dispatch(authActions.setLoginModal("login"));
  };

  const handleFollowComic = async () => {
    try {
      const resp = await comicApi.followComic(comic.id);
      setComic({ ...comic, isFollow: resp.data });
    } catch (e) {
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
                    src={getImageUrl(comic.thumbnailImg)}
                    alt={comic.name}
                  />
                </div>
                <div className="col-span-3 py-4">
                  <InfoSection
                    comic={comic}
                    handleFollowComic={handleFollowComic}
                  />
                </div>
              </div>
              <div className="w-full text-center text-2xl font-bold my-4">
                Danh sách chương
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {comic.chapters.length > 0 ? (
                  comic.chapters.map((_chapter) => (
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
                  ))
                ) : (
                  <>
                    <span className="text-lg">Chưa có chương truyện nào</span>
                  </>
                )}
              </div>
              <div>
                <div className="w-full text-2xl font-bold my-4">Đánh giá</div>
              </div>
              <div className="w-full">
                {user.id && !reviewData.reviewExist && (
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
                {!user.id && comic.reviews.length === 0 && (
                  <>
                    <span className="text-lg">
                      Chưa có đánh giá nào.{" "}
                      <span
                        className="font-bold cursor-pointer hover:underline"
                        onClick={handleOpenLoginModal}
                      >
                        Đăng nhập
                      </span>{" "}
                      để trở thành người đầu tiên đưa ra nhận xét về bộ truyện
                      này nhé
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
                        {moment(_review.createdAt).format("HH:mm DD/MM/YYYY")}
                      </span>
                    </div>
                    <div>
                      {ratingIcons.map((_icon, _idx) => (
                        <FontAwesomeIcon
                          key={_idx}
                          className="text-yellow-400 cursor-pointer text-xl"
                          icon={
                            _idx < _review.rating ? "fa-star" : "far fa-star"
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
