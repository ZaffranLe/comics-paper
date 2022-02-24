import React from "react";
import { classNames } from "../../../utils/common";
import InfoTab from "./info-tab";
import SummaryTab from "./summary-tab";

function InfoSection({ comic }) {
    const TABS = {
        INFO: "info",
        SUMMARY: "summary",
    };

    const [activeTab, setActiveTab] = React.useState(TABS.INFO);

    return (
        <>
            <div className="mt-2 mb-4 text-center">
                <button
                    className={classNames(
                        activeTab === TABS.INFO && "text-white bg-gray-800",
                        "ring-2 ring-gray-800 font-semibold py-2 px-4 rounded-full mr-2"
                    )}
                    onClick={() => setActiveTab(TABS.INFO)}
                >
                    Info
                </button>
                <button
                    className={classNames(
                        activeTab === TABS.SUMMARY && "text-white bg-gray-800",
                        "ring-2 ring-gray-800 font-semibold py-2 px-4 rounded-full mr-2"
                    )}
                    onClick={() => setActiveTab(TABS.SUMMARY)}
                >
                    Summary
                </button>
            </div>
            <div className="ring-2 ring-gray-800 p-4 my-4 rounded-xl">
                {activeTab === TABS.INFO && <InfoTab comic={comic} />}
                {activeTab === TABS.SUMMARY && <SummaryTab comic={comic} />}
            </div>
        </>
    );
}

export default InfoSection;
