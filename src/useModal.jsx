import { useCallback, MouseEvent } from "react";
import usePortal from "react-cool-portal";

// Customize your hook based on react-cool-portal
const useModal = (options = {}) => {
  const { Portal, hide, ...rest } = usePortal({
    ...options,
    defaultShow: false,
    internalShowHide: false,
  });

  const handleClickBackdrop = useCallback(
    (e) => {
      const { id } = e;
      if (id === "modal") hide();
    },
    [hide]
  );

  const Modal = useCallback(
    ({ children, isShow }) => (
      <Portal>
        <div
          id="modal"
          className={`modal${isShow ? " modal-open" : ""}`}
          onClick={handleClickBackdrop}
          tabIndex={-1}
        >
          {children}
        </div>
      </Portal>
    ),
    [handleClickBackdrop]
  );

  return { Modal, hide, ...rest };
};

export default useModal;
