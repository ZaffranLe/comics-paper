import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Modal } from '..';
import { classNames } from '../../utils/common';

function Confirm({ open, onClose, onConfirm, loading, content }) {
  return (
    <>
      <Modal dimmer open={open} onClose={onClose}>
        <div className="w-1/3 bg-white border rounded-xl p-4">
          <div className="text-xl font-bold">Xác nhận</div>
          <div className="mt-4 mb-4">{content}</div>
          <div className="text-right">
            <button
              onClick={onConfirm}
              className={classNames(
                !loading && 'hover:bg-indigo-400 hover:text-white',
                'ring-2 ring-indigo-400 text-indigo-400 font-semibold py-2 px-4 rounded-full mr-2',
              )}
              disabled={loading}
            >
              {loading ? (
                <FontAwesomeIcon icon="spinner" spin fixedWidth />
              ) : (
                'Xác nhận'
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

export default Confirm;
