import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function DashboardComicsSearchbar() {
  return (
    <div className="flex flex-row">
      <input
        className="border border-neutral-400 solid 
        shadow-sm focus:shadow-md bg-neutral-200 w-full text-xl 
        px-4 py-2 rounded-md placeholder:text-neutral-400 
        text-neutral-700 transition-all ease-in-out outline-none
        border-r-0 rounded-r-none"
        name="comic-search"
        type="text"
        placeholder="Search for a comic"
      />
      <button
        className="bg-neutral-200 px-2 rounded-md 
          border solid border-neutral-400 hover:bg-neutral-300 border-l-0
          rounded-l-none shadow-sm focus:shadow-md"
      >
        <AiOutlineSearch />
      </button>
    </div>
  );
}
