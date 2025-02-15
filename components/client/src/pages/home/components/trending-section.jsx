import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { classNames } from '../../../utils/common';
import { ComicTrending } from '../../../components';
import * as comicApi from '../../../utils/api/comics';

function TrendingSection() {
  const KEYS = {
    LIKES: 'likes',
    VIEWS: 'views',
  };
  const filters = [
    {
      key: KEYS.LIKES,
      text: 'Đánh giá cao',
    },
    {
      key: KEYS.VIEWS,
      text: 'Lượt xem nhiều',
    },
  ];
  const [activeFilter, setActiveFilter] = useState(filters[0].key);
  const [comics, setComics] = useState([]);

  const fetchComics = async (key) => {
    try {
      const resp = await comicApi.getAllComicTrending({
        limit: 8,
        offset: 0,
        orderBy: key,
        orderType: 'DESC',
      });
      setComics(resp.data);
    } catch (e) {
      console.error(e);
      setComics([]);
    }
  };

  useEffect(() => {
    fetchComics(KEYS.LIKES);
  }, []);

  const handleChooseFilter = async (key) => {
    setActiveFilter(key);
    await fetchComics(key);
  };

  return (
    <>
      <div className="hidden lg:block">
        <div className="gap-4 text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
          <div>
            <span className="bg-gray-900 text-white px-2 py-1 rounded">
              <FontAwesomeIcon icon="trophy" className="text-orange-400" /> Nổi
              bật
            </span>
          </div>
        </div>
        <div className="flex bg-black p-2 rounded mt-4 grid grid-cols-2 gap-4">
          {filters &&
            filters.map((_filter) => (
              <div
                key={_filter.key}
                className={classNames(
                  activeFilter === _filter.key && 'bg-gray-400',
                  'text-center bg-gray-800 hover:bg-gray-600 rounded p-1 font-bold text-white cursor-pointer',
                )}
                onClick={() => handleChooseFilter(_filter.key)}
              >
                <span>{_filter.text}</span>
              </div>
            ))}
        </div>
        <div className="grid grid-rows-1 divide-y">
          {comics &&
            comics.map((_comic, _idx) => (
              <ComicTrending key={_comic.id} comic={_comic} idx={_idx} />
            ))}
        </div>
      </div>
    </>
  );
}

export default TrendingSection;
