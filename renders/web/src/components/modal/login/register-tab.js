import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as authActions from "../../../redux/slices/auth";
import * as authApi from "../../../utils/api/users";
import { classNames } from "../../../utils/common";

function RegisterTab(props) {
    const [registerInfo, setRegisterInfo] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleChangeRegisterInfo =
        (name) =>
        ({ target: { value } }) => {
            setRegisterInfo({ ...registerInfo, [name]: value });
        };

    const handleSwitchToLogin = () => {
        dispatch(authActions.setLoginModal("login"));
    };

    const handleRegister = async () => {
        try {
            if (registerInfo.password !== registerInfo.confirmPassword) {
                toast.error("Mật khẩu không trùng khớp.");
            } else {
                setLoading(true);
                await authApi.register(registerInfo);
                toast.success("Đăng ký thành công.");
                handleSwitchToLogin();
            }
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
            <div className="w-full h-full p-4 flex flex-col gap-4 justify-center">
                <div className="font-semibold text-xl border-l-8 border-gray-800 pl-8">
                    Đăng ký
                </div>
                <div>
                    <input
                        placeholder="Tên đăng nhập"
                        className="input w-full"
                        value={registerInfo.username}
                        onChange={handleChangeRegisterInfo("username")}
                    />
                </div>
                <div>
                    <input
                        placeholder="Mật khẩu"
                        className="input w-full"
                        value={registerInfo.password}
                        type="password"
                        onChange={handleChangeRegisterInfo("password")}
                    />
                </div>
                <div>
                    <input
                        placeholder="Xác nhận mật khẩu"
                        className="input w-full"
                        value={registerInfo.confirmPassword}
                        type="password"
                        onChange={handleChangeRegisterInfo("confirmPassword")}
                    />
                </div>
                <button
                    className={classNames(
                        loading
                            ? "bg-gray-500"
                            : "bg-gray-800 hover:bg-gray-700",
                        "text-white py-2 rounded focus:bg-gray-600"
                    )}
                    disabled={loading}
                    onClick={handleRegister}
                >
                    Đăng ký
                </button>
                <div>
                    <span
                        className="font-semibold cursor-pointer hover:underline"
                        onClick={handleSwitchToLogin}
                    >
                        Đã có tài khoản? Đăng nhập ngay
                    </span>
                </div>
            </div>
        </>
    );
}

export default RegisterTab;