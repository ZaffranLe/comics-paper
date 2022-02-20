import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../components";
import { classNames } from "../../../utils/common";

function UpdateSerie({ open, onClose, onSave, updateSerie }) {
    const [keyword, setKeyword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (updateSerie) {
            setKeyword(updateSerie.keyword);
        }
    }, [updateSerie]);

    const handleChangeKeyword = (e) => {
        setKeyword(e.target.value);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await onSave(keyword);
            onClose();
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Cập nhật truyện thất bại, vui lòng thử lại sau."
            );
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const disableSaveBtn = loading || (updateSerie && keyword === updateSerie.keyword);

    return (
        <>
            <Modal dimmer open={open} onClose={onClose}>
                <div className="w-1/3 bg-white border rounded-xl p-4">
                    <div className="text-xl font-bold">
                        {updateSerie ? "Cập nhật truyện" : "Tạo truyện mới"}
                    </div>
                    <div className="grid grid-cols-3 my-4">
                        <div>
                            Thumb nail
                        </div>
                        <div className="col-span-2">
                            <div>
                                <label>Tên truyện</label>
                                <input className="input w-full" />
                            </div>
                            <div>
                                <label>Tóm tắt</label>
                                <textarea className="input w-full" />
                            </div>
                            <div>
                                <label>Tác giả</label>
                                <input className="input w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <button
                            onClick={handleSave}
                            className={classNames(
                                !disableSaveBtn && "hover:bg-indigo-400 hover:text-white",
                                "ring-2 ring-indigo-400 text-indigo-400 font-semibold py-2 px-4 rounded-full mr-2"
                            )}
                            disabled={disableSaveBtn}
                        >
                            {loading ? <FontAwesomeIcon icon="spinner" spin fixedWidth /> : "Lưu"}
                        </button>
                        <button
                            onClick={onClose}
                            className="ring-2 ring-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white font-semibold py-2 px-4 rounded-full ml-2"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default UpdateSerie;
