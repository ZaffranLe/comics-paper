import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/common';

function ComicThumbnail({ comic, url, newTab = false }) {
  return (
    <>
      <Link to={url} target={newTab ? '_blank' : '_self'}>
        <div>
          <div
            style={{
              backgroundImage: `url(${getImageUrl(comic.thumbnailImg)})`,
              backgroundSize: 'cover',
              backgroundPositionX: 'center',
            }}
            className="peer rounded-xl h-60 cursor-pointer overflow-hidden ring-1 ring-gray-800"
          >
            <div className="h-full bg-gradient-to-t from-black via-transparent p-2">
              <div className="flex h-1/2 items-start justify-end">
                <span className="float-right bg-gray-800 text-white px-2 py-1 rounded">
                  {comic.category}
                </span>
              </div>
              {/* <div className="flex h-1/2 items-end">
                                <div className="flex grid grid-cols-3 items-center w-full">
                                    <div className="bg-gray-800 text-white px-2 py-1 rounded w-fit h-fit">
                                        CH.1
                                    </div>
                                    <div className="col-span-2 text-white text-right">
                                        1 tháng trước
                                    </div>
                                </div>
                            </div> */}
            </div>
          </div>
          <div className="text-center font-bold cursor-pointer hover:underline peer-hover:underline">
            {comic.name}
          </div>
        </div>
      </Link>
    </>
  );
}

export default ComicThumbnail;
