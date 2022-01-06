import React from "react";
import "./style.css";
import Banner from "../../assets/img/megumi-bg.jpg";
import ComicSection from "./components/comic-section";
import NovelSection from "./components/novel-section";
import FeedSection from "./components/feed-section";

function Home() {
    return (
        <>
            <div id="home-banner" className="w-full shadow">
                <img src={Banner} alt="megumi banner" className="mx-auto" />
            </div>
            <div className="max-w-screen-xl grid grid-rows-1 gap-16 mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div>
                    <ComicSection />
                </div>
                <div>
                    <NovelSection />
                </div>
                <div>
                    <FeedSection />
                </div>
            </div>
        </>
    );
}

export default Home;
