import React from 'react';
import {
  chapterViewTypeOptions,
  chapterViewTypes,
} from '../../../../utils/constants';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UploadSingleImg from './upload-single-img';
import * as resourceApi from '../../../../utils/api/resources';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import * as comicApi from '../../../../utils/api/comics';

function UpdateChapter({
  setIsUpdatingChapter,
  chapterInfo,
  setChapterInfo,
  fetchChapters,
  updateComic,
}) {
  const handleCloseUpdateChapter = () => {
    setIsUpdatingChapter(false);
  };

  const handleChangeViewType = (selectedOption) => {
    setChapterInfo({
      ...chapterInfo,
      viewTypeOption: selectedOption,
      viewType: selectedOption.value,
      blocks: [],
    });
  };

  const handleChangeChapterInfo = (name) => (e) => {
    setChapterInfo({ ...chapterInfo, [name]: e.target.value });
  };

  const handleChangeImages = async (e) => {
    try {
      if (e.target.files.length > 0) {
        const files = [...e.target.files];
        let currentIdx = 0;
        const promises = [];
        const AMOUNT_OF_IMG = 5;
        while (currentIdx < files.length) {
          promises.push(
            resourceApi.uploadImages(
              files.slice(currentIdx, currentIdx + AMOUNT_OF_IMG),
            ),
          );
          currentIdx += AMOUNT_OF_IMG;
        }
        const responses = await Promise.all(promises);
        let images = [];
        responses.forEach((_resp) => {
          images = images.concat(_resp.data);
        });
        images.sort((a, b) => {
          if (a.originalName > b.originalName) {
            return -1;
          }
          return 1;
        });
        setChapterInfo({
          ...chapterInfo,
          length: images.length + chapterInfo.length,
          blocks: [
            ...chapterInfo.blocks,
            ...images.map((_img, _idx) => ({
              id: uuidv4(),
              index: _idx + chapterInfo.length + 1,
              content: _img.fileName,
            })),
          ],
        });
      }
    } catch (e) {
      if (e.response?.data) {
        toast.error(
          e.response?.data?.error?.message ||
            'Upload ảnh thất bại, vui lòng thử lại sau.',
        );
      } else {
        console.error(e);
      }
    }
  };

  const handleChangeUploadedImg = async (block, e) => {
    try {
      if (e.target.files.length > 0) {
        const resp = await resourceApi.uploadImages(e.target.files);
        const imgInfo = resp.data[0];
        setChapterInfo({
          ...chapterInfo,
          blocks: [
            ...chapterInfo.blocks.filter((_block) => _block.id !== block.id),
            {
              ...block,
              content: imgInfo.fileName,
            },
          ],
        });
      }
    } catch (e) {
      if (e.response.data) {
        toast.error(
          e.response?.data?.error?.message ||
            'Upload ảnh thất bại, vui lòng thử lại sau.',
        );
      }
    }
  };

  const handleSortBlocks = () => {
    const sortedBlocks = chapterInfo.blocks.sort((a, b) => a.index - b.index);
    setChapterInfo({
      ...chapterInfo,
      blocks: sortedBlocks,
    });
  };

  const handleSave = async () => {
    try {
      if (chapterInfo.id) {
        await comicApi.updateComicChapter(updateComic.id, chapterInfo);
      } else {
        await comicApi.createComicChapter(updateComic.id, chapterInfo);
      }
    } catch (e) {
      if (e.response.data) {
        toast.error(
          e.response?.data?.error?.message ||
            'Cập nhật chương thất bại, vui lòng thử lại sau.',
        );
      }
    }
    await fetchChapters();
    setIsUpdatingChapter(false);
  };

  const handleAddBlock = () => {
    setChapterInfo({
      ...chapterInfo,
      blocks: [
        ...chapterInfo.blocks,
        {
          id: uuidv4(),
          index: chapterInfo.length + 1,
          content: '',
        },
      ],
    });
  };

  const handleUpdateBlockContent = (id, value) => {
    setChapterInfo({
      ...chapterInfo,
      blocks: [
        ...chapterInfo.blocks.map((_block) => {
          if (_block.id === id) {
            return {
              ..._block,
              content: value,
            };
          }
          return _block;
        }),
      ],
    });
  };

  const handleRemoveBlock = (id) => {
    setChapterInfo({
      ...chapterInfo,
      blocks: [...chapterInfo.blocks.filter((_block) => _block.id !== id)],
    });
  };
  return (
    <>
      <div className="text-2xl font-semibold">Cập nhật chương truyện</div>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-2">
          <div>
            <label>Tên chương</label>
          </div>
          <input
            className="input w-full"
            value={chapterInfo.name}
            onChange={handleChangeChapterInfo('name')}
          />
        </div>
        <div>
          <div>
            <label>Số chương</label>
          </div>
          <input
            className="input w-full"
            value={chapterInfo.chapterNumber}
            onChange={handleChangeChapterInfo('chapterNumber')}
          />
        </div>
        <div className="col-span-2">
          <div>
            <label>Cách xem</label>
          </div>
          <Select
            className="w-full"
            value={chapterInfo.viewTypeOption}
            options={chapterViewTypeOptions}
            onChange={handleChangeViewType}
          />
        </div>
      </div>
      <button
        onClick={handleSortBlocks}
        className="hover:bg-gray-400 hover:text-white border-2 border-gray-400 text-gray-400 font-semibold py-2 px-4 rounded-full my-2"
      >
        Sắp xếp
      </button>
      {chapterInfo.viewType === chapterViewTypes.IMAGE.TEXT && (
        <>
          <div className="grid grid-cols-6 gap-8 max-h-80 overflow-auto p-2">
            {chapterInfo.blocks.map((_block) => (
              <UploadSingleImg
                block={_block}
                handleChangeImage={handleChangeUploadedImg}
                key={_block.id}
              />
            ))}
            <div>
              <label
                htmlFor="chapter-images-upload"
                className={
                  'h-40 border-green-700 border rounded-lg flex items-center cursor-pointer select-none'
                }
              >
                <div className="text-center w-full text-green-700">
                  <FontAwesomeIcon icon="plus" />
                  <div>Ảnh</div>
                </div>
              </label>
              <input
                id="chapter-images-upload"
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleChangeImages}
              />
            </div>
          </div>
        </>
      )}
      {chapterInfo.viewType === chapterViewTypes.TEXT.TEXT && (
        <>
          <button
            onClick={handleAddBlock}
            className="hover:underline font-semibold py-2 px-4"
          >
            Thêm block
          </button>
          <div className="max-h-80 overflow-auto p-2">
            {chapterInfo.blocks.map((_block) => (
              <div className="flex my-4" key={_block.id}>
                <textarea
                  className="input w-full"
                  value={_block.content}
                  onChange={(e) =>
                    handleUpdateBlockContent(_block.id, e.target.value)
                  }
                />
                <button
                  onClick={() => handleRemoveBlock(_block.id)}
                  className="hover:underline font-semibold py-2 px-4 text-red-500"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <button
        onClick={handleCloseUpdateChapter}
        className="hover:bg-gray-400 hover:text-white float-right border-2 border-gray-400 text-gray-400 font-semibold py-2 px-4 rounded-full mr-2 mt-4"
      >
        Quay lại
      </button>
      <button
        onClick={handleSave}
        className="hover:bg-indigo-400 hover:text-white float-right border-2 border-indigo-400 text-indigo-400 font-semibold py-2 px-4 rounded-full mr-2 mt-4"
      >
        Xác nhận
      </button>
    </>
  );
}

export default UpdateChapter;
