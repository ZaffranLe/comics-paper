import React from "react";
import "./style.css";
import ComicSection from "./components/comic-section";
import NovelSection from "./components/novel-section";
import FeedSection from "./components/feed-section";

function Home() {
    return (
        <>
            <div>
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
