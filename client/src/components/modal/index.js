import React from 'react';
import { classNames } from '../../utils/common';
import ReactPortal from '../ReactPortal';

function Modal(props) {
  const { open, children, onClose, dimmer } = props;
  const clonedChildren = onClose
    ? React.cloneElement(children, {
        onClick: (e) => {
          if (children.props.onClick) {
            children.props.onClick();
          }
          e.stopPropagation();
        },
      })
    : children;
  return (
    <>
      <ReactPortal wrapperId='modal-wrapper'>
        <div
          className={classNames(
            open ? 'block' : 'hidden',
            dimmer && 'bg-black/50',
            'fixed w-full h-screen top-0 left-0 flex items-center justify-center'
          )}
          onClick={onClose}
        >
          {clonedChildren}
        </div>
      </ReactPortal>
    </>
  );
}

export default Modal;
