import React from 'react';
import { ComicThumbnail } from '../../../components';
import * as comicApi from '../../../utils/api/comics';
import { CATEGORIES } from '../../../utils/constants';

function NovelSection() {
  const [comics, setComics] = React.useState([]);

  const fetchNovels = async () => {
    try {
      const resp = await comicApi.getAllComic({
        category: CATEGORIES.NOVEL,
        limit: 12,
        offset: 0,
        orderBy: 'updatedAt',
        orderType: 'DESC',
      });
      setComics(resp.data);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchNovels();
  }, []);

  return (
    <>
      <div>
        <div>
          <div className="flex gap-4 text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
            <div>
              <span className="bg-gray-900 text-white px-2 py-1 rounded">
                Novel
              </span>
            </div>
            <div>
              <span className="underline">Mới nhất</span>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {comics.map((_comic) => (
            <ComicThumbnail
              key={_comic.id}
              comic={_comic}
              url={`/comics/${_comic.slug}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default NovelSection;
