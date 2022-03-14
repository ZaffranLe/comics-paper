import React from "react";
import { Modal } from "../../../components";
import * as comicApi from "../../../utils/api/comics";
import { chapterViewTypeOptions, chapterViewTypes } from "../../../utils/constants";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadSingleImg from "./upload-single-img";
import * as resourceApi from "../../../utils/api/resources";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

function ChapterList({ open, onClose, updateComic }) {
    const DEFAULT_CHAPTER_INFO = {
        id: null,
        name: "",
        viewType: chapterViewTypeOptions[0].value,
        viewTypeOption: chapterViewTypeOptions[0],
        comicId: "",
        length: 0,
        blocks: [],
    };
    const [chapters, setChapters] = React.useState([]);
    const [isUpdatingChapter, setIsUpdatingChapter] = React.useState(false);
    const [chapterInfo, setChapterInfo] = React.useState(DEFAULT_CHAPTER_INFO);

    const fetchChapters = async () => {
        try {
            const resp = await comicApi.getAllComicChapters(updateComic.id);
            setChapters(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        if (updateComic) {
            fetchChapters();
        }
    }, []);

    const handleOpenUpdateChapter = async (_chapterInfo = null) => {
        if (_chapterInfo) {
            const resp = await comicApi.getComicChapter(_chapterInfo.comicId, _chapterInfo.id);
            const viewTypeKey = Object.keys(chapterViewTypes).find(
                (_key) => chapterViewTypes[_key].VALUE === resp.data.viewType
            );
            const viewTypeOption = chapterViewTypeOptions.find(
                (_option) => _option.value === chapterViewTypes[viewTypeKey].TEXT
            );
            setChapterInfo({
                ...resp.data,
                viewTypeOption,
                viewType: viewTypeOption.value,
            });
        } else {
            setChapterInfo(DEFAULT_CHAPTER_INFO);
        }
        setIsUpdatingChapter(true);
    };

    const handleCloseUpdateChapter = () => {
        setIsUpdatingChapter(false);
    };

    const handleChangeViewType = (selectedOption) => {
        setChapterInfo({
            ...chapterInfo,
            viewTypeOption: selectedOption,
            viewType: selectedOption.value,
            blocks: [],
        });
    };

    const handleChangeChapterInfo = (name) => (e) => {
        setChapterInfo({ ...chapterInfo, [name]: e.target.value });
    };

    const handleChangeImages = async (e) => {
        try {
            if (e.target.files.length > 0) {
                const resp = await resourceApi.uploadImages(e.target.files);
                const images = resp.data;
                setChapterInfo({
                    ...chapterInfo,
                    length: images.length + chapterInfo.length,
                    blocks: [
                        ...chapterInfo.blocks,
                        ...images.map((_img, _idx) => ({
                            id: uuidv4(),
                            index: _idx + chapterInfo.length + 1,
                            content: _img.fileName,
                        })),
                    ],
                });
            }
        } catch (e) {
            if (e.response.data) {
                toast.error(
                    e.response?.data?.error?.message || "Upload ảnh thất bại, vui lòng thử lại sau."
                );
            }
        }
    };

    const handleChangeUploadedImg = async (block, e) => {
        try {
            if (e.target.files.length > 0) {
                const resp = await resourceApi.uploadImages(e.target.files);
                const imgInfo = resp.data[0];
                setChapterInfo({
                    ...chapterInfo,
                    blocks: [
                        ...chapterInfo.blocks.filter((_block) => _block.id !== block.id),
                        {
                            ...block,
                            content: imgInfo.fileName,
                        },
                    ],
                });
            }
        } catch (e) {
            if (e.response.data) {
                toast.error(
                    e.response?.data?.error?.message || "Upload ảnh thất bại, vui lòng thử lại sau."
                );
            }
        }
    };

    const handleSortBlocks = () => {
        const sortedBlocks = chapterInfo.blocks.sort((a, b) => a.index - b.index);
        setChapterInfo({
            ...chapterInfo,
            blocks: sortedBlocks,
        });
    };

    const handleSave = async () => {
        try {
            if (chapterInfo.id) {
                await comicApi.updateComicChapter(updateComic.id, chapterInfo);
            } else {
                await comicApi.createComicChapter(updateComic.id, chapterInfo);
            }
        } catch (e) {
            if (e.response.data) {
                toast.error(
                    e.response?.data?.error?.message ||
                        "Cập nhật chương thất bại, vui lòng thử lại sau."
                );
            }
        }
        await fetchChapters();
        setIsUpdatingChapter(false);
    };

    return (
        <>
            {updateComic && (
                <Modal dimmer open={open} onClose={onClose}>
                    <div className="w-1/2 bg-white border rounded-xl p-4">
                        {isUpdatingChapter ? (
                            <>
                                <div className="text-2xl font-semibold">Cập nhật chương truyện</div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div>
                                            <label>Tên chương</label>
                                        </div>
                                        <input
                                            className="input w-full"
                                            value={chapterInfo.name}
                                            onChange={handleChangeChapterInfo("name")}
                                        />
                                    </div>
                                    <div>
                                        <div>
                                            <label>Cách xem</label>
                                        </div>
                                        <Select
                                            className="w-full"
                                            value={chapterInfo.viewTypeOption}
                                            options={chapterViewTypeOptions}
                                            onChange={handleChangeViewType}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSortBlocks}
                                    className="hover:bg-gray-400 hover:text-white border-2 border-gray-400 text-gray-400 font-semibold py-2 px-4 rounded-full my-2"
                                >
                                    Sắp xếp
                                </button>
                                {chapterInfo.viewType === chapterViewTypes.IMAGE.TEXT && (
                                    <>
                                        <div className="grid grid-cols-6 gap-8 max-h-80 overflow-auto">
                                            {chapterInfo.blocks.map((_block) => (
                                                <UploadSingleImg
                                                    block={_block}
                                                    handleChangeImage={handleChangeUploadedImg}
                                                    key={_block.id}
                                                />
                                            ))}
                                            <div>
                                                <label
                                                    htmlFor="chapter-images-upload"
                                                    className={
                                                        "h-40 border-green-700 border rounded-lg flex items-center cursor-pointer select-none"
                                                    }
                                                >
                                                    <div className="text-center w-full text-green-700">
                                                        <FontAwesomeIcon icon="plus" />
                                                        <div>Ảnh</div>
                                                    </div>
                                                </label>
                                                <input
                                                    id="chapter-images-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    multiple
                                                    onChange={handleChangeImages}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {chapterInfo.viewType === chapterViewTypes.TEXT.TEXT && <></>}
                                <button
                                    onClick={handleCloseUpdateChapter}
                                    className="hover:bg-gray-400 hover:text-white float-right border-2 border-gray-400 text-gray-400 font-semibold py-2 px-4 rounded-full mr-2 mt-4"
                                >
                                    Quay lại
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="hover:bg-indigo-400 hover:text-white float-right border-2 border-indigo-400 text-indigo-400 font-semibold py-2 px-4 rounded-full mr-2 mt-4"
                                >
                                    Xác nhận
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-semibold">Danh sách chương</div>
                                <button
                                    className="font-semibold hover:underline my-2"
                                    onClick={() => handleOpenUpdateChapter()}
                                >
                                    Thêm chương mới
                                </button>
                                <table className="border-collapse table-auto w-full text-left">
                                    <thead className="bg-gray-900 text-white">
                                        <tr>
                                            <th>#</th>
                                            <th>Tên</th>
                                            <th>Ngày đăng</th>
                                            <th>Thời gian chỉnh sửa</th>
                                            <th>Phân loại</th>
                                            <th>Độ dài</th>
                                            <th>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chapters.map((_chapter, _idx) => {
                                            const viewTypeKey = Object.keys(chapterViewTypes).find(
                                                (_viewType) =>
                                                    chapterViewTypes[_viewType].VALUE ===
                                                    _chapter.viewType
                                            );
                                            const viewType =
                                                chapterViewTypes[viewTypeKey]?.LABEL ||
                                                "Không xác định";
                                            return (
                                                <tr
                                                    key={_chapter.id}
                                                    className="hover:bg-gray-100 border-b border-gray-200"
                                                >
                                                    <td className="p-3">{_idx + 1}</td>
                                                    <td className="p-3">{_chapter.name}</td>
                                                    <td className="p-3">
                                                        {moment(_chapter.createdAt).format(
                                                            "HH:mm DD/MM/YYYY"
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        {moment(_chapter.updatedAt).format(
                                                            "HH:mm DD/MM/YYYY"
                                                        )}
                                                    </td>
                                                    <td className="p-3">{viewType}</td>
                                                    <td className="p-3">{_chapter.length}</td>
                                                    <td className="p-3">
                                                        <button
                                                            onClick={() =>
                                                                handleOpenUpdateChapter(_chapter)
                                                            }
                                                            className="hover:font-semibold hover:underline mr-2"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button className="hover:font-semibold hover:underline ml-2">
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default ChapterList;
