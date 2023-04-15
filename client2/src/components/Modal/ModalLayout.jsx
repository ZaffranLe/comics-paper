import { useRef } from "react";

export default function ModalLayout({ visible, setVisible, children }) {
  const ref = useRef(null);

  const handleOnClick = (e) => {
    if (!ref.current || ref.current.contains(e.target)) {
      return;
    }

    setVisible(false);
  };

  return (
    visible && (
      <div
        className="fixed top-0 left-0 bg-neutral-800 bg-opacity-40 w-full h-full z-50"
        onClick={handleOnClick}
      >
        {/* Frame */}
        <div ref={ref}>{children}</div>
      </div>
    )
  );
}
