import React from "react";
import * as comicApi from "../../../utils/api/comics";
import { BookThumbnail } from "../../../components";

function Series() {
    const [series, setSeries] = React.useState([]);

    const fetchSeries = async () => {
        try {
            const resp = await comicApi.getAllComic();
            setSeries(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchSeries();
    }, []);

    return (
        <>
            <div className="text-2xl font-bold">Danh sách truyện</div>
            <button className="bg-transparent hover:underline hover:text-indigo-500 font-semibold px-2 py-1 mt-4">
                Tạo mới
            </button>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {series.map((_serie) => (
                    <div key={_serie.id}>
                        <BookThumbnail info={_serie} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Series;
