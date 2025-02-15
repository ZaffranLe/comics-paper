import { Outlet } from 'react-router-dom';

import { LoginModal, ProfileModal } from '../../index';
import UserHeader from './header';

function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-grow">
        <div id="home-banner" className="w-full shadow">
          {/* <img src={Banner} alt='megumi banner' className='mx-auto' /> */}
        </div>
        <div className="max-w-screen-xl grid grid-rows-1 gap-16 mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Outlet />
        </div>
      </main>
      <footer>
        <div className="flex items-center bg-gray-800 text-gray-300 p-3">
          {/* <span className="mx-auto">
            Player Zaff, 2020. All rights reserved.
          </span> */}
        </div>
      </footer>
      <LoginModal />
      <ProfileModal />
    </div>
  );
}

export default UserLayout;
