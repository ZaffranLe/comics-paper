import React from "react";
import "./style.css";
import Banner from "../../assets/img/megumi-bg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mangaList } from "../../utils/mock-data";
import { MangaThumbnail } from "../../components";

function Home() {
    return (
        <>
            <div id="home-banner" className="w-full shadow">
                <img src={Banner} alt="megumi banner" className="mx-auto" />
            </div>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-2">
                        <div>
                            <div className="flex gap-4 text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
                                <div>
                                    <span className="bg-gray-900 text-white px-2 py-1 rounded">
                                        Chương
                                    </span>
                                </div>
                                <div>
                                    <span className="underline">Mới nhất</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {mangaList.map((_manga, _idx) => (
                                <MangaThumbnail key={_idx} manga={_manga} />
                            ))}
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="gap-4 text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
                            <div>
                                <span className="bg-gray-900 text-white px-2 py-1 rounded">
                                    <FontAwesomeIcon
                                        icon="trophy"
                                        className="text-orange-400"
                                    />{" "}
                                    Nổi bật
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
