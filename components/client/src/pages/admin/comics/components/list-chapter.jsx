import React from 'react';
import moment from 'moment';
import * as comicApi from '../../../../utils/api/comics';
import {
  chapterViewTypeOptions,
  chapterViewTypes,
} from '../../../../utils/constants';

function ListChapter({
  fetchChapters,
  onDeleteChapter,
  setChapterInfo,
  setIsUpdatingChapter,
  chapters,
}) {
  const DEFAULT_CHAPTER_INFO = {
    id: null,
    name: '',
    viewType: chapterViewTypeOptions[0].value,
    viewTypeOption: chapterViewTypeOptions[0],
    comicId: '',
    length: 0,
    blocks: [],
    chapterNumber: '',
  };

  const handleDeleteChapter = async (id) => {
    onDeleteChapter(id);
    await fetchChapters();
  };

  const handleOpenUpdateChapter = async (_chapterInfo = null) => {
    if (_chapterInfo) {
      const resp = await comicApi.getComicChapter(
        _chapterInfo.comicId,
        _chapterInfo.id,
      );
      const viewTypeKey = Object.keys(chapterViewTypes).find(
        (_key) => chapterViewTypes[_key].VALUE === resp.data.viewType,
      );
      const viewTypeOption = chapterViewTypeOptions.find(
        (_option) => _option.value === chapterViewTypes[viewTypeKey].TEXT,
      );
      setChapterInfo({
        ...resp.data,
        viewTypeOption,
        viewType: viewTypeOption.value,
      });
    } else {
      setChapterInfo(DEFAULT_CHAPTER_INFO);
    }
    setIsUpdatingChapter(true);
  };

  return (
    <>
      <div className="text-2xl font-semibold">Danh sách chương</div>
      <button
        className="font-semibold hover:underline my-2"
        onClick={() => handleOpenUpdateChapter()}
      >
        Thêm chương mới
      </button>
      <table className="border-collapse table-auto w-full text-left">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th>#</th>
            <th>Chương</th>
            <th>Tên</th>
            <th>Ngày đăng</th>
            <th>Thời gian chỉnh sửa</th>
            <th>Phân loại</th>
            <th>Độ dài</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((_chapter, _idx) => {
            const viewTypeKey = Object.keys(chapterViewTypes).find(
              (_viewType) =>
                chapterViewTypes[_viewType].VALUE === _chapter.viewType,
            );
            const viewType =
              chapterViewTypes[viewTypeKey]?.LABEL || 'Không xác định';
            return (
              <tr
                key={_chapter.id}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                <td className="p-3">{_idx + 1}</td>
                <td className="p-3">{_chapter.chapterNumber}</td>
                <td className="p-3">{_chapter.name}</td>
                <td className="p-3">
                  {moment(_chapter.createdAt).format('HH:mm DD/MM/YYYY')}
                </td>
                <td className="p-3">
                  {moment(_chapter.updatedAt).format('HH:mm DD/MM/YYYY')}
                </td>
                <td className="p-3">{viewType}</td>
                <td className="p-3">{_chapter.length}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleOpenUpdateChapter(_chapter)}
                    className="hover:font-semibold hover:underline mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(_chapter.id)}
                    className="hover:font-semibold hover:underline ml-2"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default ListChapter;
