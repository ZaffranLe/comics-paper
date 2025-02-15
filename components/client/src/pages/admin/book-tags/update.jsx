import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { toast } from 'react-toastify';
import { Modal } from '../../../components';
import { classNames } from '../../../utils/common';

function UpdateBookTag({ open, onClose, onSave, updateBookTag }) {
  const [keyword, setKeyword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (updateBookTag) {
      setKeyword(updateBookTag.keyword);
    }
  }, [updateBookTag]);

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(keyword);
      onClose();
    } catch (e) {
      toast.error(
        e.response?.data?.error?.message ||
          'Cập nhật thể loại truyện thất bại, vui lòng thử lại sau.',
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const disableSaveBtn =
    loading || (updateBookTag && keyword === updateBookTag.keyword);

  return (
    <>
      <Modal dimmer open={open} onClose={onClose}>
        <div className="w-1/3 bg-white border rounded-xl p-4">
          <div className="text-xl font-bold">
            {updateBookTag
              ? 'Cập nhật thể loại truyện'
              : 'Tạo thể loại truyện mới'}
          </div>
          <div className="mt-4 mb-4">
            <label>Từ khóa</label>
            <input
              className="input w-full"
              value={keyword}
              onChange={handleChangeKeyword}
            />
          </div>
          <div className="text-right">
            <button
              onClick={handleSave}
              className={classNames(
                !disableSaveBtn && 'hover:bg-indigo-400 hover:text-white',
                'ring-2 ring-indigo-400 text-indigo-400 font-semibold py-2 px-4 rounded-full mr-2',
              )}
              disabled={disableSaveBtn}
            >
              {loading ? (
                <FontAwesomeIcon icon="spinner" spin fixedWidth />
              ) : (
                'Lưu'
              )}
            </button>
            <button
              onClick={onClose}
              className="ring-2 ring-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white font-semibold py-2 px-4 rounded-full ml-2"
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UpdateBookTag;
