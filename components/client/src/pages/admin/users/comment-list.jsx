import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

function CommentList({ comments = [] }) {
  return (
    <>
      {comments.map((_comment) => {
        const toComicUrl = `/comics/${_comment.chapter.comic.slug}&${_comment.chapter.comic.id}`;
        return (
          <div key={_comment.id} className="p-4">
            <div>
              <Link to={toComicUrl} target="_blank">
                <span className="font-semibold">
                  {_comment.chapter.comic.name}
                </span>
              </Link>
              {" - "}
              <Link
                to={`${toComicUrl}/chapter/${_comment.chapter.name}&${_comment.chapter.id}`}
                target="_blank"
              >
                <span className="font-semibold">{_comment.chapter.name}</span>
              </Link>
              {" - "}
              <span>
                {moment(_comment.createdAt).format("HH:mm DD/MM/YYYY")}
              </span>
            </div>
            <div>
              <pre>{_comment.content}</pre>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default CommentList;
