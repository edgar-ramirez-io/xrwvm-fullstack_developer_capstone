import { useEffect, useRef } from "react";

const Modal = ({ open, children }) => {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return (
    <dialog ref={dialog} className="modal2">
      {open && children}
    </dialog>
  );
};

export default Modal;
