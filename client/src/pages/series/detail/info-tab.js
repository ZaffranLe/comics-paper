import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function InfoTab({ mangaInfo }) {
    const MAX_RATING = 5;
    const [ratingIcons, setRatingIcons] = React.useState([]);
    React.useEffect(() => {
        let _mangaRating = mangaInfo.rating;
        const _ratingIcons = [];
        while (_mangaRating >= 1) {
            _mangaRating -= 1;
            _ratingIcons.push("fa-star");
        }
        while (_mangaRating >= 0.5) {
            _mangaRating -= 0.5;
            _ratingIcons.push("fa-star-half-alt");
        }
        for (let i = 0; i < MAX_RATING - Math.round(mangaInfo.rating); i++) {
            _ratingIcons.push("far fa-star");
        }
        setRatingIcons(_ratingIcons);
    }, [mangaInfo]);

    return (
        <>
            <div className="text-2xl">
                {ratingIcons.map((_icon, _idx) => (
                    <FontAwesomeIcon className="text-yellow-400" icon={_icon} key={_idx} />
                ))}{" "}
                {mangaInfo.rating}
            </div>
            <div>
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="font-bold">Đánh giá</td>
                            <td>
                                Trung bình {mangaInfo.rating}/5 trên tổng số {mangaInfo.reviews}{" "}
                                đánh giá
                            </td>
                        </tr>
                        <tr>
                            <td className="font-bold">Tác giả</td>
                            <td>{mangaInfo.postedBy}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Danh mục</td>
                            <td>{mangaInfo.category}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Thể loại</td>
                            <td>
                                {mangaInfo.tags.map((_tag, _idx) => (
                                    <span key={_idx} className="mx-2 first:ml-0 last:mr-0">{_tag}</span>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="p-2 mr-2 ring-2 ring-gray-800 rounded-xl hover:bg-gray-800 hover:text-white font-semibold">
                    Chap đầu
                </button>
                <button className="p-2 ml-2 ring-2 ring-gray-800 rounded-xl hover:bg-gray-800 hover:text-white font-semibold">
                    Chap cuối
                </button>
            </div>
        </>
    );
}

export default InfoTab;
