import React, { useState } from "react";
import Input from "../../../Input/Input";
import TextareaInput from "../../../Input/TextareaInput";
import Button from "../../../Button/Button";
import SelectResource from "../../../Modal/SelectResource";

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
          <button onClick={() => setActiveEditMode(true)}>Edit</button>
        </div>
      </div>

      {didActiveEditMode && <DashboardComicsEditModal />}
    </>
  );
}

function DashboardComicsEditModal() {
  return (
    <div className="border solid border-neutral-300 px-4 py-3 rounded-md flex flex-row gap-4">
      <div className="w-1/4">
        <button>
          <img
            src="https://dummyimage.com/320x480/000/fff"
            alt=""
            className="rounded-md"
          />
        </button>
      </div>

      <SelectResource
        visible={true}
        setVisible={() => {
          console.log(`close ${new Date()}`);
        }}
      />

      <div className="flex flex-col gap-4 w-3/4">
        {/* <h1>Edit mode</h1> */}
        <Input placeholder="Name of the comics" className={`text-sm`} />

        <TextareaInput placeholder="Comic lore" className={`text-sm`} />

        <div className="">
          <b>Chapters</b>

          <div className="flex flex-col gap-1 w-2/3">
            {[...new Array(10)].fill(1).map((_a, _index) => {
              return (
                <div className="bg-neutral-50 px-2 py-2 rounded-lg flex flex-row border border-neutral-100">
                  <span className="flex-1 text-xs">Chapter {_index}</span>
                  <div className="text-xs flex flex-row gap-2">
                    <Button text="Edit" />
                    <Button text="Delete" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="edit-footer flex flex-row-reverse gap-4">
          <Button text="Change" className={`px-2 py-2`} />
          <Button text="Cancel" className={` text-red-700`} />
        </div>
      </div>
    </div>
  );
}
