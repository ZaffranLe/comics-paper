import React, { useState } from "react";

export default function DashboardComicsItem() {
  const [didActiveEditMode, setActiveEditMode] = useState(false);

  return (
    <>
      <div
        className="bg-neutral-100 hover:bg-neutral-200 
    border solid border-neutral-300 
    px-2 py-3 rounded-md flex flex-row gap-4 items-center"
      >
        <img
          src="https://dummyimage.com/320x480/000/fff"
          alt=""
          className="w-1/12 rounded-md"
        />

        <div className="w-10/12">
          <h1 className="font-bold">Title name</h1>
          <span className="text-neutral-600 text-xs">Tags: </span>
        </div>

        <div className="w-1/12">
          <button onClick={() => setActiveEditMode((e) => !e)}>Edit</button>
        </div>
      </div>

      {didActiveEditMode && (
        <div
          className="bg-neutral-100 hover:bg-neutral-200 
    border solid border-neutral-300 
    px-2 py-3 rounded-md flex flex-row gap-4 items-center"
        >
          Edit mode
        </div>
      )}
    </>
  );
}
