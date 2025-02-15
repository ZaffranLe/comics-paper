import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '..';
import * as authActions from '../../../redux/slices/auth';
import BookLibrary from '../../../assets/img/library.jpg';
import LoginTab from './login-tab';
import RegisterTab from './register-tab';
import classNames from 'classnames';

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
        <div
          className={classNames(
            'flex flex-row bg-white rounded-xl ring-1 ring-gray-300',
            'md:min-w-2/3 w-2/3 max-w-[95%]',
            'items-center',
            'px-4',
            'py-2',
            'gap-4',
          )}
        >
          <div className={classNames(`flex-1`, `w-3/6`)}>
            {tabs[loginModal]}
          </div>
          <div className="hidden lg:flex w-3/6 m-6">
            <img
              src={BookLibrary}
              alt="Book Library"
              className={classNames(` h-auto`)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default LoginModal;
