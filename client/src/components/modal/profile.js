import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Modal } from "../";
import { classNames } from "../../utils/common";
import * as authActions from "../../redux/slices/auth";

function Profile() {
    const {
        profile: { info: user, modal: open, loading },
    } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (open) {
            dispatch(authActions.getProfile());
        }
    }, [open, dispatch]);

    const handleChangeUserInfo = (field) => (e) => {
        dispatch(
            authActions.updateProfileInfo({ field, value: e.target.value })
        );
    };

    const handleCloseProfile = () => {
        dispatch(authActions.setProfileModal(false));
    };

    const handleSave = async () => {
        dispatch(authActions.updateProfile());
    };

    return (
        <>
            <Modal dimmer open={open} onClose={handleCloseProfile}>
                <div className="w-1/3 bg-white border rounded-xl p-4">
                    <div className="text-xl font-bold">Cập nhật tài khoản</div>
                    <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                        <div>
                            <label>Tên đăng nhập</label>
                            <input
                                className="input w-full"
                                value={user.username}
                                disabled
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
                        <div className="col-span-2">
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
                            onClick={handleCloseProfile}
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

export default Profile;
