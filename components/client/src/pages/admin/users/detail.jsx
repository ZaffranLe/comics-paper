import React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as userApi from '../../../utils/api/users';
import { classNames } from '../../../utils/common';
import ComicList from './comic-list';
import CommentList from './comment-list';
import ReviewList from './review-list';

function AdminUserDetail() {
  const EMENU_LIST = {
    COMICS: 'comics',
    REVIEWS: 'reviews',
    COMMENTS: 'comments',
  };

  const MENU_LIST = [
    {
      name: 'Truyện đã đăng',
      key: 'comics',
    },
    {
      name: 'Đánh giá truyện',
      key: 'reviews',
    },
    {
      name: 'Bình luận truyện',
      key: 'comments',
    },
  ];
  const [userDetail, setUserDetail] = React.useState({});
  const [activeMenu, setActiveMenu] = React.useState(EMENU_LIST.COMICS);
  const params = useParams();

  React.useEffect(() => {
    const userId = params.id;
    fetchUserDetail(userId);
  }, [params]);

  const fetchUserDetail = async (id) => {
    try {
      const resp = await userApi.getUserDetail(id);
      setUserDetail(resp.data);
    } catch (e) {
      console.error(e);
      toast.error('Lấy thông tin người dùng thất bại');
    }
  };

  return (
    <>
      <div className="text-2xl font-bold">Chi tiết người dùng</div>
      <div className="flex gap-x-32 items-center mt-2">
        <div>
          <p>
            <span className="font-semibold">Email: </span>
            <span>{userDetail.user?.email}</span>
          </p>
          <p>
            <span className="font-semibold">Username: </span>
            <span>{userDetail.user?.username}</span>
          </p>
          <p>
            <span className="font-semibold">Nickname: </span>
            <span>{userDetail.user?.nickname}</span>
          </p>
          <p>
            <span className="font-semibold">Introduction: </span>
            <span>{userDetail.user?.introduction}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-x-4 mt-8">
        {MENU_LIST.map((_menu) => (
          <button
            key={_menu.key}
            onClick={() => setActiveMenu(_menu.key)}
            className={classNames(
              'border border-black rounded-lg p-2',
              activeMenu === _menu.key && 'bg-black text-white font-semibold',
            )}
          >
            {_menu.name}
          </button>
        ))}
      </div>
      {activeMenu === EMENU_LIST.COMICS && (
        <ComicList comics={userDetail.comics} />
      )}
      {activeMenu === EMENU_LIST.REVIEWS && (
        <ReviewList reviews={userDetail.reviews} />
      )}
      {activeMenu === EMENU_LIST.COMMENTS && (
        <CommentList comments={userDetail.comments} />
      )}
    </>
  );
}

export default AdminUserDetail;
