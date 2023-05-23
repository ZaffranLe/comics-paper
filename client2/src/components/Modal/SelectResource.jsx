import React from "react";
import ModalLayout from "./ModalLayout";

import { AiOutlineClose } from "react-icons/ai";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { Pagination } from "./../Pagination/Pagination";

export default function SelectResource({ visible, setVisible }) {
  return (
    <ModalLayout visible={visible} setVisible={setVisible}>
      {/* Wrapper by frame */}
      <div
        className="bg-neutral-50 w-4/5 mx-auto mt-2 px-6 py-4 rounded-md
        solid border border-neutral-500 flex flex-col gap-4"
      >
        {/* Header  */}
        <div className="flex flex-row">
          <div className="flex-1 text-2xl font-medium">Choose resource</div>
          <Button className={`px-1 py-1`}>
            <AiOutlineClose />
          </Button>
        </div>

        <hr />

        {/* Select resources */}
        <div className="flex flex-col">
          <Input className={`text-sm`} />

          {/* List */}
          <div className="overflow-y-scroll  mt-4">
            {[...Array(12)].fill(1).map((resource, index) => (
              <button className="inline-block w-1/6 rounded-md" key={index}>
                <img
                  className="px-2 rounded-md"
                  src="https://dummyimage.com/320x480/000/fff"
                />
              </button>
            ))}
          </div>

          <Pagination currentPage={0} maxPage={5} />
        </div>
      </div>
    </ModalLayout>
  );
}
