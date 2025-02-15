import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

function ReviewList({ reviews = [] }) {
  const ratingIcons = [0, 0, 0, 0, 0];
  return (
    <>
      {reviews.map((_review) => (
        <div key={_review.id} className="p-4">
          <div>
            <Link
              to={`/comics/${_review.comic.slug}&${_review.comic.id}`}
              target="_blank"
            >
              <span className="font-semibold">{_review.comic.name}</span>
            </Link>
            {' - '}
            <span>{moment(_review.createdAt).format('HH:mm DD/MM/YYYY')}</span>
          </div>
          <div>
            {ratingIcons.map((_icon, _idx) => (
              <FontAwesomeIcon
                key={_idx}
                className="text-yellow-400 cursor-pointer text-xl"
                icon={_idx < _review.rating ? 'fa-star' : 'far fa-star'}
              />
            ))}
          </div>
          <div>
            <pre>{_review.content}</pre>
          </div>
        </div>
      ))}
    </>
  );
}

export default ReviewList;
