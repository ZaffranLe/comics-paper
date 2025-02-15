import React from 'react';
import { useParams } from 'react-router-dom';
import * as comicApi from '../../../../utils/api/comics';
import Skeleton from 'react-loading-skeleton';
import { Loader } from '../../../../components';
import { getImageUrl } from '../../../../utils/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ComicDetail() {
  const { id: comicId } = useParams();

  const MAX_RATING = 5;
  const [comic, setComic] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [ratingIcons, setRatingIcons] = React.useState([]);

  React.useEffect(() => {
    fetchComic(comicId);
  }, [comicId]);

  const fetchComic = async (id) => {
    try {
      setIsLoading(true);
      const comicResp = await comicApi.getComicById(id);
      const comic = comicResp.data.comic;
      const apiList = [
        comicApi.getAllComicChapters(id),
        comicApi.getReviewsByComic(id),
      ];
      const resps = await Promise.all(apiList);
      comic.chapters = resps[0].data;
      comic.reviews = resps[1].data;
      setComic(comic);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const avgRating = React.useMemo(() => {
    let _avgRating = (
      comic?.reviews.reduce((rating, review) => (rating += review.rating), 0) /
        comic?.reviews.length || 0
    ).toFixed(2);
    let stars = _avgRating;
    const _ratingIcons = [];
    while (stars >= 1) {
      stars -= 1;
      _ratingIcons.push('fa-star');
    }
    while (stars >= 0.5) {
      stars -= 0.5;
      _ratingIcons.push('fa-star-half-alt');
    }
    for (let i = 0; i < MAX_RATING - Math.round(_avgRating); i++) {
      _ratingIcons.push('far fa-star');
    }
    setRatingIcons(_ratingIcons);
    return _avgRating;
  }, [comic]);

  if (isLoading) {
    return <Loader />;
  }

  if (!comic) {
    return <></>;
  }

  return (
    <>
      <div className="flex gap-x-8">
        <div>
          <img
            className="h-100 w-75"
            src={getImageUrl(comic.thumbnailImg)}
            alt={comic?.name}
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold">{comic.name}</h1>
          <div className="text-2xl">
            {ratingIcons.map((_icon, _idx) => (
              <FontAwesomeIcon
                className="text-yellow-400"
                icon={_icon}
                key={_idx}
              />
            ))}{' '}
            {avgRating} - {comic.views || 0}{' '}
            <FontAwesomeIcon className="text-blue-500" icon="eye" />
          </div>
          <div>
            <table className="w-full">
              <thead>
                <th className="w-30"></th>
                <th></th>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold">Đánh giá</td>
                  <td>
                    Trung bình {avgRating}/5 trên tổng số {comic.reviews.length}{' '}
                    đánh giá
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">Tác giả</td>
                  <td>{comic.author}</td>
                </tr>
                <tr>
                  <td className="font-bold">Danh mục</td>
                  <td>{comic.category}</td>
                </tr>
                <tr>
                  <td className="font-bold">Thể loại</td>
                  <td>
                    {comic.tags.map((_tag) => (
                      <span key={_tag.id} className="mx-2 first:ml-0 last:mr-0">
                        {_tag.keyword}
                      </span>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
            <h2 className="text-xl font-bold">Tóm tắt</h2>
            <p className="h-37.5 w-3/4 overflow-auto">{comic.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComicDetail;
