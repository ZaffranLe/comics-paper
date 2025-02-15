import React from 'react';
import { getImageUrl } from '../../../../utils/common';
function UploadSingleImg({ block, handleChangeImage }) {
  return (
    <>
      <div>
        <label
          htmlFor={block.id}
          className={
            'h-40 border-gray-700 border rounded-lg flex items-center cursor-pointer select-none overflow-hidden'
          }
        >
          <img
            src={getImageUrl(block.content)}
            className="w-full"
            alt="thumbnail"
          />
        </label>
        <input
          id={block.id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleChangeImage(block, e)}
        />
        <input className="input w-full" value={block.index} />
      </div>
    </>
  );
}

export default UploadSingleImg;
