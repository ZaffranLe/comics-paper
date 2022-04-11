import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../components";
import { classNames } from "../../../utils/common";

function UpdateUser({ open, onClose, onSave }) {
    const [user, setUser] = React.useState({
        username: "",
        nickname: "",
        email: "",
        password: "",
        introduction: "",
    });
    const [loading, setLoading] = React.useState(false);

    const handleChangeUserInfo = (field) => (e) => {
        setUser({ ...user, [field]: e.target.value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await onSave(user);
            onClose();
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Đăng ký thất bại, vui lòng thử lại sau."
            );
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal dimmer open={open} onClose={onClose}>
                <div className="w-1/3 bg-white border rounded-xl p-4">
                    <div className="text-xl font-bold">
                        {"Tạo tài khoản mới"}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                        <div>
                            <label>Tên đăng nhập</label>
                            <input
                                className="input w-full"
                                value={user.username}
                                onChange={handleChangeUserInfo("username")}
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                className="input w-full"
                                value={user.email}
                                onChange={handleChangeUserInfo("email")}
                            />
                        </div>
                        <div>
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                className="input w-full"
                                value={user.password}
                                onChange={handleChangeUserInfo("password")}
                            />
                        </div>
                        <div>
                            <label>Biệt danh</label>
                            <input
                                className="input w-full"
                                value={user.nickname}
                                onChange={handleChangeUserInfo("nickname")}
                            />
                        </div>
                        <div className="col-span-2">
                            <label>Giới thiệu</label>
                            <textarea
                                rows={3}
                                className="input w-full"
                                value={user.introduction}
                                onChange={handleChangeUserInfo("introduction")}
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <button
                            onClick={handleSave}
                            className={classNames(
                                !loading &&
                                    "hover:bg-indigo-400 hover:text-white",
                                "ring-2 ring-indigo-400 text-indigo-400 font-semibold py-2 px-4 rounded-full mr-2"
                            )}
                            disabled={loading}
                        >
                            {loading ? (
                                <FontAwesomeIcon
                                    icon="spinner"
                                    spin
                                    fixedWidth
                                />
                            ) : (
                                "Lưu"
                            )}
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

export default UpdateUser;
