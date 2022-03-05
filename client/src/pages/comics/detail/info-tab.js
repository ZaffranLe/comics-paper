import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

function InfoTab({ comic }) {
    const MAX_RATING = 5;
    const [ratingIcons, setRatingIcons] = React.useState([]);

    const navigate = useNavigate();

    React.useEffect(() => {
        let _mangaRating = comic.likes;
        const _ratingIcons = [];
        while (_mangaRating >= 1) {
            _mangaRating -= 1;
            _ratingIcons.push("fa-star");
        }
        while (_mangaRating >= 0.5) {
            _mangaRating -= 0.5;
            _ratingIcons.push("fa-star-half-alt");
        }
        for (let i = 0; i < MAX_RATING - Math.round(comic.likes); i++) {
            _ratingIcons.push("far fa-star");
        }
        setRatingIcons(_ratingIcons);
    }, [comic]);

    const handleViewChapter = (chapter) => {
        navigate(`../comics/${comic.slug}&${comic.id}/chapter/${chapter.name}&${chapter.id}`);
    };

    return (
        <>
            <div className="text-2xl">
                {ratingIcons.map((_icon, _idx) => (
                    <FontAwesomeIcon className="text-yellow-400" icon={_icon} key={_idx} />
                ))}{" "}
                {comic.likes}
            </div>
            <div>
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="font-bold">Đánh giá</td>
                            <td>
                                Trung bình {comic.likes}/5 trên tổng số {comic.likes} đánh giá
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
                {comic.chapters.length > 0 && (
                    <>
                        <button
                            onClick={() =>
                                handleViewChapter(comic.chapters[comic.chapters.length - 1])
                            }
                            className="p-2 mr-2 ring-2 ring-gray-800 rounded-xl hover:bg-gray-800 hover:text-white font-semibold"
                        >
                            Chap đầu
                        </button>
                        <button
                            onClick={() => handleViewChapter(comic.chapters[0])}
                            className="p-2 ml-2 ring-2 ring-gray-800 rounded-xl hover:bg-gray-800 hover:text-white font-semibold"
                        >
                            Chap cuối
                        </button>
                    </>
                )}
            </div>
        </>
    );
}

export default InfoTab;
