import React from "react";
import { Modal } from "../../../components";
import * as comicApi from "../../../utils/api/comics";

function ChapterList({ open, onClose, updateComic }) {
    const [chapters, setChapters] = React.useState([]);

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

    return (
        <>
            {updateComic && (
                <Modal dimmer open={open} onClose={onClose}>
                    <div className="w-1/2 bg-white border rounded-xl p-4">
                        <div className="text-xl font-semibold">Danh sách chương</div>
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
                    </div>
                </Modal>
            )}
        </>
    );
}

export default ChapterList;
