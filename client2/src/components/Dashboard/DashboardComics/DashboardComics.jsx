import React from "react";
import DashboardComicsSearchbar from "./components/DashboardComicsSearchbar";
import DashboardComicsItem from "./components/DashboardComicsItem";

export default function DashboardComics() {
  return (
    <div className="">
      <div className="font-bold text-4xl">Manage comics</div>

      {/* List of comics */}
      {/* TODO: fix width */}
      <div className="dashboard-comics-content-wrapper w-2/3">
        {/* Header  */}
        <div className="flex flex-row mt-4  gap-3">
          <button
            className="px-2 rounded-md bg-blue-800 
            text-blue-100 hover:bg-blue-900 border-blue-500 solid border
            shadow-none hover:shadow-sm focus:shadow-sm focus:border-blue-50 shadow-blue-200"
          >
            Add new comic
          </button>
          {/* Search bar */}
          <DashboardComicsSearchbar />
        </div>

        {/* Selected how many, something here? */}
        <div></div>

        {/* List goes here */}
        <div className="mt-4 flex flex-col gap-4">
          {new Array(10).fill(true).map((e) => {
            return <DashboardComicsItem />;
          })}
        </div>
      </div>
    </div>
  );
}
