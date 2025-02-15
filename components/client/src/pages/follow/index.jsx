import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkTokenValid } from '../../utils/common';
import { ComicThumbnail } from '../../components';
import * as comicApi from '../../utils/api/comics';

function Follow() {
  const [comics, setComics] = React.useState([]);
  const {
    isAuthenticated,
    profile: { info: user },
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      const tokenValid = checkTokenValid();
      if (!tokenValid) {
        navigate('/');
      }
    }
    fetchFollowingComics();
  }, []);

  const fetchFollowingComics = async () => {
    try {
      const resp = await comicApi.getFollowingComics();
      setComics(resp.data);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <h1 className="text-xl font-semibold">Truyện đang theo dõi</h1>
      <div className="md:col-span-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
          {comics.map((_comic, _idx) => (
            <div key={_comic.id}>
              <ComicThumbnail comic={_comic} url={`/comics/${_comic.slug}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Follow;
