import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as authActions from "../../../redux/slices/auth";

function RegisterTab(props) {
    const [registerInfo, setRegisterInfo] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const dispatch = useDispatch();

    const handleChangeRegisterInfo =
        (name) =>
        ({ target: { value } }) => {
            setRegisterInfo({ ...registerInfo, [name]: value });
        };

    const handleSwitchToLogin = () => {
        dispatch(authActions.setLoginModal("login"));
    };

    return (
        <>
            <form className="w-full h-full p-4 flex flex-col gap-4 justify-center">
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
                    className="bg-gray-800 text-white py-2 rounded focus:bg-gray-600"
                    type="submit"
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
            </form>
        </>
    );
}

export default RegisterTab;
