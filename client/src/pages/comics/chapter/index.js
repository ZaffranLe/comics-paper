import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader, NotFound } from "../../../components";
import * as comicApi from "../../../utils/api/comics";
import Select from "react-select";
import { chapterViewTypes } from "../../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classNames } from "../../../utils/common";
import moment from "moment";

function ComicChapter() {
    const COLOR_MODE = {
        DARK: "dark",
        LIGHT: "light",
    };
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 24;
    const DEFAULT_FONT_SIZE = 16;

    const [comic, setComic] = React.useState(null);
    const [chapter, setChapter] = React.useState(null);
    const [chapterOptions, setChapterOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [fontSize, setFontSize] = React.useState(DEFAULT_FONT_SIZE);
    const [colorMode, setColorMode] = React.useState(COLOR_MODE.LIGHT);
    const params = useParams();

    React.useEffect(() => {
        const [comicSlug, comicId] = params.url.split("&");
        const [chapterSlug, chapterId] = params.chapterUrl.split("&");
        if (!comic || comic.id !== comicId || comic.slug !== comicSlug) {
            fetchComic(params.url);
        }
        if (!chapter || chapter.name !== chapterSlug || chapter.id !== chapterId)
            fetchChapter(comicId, chapterId);
    }, [params]);

    React.useEffect(() => {
        if (comic && chapter) {
            document.title = `${comic.name} - ${chapter.name}`;
        }
    }, [comic, chapter]);

    const fetchComic = async (url) => {
        try {
            const resp = await comicApi.getComicByUrl(url);
            const _comic = resp.data.comic;
            const chapterListResp = await comicApi.getAllComicChapters(_comic.id);
            const chapterList = chapterListResp.data;
            _comic.chapters = chapterList;
            const _chapterOptions = chapterList.map((_chapter) => ({
                label: _chapter.name,
                value: `${_chapter.name}&${_chapter.id}`,
            }));
            setChapterOptions(_chapterOptions);
            setComic(_comic);
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Lấy thông tin truyện thất bại! Vui lòng thử lại sau."
            );
            console.error(e);
        }
    };

    const fetchChapter = async (comicId, chapterId) => {
        try {
            setLoading(true);
            const chapterResp = await comicApi.getComicChapter(comicId, chapterId);
            const chapter = chapterResp.data;
            chapter.chapterOption = {
                label: chapter.name,
                value: `${chapter.name}&${chapter.id}`,
            };
            setChapter(chapter);
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Lấy thông tin chương truyện thất bại! Vui lòng thử lại sau."
            );
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const switchColorMode = () => {
        let newColorMode = COLOR_MODE.DARK;
        if (colorMode === COLOR_MODE.DARK) {
            newColorMode = COLOR_MODE.LIGHT;
        }
        setColorMode(newColorMode);
    };

    const increaseFontSize = () => {
        if (fontSize < MAX_FONT_SIZE) {
            setFontSize(fontSize + 1);
        }
    };

    const decreaseFontSize = () => {
        if (fontSize > MIN_FONT_SIZE) {
            setFontSize(fontSize - 1);
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
                            <div className="w-full text-center text-3xl font-bold my-4">
                                {comic.name} - {chapter.name}
                            </div>
                            <NavigateSection
                                comic={comic}
                                chapter={chapter}
                                chapterOptions={chapterOptions}
                            />
                            {/* Content section */}
                            {chapter.viewType === chapterViewTypes.IMAGE.VALUE && (
                                <div>
                                    {chapter.blocks.map((_block) => (
                                        <img
                                            className="w-full"
                                            key={_block.id}
                                            src={`${process.env.REACT_APP_ORIGIN_BACKEND}/public/${_block.content}`}
                                            alt={_block.id}
                                        />
                                    ))}
                                </div>
                            )}
                            {chapter.viewType === chapterViewTypes.TEXT.VALUE && (
                                <>
                                    <div
                                        className={classNames(
                                            "divide-y p-4 rounded-xl",
                                            colorMode === COLOR_MODE.DARK &&
                                                "bg-gray-800 text-white"
                                        )}
                                        style={{ fontSize }}
                                    >
                                        <div className="flex gap-2 pb-4">
                                            <div
                                                className={classNames(
                                                    "cursor-pointer flex items-center border-2 border-gray-800 px-2 h-10 rounded-lg text-sm font-bold",
                                                    colorMode === COLOR_MODE.DARK &&
                                                        "border-2 border-white"
                                                )}
                                                onClick={decreaseFontSize}
                                            >
                                                A
                                                <FontAwesomeIcon
                                                    icon="angle-double-down"
                                                    fixedWidth
                                                />
                                            </div>
                                            <div
                                                className={classNames(
                                                    "cursor-pointer flex items-center border-2 border-gray-800 px-2 h-10 rounded-lg text-2xl font-bold",
                                                    colorMode === COLOR_MODE.DARK &&
                                                        "border-2 border-white"
                                                )}
                                                onClick={increaseFontSize}
                                            >
                                                A{" "}
                                                <FontAwesomeIcon
                                                    icon="angle-double-up"
                                                    fixedWidth
                                                />
                                            </div>
                                            <div
                                                onClick={switchColorMode}
                                                className={classNames(
                                                    "text-xl cursor-pointer flex items-center border-2 border-gray-800 px-2 h-10 rounded-lg",
                                                    colorMode === COLOR_MODE.DARK &&
                                                        "border-2 border-white"
                                                )}
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        colorMode === COLOR_MODE.DARK
                                                            ? "moon"
                                                            : "sun"
                                                    }
                                                    fixedWidth
                                                />
                                            </div>
                                        </div>
                                        {chapter.blocks.map((_block) => (
                                            <pre className="py-8" key={_block.id}>
                                                {_block.content}
                                            </pre>
                                        ))}
                                    </div>
                                </>
                            )}
                            <NavigateSection
                                comic={comic}
                                chapter={chapter}
                                chapterOptions={chapterOptions}
                            />
                        </div>
                    ) : (
                        <NotFound />
                    )}
                </>
            )}
        </>
    );
}

function NavigateSection({ comic, chapter, chapterOptions }) {
    const navigate = useNavigate();
    const handleChangeChapter = (selectedChapter) => {
        navigate(`../comics/${comic.slug}&${comic.id}/chapter/${selectedChapter.value}`, {
            replace: false,
        });
    };

    const getIndexOfChapter = () => {
        const _indexOfChapter = comic.chapters.findIndex((_chapter) => _chapter.id === chapter.id);
        return _indexOfChapter;
    };

    const handleChangeChapterByIndex = (numberOfIndex) => {
        const _indexOfChapter = getIndexOfChapter();
        const _newChapter = comic.chapters[_indexOfChapter + numberOfIndex];
        navigate(
            `../comics/${comic.slug}&${comic.id}/chapter/${_newChapter.name}&${_newChapter.id}`
        );
    };

    const indexOfChapter = getIndexOfChapter();
    return (
        <>
            <div className="text-sm my-4">
                <Link className="font-semibold" to="/">
                    Trang chủ
                </Link>{" "}
                /{" "}
                <Link className="font-semibold" to="/comics">
                    Danh sách truyện
                </Link>{" "}
                /{" "}
                <Link className="font-semibold" to={`/comics/${comic.slug}&${comic.id}`}>
                    {comic.name}
                </Link>{" "}
                / {chapter.name}
            </div>
            <div className="my-4 flex items-center">
                <div className="flex-grow">
                    <Select
                        className="w-1/3"
                        options={chapterOptions}
                        value={chapter.chapterOption}
                        onChange={handleChangeChapter}
                    />
                </div>
                <div>
                    {indexOfChapter !== comic.chapters.length - 1 && (
                        <button
                            onClick={() => handleChangeChapterByIndex(1)}
                            className="bg-gray-800 text-white hover:bg-gray-600 rounded-xl p-2 mr-1"
                        >
                            Chương trước
                        </button>
                    )}
                    {indexOfChapter !== 0 && (
                        <button
                            onClick={() => handleChangeChapterByIndex(-1)}
                            className="bg-gray-800 text-white hover:bg-gray-600 rounded-xl p-2 ml-1"
                        >
                            Chương sau
                        </button>
                    )}
                </div>
            </div>
            <div className="w-full">
                {/* {user && (
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
                {comic.reviews.map((_review) => (
                    <div key={_review.id} className="p-4">
                        <div>
                            <span className="font-semibold">
                                {_review.user.nickname || _review.user.username}
                            </span>
                            {" - "}
                            <span>{moment(_review.createdAt).format("HH:mm DD/MM/YYYY")}</span>
                        </div>
                        <div>
                            <pre>{_review.content}</pre>
                        </div>
                    </div>
                ))} */}
            </div>
        </>
    );
}

export default ComicChapter;
