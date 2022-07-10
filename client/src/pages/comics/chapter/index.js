import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader, NotFound } from "../../../components";
import * as comicApi from "../../../utils/api/comics";
import Select from "react-select";
import { chapterViewTypes } from "../../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classNames, getUserInfoFromToken } from "../../../utils/common";
import moment from "moment";
import { useSelector } from "react-redux";
import { v1 } from "uuid";

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
    const [comments, setComments] = React.useState([]);
    const [commentContent, setCommentContent] = React.useState("");
    const [chapterOptions, setChapterOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [fontSize, setFontSize] = React.useState(DEFAULT_FONT_SIZE);
    const [colorMode, setColorMode] = React.useState(COLOR_MODE.LIGHT);
    const {
        profile: { info: user },
    } = useSelector((state) => state.auth);
    const params = useParams();

    React.useEffect(() => {
        const { slug } = params;
        const [chapterSlug, chapterId] = params.chapterUrl.split("&");
        if (!comic || comic.slug !== slug) {
            fetchComic(slug);
        }
        // if (!chapter || chapter.name !== chapterSlug || chapter.id !== chapterId)
        //     fetchChapter(comicId, chapterId);
    }, [params]);

    React.useEffect(() => {
        if (comic && chapter) {
            document.title = `${comic.name} - ${chapter.name}`;
        }
    }, [comic, chapter]);

    const increaseComicView = async (comicId) => {
        try {
            await comicApi.increaseView(comicId);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchComic = async (slug) => {
        try {
            const resp = await comicApi.getComicBySlug(slug);
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
            increaseComicView(_comic.id);
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
            await fetchChapterComment(chapterId);
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

    const fetchChapterComment = async (chapterId) => {
        try {
            const commentResp = await comicApi.getAllComment(chapterId);
            const comments = commentResp.data;
            setComments(comments);
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Lấy thông tin chương truyện thất bại! Vui lòng thử lại sau."
            );
            console.error(e);
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

    const handleChangeCommentContent = (e) => {
        setCommentContent(e.target.value);
    };

    const handleSubmitComment = async () => {
        try {
            const comment = {
                content: commentContent,
            };
            const resp = await comicApi.createComment(chapter.id, comment);
            setComments([
                {
                    ...resp.data,
                },
                ...comments,
            ]);
            setCommentContent("");
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message || "Bình luận thất bại! Vui lòng thử lại sau."
            );
            console.error(e);
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
                            <div>
                                <div className="w-full text-2xl font-bold my-4">Bình luận</div>
                            </div>
                            <div className="w-full">
                                {user.id && (
                                    <div>
                                        <textarea
                                            className="input w-full mt-2"
                                            placeholder="Hãy cho chúng mình biết cảm nhận của bạn về bộ truyện này"
                                            value={commentContent}
                                            onChange={handleChangeCommentContent}
                                        />
                                        <button
                                            onClick={handleSubmitComment}
                                            className="bg-gray-800 text-white font-semibold rounded-lg py-2 px-20"
                                        >
                                            Đăng
                                        </button>
                                    </div>
                                )}
                                {comments.length > 0 ? (
                                    comments.map((_comment) => (
                                        <div key={_comment.id} className="p-4">
                                            <div>
                                                <span className="font-semibold">
                                                    {_comment.author.nickname ||
                                                        _comment.author.username}
                                                </span>
                                                {" - "}
                                                <span>
                                                    {moment(_comment.createdAt).format(
                                                        "HH:mm DD/MM/YYYY"
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <pre>{_comment.content}</pre>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <span className="text-lg">Chưa có bình luận nào.</span>
                                    </>
                                )}
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
        </>
    );
}

export default ComicChapter;
