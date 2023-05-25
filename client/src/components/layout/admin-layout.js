import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { checkTokenValid, classNames } from '../../utils/common';
import { ROLE } from '../../utils/constants';

function MenuItem({ item, onClick, activeMenu }) {
  return (
    <>
      <div
        className={classNames(
          activeMenu.includes(item.path) ? 'bg-gray-600' : 'hover:bg-gray-500',
          'flex font-semibold cursor-pointer my-1 p-2 rounded'
        )}
        onClick={() => onClick(item)}
      >
        <div className='grow'>
          {item.icon && <FontAwesomeIcon icon={item.icon} fixedWidth />} {item.name}
        </div>
      </div>
    </>
  );
}

function AdminLayout() {
  const {
    isAuthenticated,
    profile: { info: user },
  } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      const tokenValid = checkTokenValid();
      if (!tokenValid) {
        navigate('/');
      }
    } else if (user.role?.id !== ROLE.ADMIN) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleRedirect = (menu) => {
    if (!menu.subMenu) {
      navigate(menu.path);
    }
  };

  const menu = [
    {
      name: 'Tài khoản',
      path: '/dashboard/users',
      icon: 'user',
    },
    {
      name: 'Thể loại truyện',
      path: '/dashboard/book-tags',
      icon: 'tags',
    },
    {
      name: 'Truyện',
      path: '/dashboard/comics',
      icon: 'book',
    },
  ];
  if (!isAuthenticated || !user || user.role?.id !== ROLE.ADMIN) {
    return null;
  }
  
  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <div className='flex grow'>
          <div className='bg-gray-900 p-4 text-white w-1/6 flex-none'>
            <div className='text-center my-2'>
              <div className='font-mono text-2xl text-purple-50'>
                <Link to='/dashboard'>
                  <span className='hidden lg:block'>Virtuoso</span>
                  <span className='block lg:hidden'>VT</span>
                </Link>
              </div>
            </div>
            <div className='ring-2 ring-white rounded p-2'>
              {menu.map((_item, _idx) => (
                <MenuItem
                  key={_idx}
                  onClick={handleRedirect}
                  item={_item}
                  activeMenu={location.pathname}
                />
              ))}
            </div>
          </div>
          <div className='grow'>
            <div className='px-4 sm:px-6 lg:px-8 py-4 sticky top-0 bg-white shadow text-right'>
              <div>
                Xin chào, <span className='font-semibold'>{user.username}</span>
              </div>
            </div>
            <div className='mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
              <Outlet />
            </div>
          </div>
        </div>
        <div className='flex items-center bg-gray-900 text-gray-300 p-3'>
          <span className='mx-auto'>Player Zaff, 2020. All rights reserved.</span>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
