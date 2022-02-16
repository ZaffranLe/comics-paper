import React from "react";
import { classNames } from "../../utils/common";
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
            <div
                className={classNames(
                    open ? "block" : "hidden",
                    dimmer && "bg-black/50",
                    "fixed w-full h-screen top-0 left-0 flex items-center justify-center"
                )}
                onClick={onClose}
            >
                {clonedChildren}
            </div>
        </>
    );
}

export default Modal;
