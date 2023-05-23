import React from "react";
import * as bookTagApi from "../../../utils/api/book-tags";
import UpdateBookTag from "./update";
import { v1 as uuidv1 } from "uuid";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../../components";

function BookTags() {
    const [bookTags, setBookTags] = React.useState([]);
    const [updateModal, setUpdateModal] = React.useState(false);
    const [updateBookTag, setUpdateBookTag] = React.useState(null);
    const [randomKey, setRandomKey] = React.useState(0);
    const [confirmModal, setConfirmModal] = React.useState({
        content: "",
        onClose: () => {},
        onConfirm: () => {},
        open: false,
        loading: false,
    });

    const fetchBookTags = async () => {
        try {
            const resp = await bookTagApi.getAllBookTag();
            setBookTags(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchBookTags();
    }, []);

    const handleOpenUpdateModal = (selectedBookTag = null) => {
        setRandomKey(uuidv1());
        setUpdateModal(true);
        if (selectedBookTag) {
            setUpdateBookTag(selectedBookTag);
        }
    };

    const handleCloseUpdateModal = () => {
        setUpdateModal(false);
        if (updateBookTag) {
            setUpdateBookTag(null);
        }
    };

    const handleSave = async (keyword) => {
        // try catch is in UpdateBookTag
        if (updateBookTag) {
            await bookTagApi.updateBookTag(updateBookTag.id, keyword);
            toast.success("Cập nhật thể loại truyện thành công");
        } else {
            await bookTagApi.createBookTag(keyword);
            toast.success("Tạo thể loại truyện thành công");
        }
        await fetchBookTags();
    };

    const handleDeleteTag = (tag) => {
        setConfirmModal({
            content: `Bạn có chắc chắn muốn xóa thể loại '${tag.keyword}' không?`,
            open: true,
            loading: false,
            onClose: () => {
                setConfirmModal({ ...confirmModal, open: false });
            },
            onConfirm: async () => {
                setConfirmModal({ ...confirmModal, loading: true });
                try {
                    await bookTagApi.deleteBookTag(tag.id);
                    toast.success("Xóa thể loại truyện thành công");
                    await fetchBookTags();
                } catch (e) {
                    console.error(e);
                    toast.error(
                        "Xóa thể loại truyện thất bại, vui lòng thử lại sau."
                    );
                } finally {
                    setConfirmModal({
                        ...confirmModal,
                        loading: false,
                        open: false,
                    });
                }
            },
        });
    };

    return (
        <>
            <div className="text-2xl font-bold">Thể loại truyện</div>
            <button
                className="bg-transparent hover:underline hover:text-indigo-500 font-semibold px-2 py-1 mt-4"
                onClick={() => handleOpenUpdateModal()}
            >
                Tạo mới
            </button>
            <div className="border rounded mt-2 overflow-hidden">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="text-center w-16">#</th>
                            <th>Từ khóa</th>
                            <th>Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookTags.map((_tag, _idx) => (
                            <tr
                                key={_tag.id}
                                className="border-t even:bg-slate-50"
                            >
                                <td className="text-center py-2">{_idx + 1}</td>
                                <td className="py-2">{_tag.keyword}</td>
                                <td className="py-2 divide-x">
                                    <button
                                        className="bg-transparent hover:underline hover:text-indigo-500 px-2 py-1"
                                        onClick={() =>
                                            handleOpenUpdateModal(_tag)
                                        }
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        className="bg-transparent hover:underline hover:text-indigo-500 px-2 py-1"
                                        onClick={() => handleDeleteTag(_tag)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UpdateBookTag
                key={randomKey}
                open={updateModal}
                onClose={handleCloseUpdateModal}
                onSave={handleSave}
                updateBookTag={updateBookTag}
            />
            <ConfirmModal {...confirmModal} />
        </>
    );
}

export default BookTags;
