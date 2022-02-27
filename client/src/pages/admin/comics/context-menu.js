import React from "react";
import { Modal } from "../../../components";

function ContextMenu({
    open,
    onClose,
    updateComic,
    onClickUpdate,
    onShowChapterList,
    onClickDelete,
}) {
    return (
        <>
            {updateComic && (
                <Modal dimmer open={open} onClose={onClose}>
                    <div className="w-1/6 bg-white border rounded-xl p-4">
                        <div className="text-lg font-semibold">Truyện: {updateComic.name}</div>
                        <button
                            className="w-full rounded-lg bg-gray-200 py-2 my-2 hover:bg-gray-300"
                            onClick={() => onClickUpdate()}
                        >
                            Chỉnh sửa thông tin
                        </button>
                        <button
                            className="w-full rounded-lg bg-gray-200 py-2 my-2 hover:bg-gray-300"
                            onClick={onShowChapterList}
                        >
                            Danh sách chương
                        </button>
                        <button
                            className="w-full rounded-lg bg-gray-200 py-2 my-2 hover:bg-gray-300"
                            onClick={() => onClickDelete(updateComic)}
                        >
                            Xóa
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default ContextMenu;
