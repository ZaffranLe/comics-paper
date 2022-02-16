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
            _ratingIcons.push("fas fa-star");
        }
        while (_mangaRating >= 0.5) {
            _mangaRating -= 0.5;
            _ratingIcons.push("fas fa-star-half-alt");
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
        </>
    );
}

export default InfoTab;
