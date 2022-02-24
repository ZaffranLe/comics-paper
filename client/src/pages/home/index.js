import React from "react";
import "./style.css";
import ComicSection from "./components/comic-section";
import NovelSection from "./components/novel-section";
import FeedSection from "./components/feed-section";

function Home() {
    return (
        <>
            <div>
                <div className="my-4">
                    <ComicSection />
                </div>
                <div className="my-4">
                    <NovelSection />
                </div>
                <div className="my-4">
                    <FeedSection />
                </div>
            </div>
        </>
    );
}

export default Home;
