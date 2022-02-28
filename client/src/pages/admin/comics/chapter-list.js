import React from "react";
import { Modal } from "../../../components";
import * as comicApi from "../../../utils/api/comics";
import { chapterViewTypeOptions, chapterViewTypes } from "../../../utils/constants";
import Select from "react-select";

function ChapterList({ open, onClose, updateComic }) {
    const [chapters, setChapters] = React.useState([]);
    const [isUpdatingChapter, setIsUpdatingChapter] = React.useState(false);
    const [chapterInfo, setChapterInfo] = React.useState({
        name: "",
        viewType: chapterViewTypeOptions[0].value,
        viewTypeOption: chapterViewTypeOptions[0],
        comicId: "",
        length: 0,
        blocks: [],
    });

    const fetchChapters = async () => {
        try {
            const resp = await comicApi.getAllComicChapters(updateComic.id);
            setChapters(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchChapters();
    }, []);

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
                                {chapterInfo.viewType === chapterViewTypes.IMAGE && <></>}
                                {chapterInfo.viewType === chapterViewTypes.TEXT && <></>}
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-semibold">Danh sách chương</div>
                                <button
                                    className="font-semibold hover:underline my-2"
                                    onClick={() => setIsUpdatingChapter(!isUpdatingChapter)}
                                >
                                    Thêm chương mới
                                </button>
                                <table className="w-full">
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
                                        {chapters.map((_chapter, _idx) => (
                                            <tr key={_chapter.id}>
                                                <td>{_idx}</td>
                                                <td>{_chapter.name}</td>
                                                <td>{_chapter.createdAt}</td>
                                                <td>{_chapter.updatedAt}</td>
                                                <td>{_chapter.viewType}</td>
                                                <td>{_chapter.length}</td>
                                            </tr>
                                        ))}
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
