import React from "react";
import { mangaList } from "../../../utils/mock-data";
import { ComicThumbnail } from "../../../components";
import ComicTrendingSection from "./comic-trending-section";
import * as comicApi from "../../../utils/api/comics";

function ComicSection() {
    const [comics, setComics] = React.useState([]);

    const fetchComics = async () => {
        try {
            const resp = await comicApi.getAllComic();
            setComics(resp.data);
        } catch (e) {
            console.error(e);
        }
    }

    React.useEffect(() => {
        fetchComics();
    }, []);

    return (
        <>
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2">
                    <div>
                        <div className="flex gap-4 text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
                            <div>
                                <span className="bg-gray-900 text-white px-2 py-1 rounded">
                                    Comic
                                </span>
                            </div>
                            <div>
                                <span className="underline">Mới nhất</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                        {comics.map((_comic) => (
                            <ComicThumbnail key={_comic.id} comic={_comic} url={`/comics/${_comic.slug}&${_comic.id}`} />
                        ))}
                    </div>
                </div>
                <ComicTrendingSection comics={comics} />
            </div>
        </>
    );
}

export default ComicSection;
