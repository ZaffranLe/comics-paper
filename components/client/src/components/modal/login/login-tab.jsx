import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as authActions from "../../../redux/slices/auth";
import * as authApi from "../../../utils/api/users";
import { classNames } from "../../../utils/common";

function LoginTab(props) {
    const [loginInfo, setLoginInfo] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleChangeLoginInfo =
        (name) =>
        ({ target: { value } }) => {
            setLoginInfo({ ...loginInfo, [name]: value });
        };

    const handleSwitchToRegister = () => {
        dispatch(authActions.setLoginModal("register"));
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            const resp = await authApi.login(loginInfo);
            localStorage.setItem("token", resp.data.token);
            toast.success("Đăng nhập thành công.");
            dispatch(authActions.setLoginModal(false));
            dispatch(authActions.setAuthenticated(true));
            dispatch(authActions.getProfile());
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Đăng nhập thất bại, vui lòng thử lại sau."
            );
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await handleLogin();
    };

    const handleKeyDownSwitchToRegister = (e) => {
        if (e.key === "Enter" || e.keyCode === 32) {
            handleSwitchToRegister();
        }
    };

    return (
        <>
            <form
                className="w-full h-full p-4 flex flex-col gap-4 justify-center"
                onSubmit={handleFormSubmit}
            >
                <div className="font-semibold text-xl border-l-8 border-gray-800 pl-8">
                    Đăng nhập
                </div>
                <div>
                    <input
                        placeholder="Tên đăng nhập"
                        className="input w-full"
                        value={loginInfo.username}
                        onChange={handleChangeLoginInfo("username")}
                    />
                </div>
                <div>
                    <input
                        placeholder="Mật khẩu"
                        className="input w-full"
                        value={loginInfo.password}
                        type="password"
                        onChange={handleChangeLoginInfo("password")}
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
                    onClick={handleLogin}
                >
                    Đăng nhập
                </button>
                <div className="flex">
                    <div className="w-1/2">
                        <span
                            className="font-semibold cursor-pointer hover:underline"
                            onClick={handleSwitchToRegister}
                            onKeyDown={handleKeyDownSwitchToRegister}
                            tabIndex={0}
                        >
                            Đăng ký
                        </span>
                    </div>
                    <div className="w-1/2 text-right">
                        <span
                            className="font-semibold cursor-pointer hover:underline"
                            tabIndex={0}
                        >
                            Quên mật khẩu?
                        </span>
                    </div>
                </div>
            </form>
        </>
    );
}

export default LoginTab;
