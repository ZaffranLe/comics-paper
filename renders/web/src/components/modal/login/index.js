import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "..";
import * as authActions from "../../../redux/slices/auth";
import BookLibrary from "../../../assets/img/library.jpg";
import LoginTab from "./login-tab";
import RegisterTab from "./register-tab";

function LoginModal(props) {
    const tabs = {
        login: <LoginTab />,
        register: <RegisterTab />,
    };
    const { loginModal } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const onClose = () => {
        dispatch(authActions.setLoginModal(false));
    };

    return (
        <>
            <Modal open={loginModal} dimmer onClose={onClose}>
                <div className="grid grid-cols-1 md:grid-cols-2 bg-white h-1/3 w-1/3 rounded-xl ring-1 ring-gray-300">
                    {tabs[loginModal]}
                    <div className="hidden md:block p-4">
                        <img
                            src={BookLibrary}
                            alt="Book Library"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default LoginModal;
