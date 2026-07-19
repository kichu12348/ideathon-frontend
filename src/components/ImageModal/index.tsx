import { createPortal } from "react-dom";
import React from "react";
import styles from "./ImageModal.module.css";

export interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const htmlElement = document.documentElement;

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    htmlElement.style.overflow = "";
    onClose();
  };

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    htmlElement.style.overflow = "hidden"; // Prevent background scrolling

    window.addEventListener("keydown", handleEsc);

    const elem = document.getElementById("image-modal-overlay");
    const handleClickOutside = () => {
      handleClose();
    };

    elem?.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      elem?.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={handleClose}
      id="image-modal-overlay"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Preview"
          className={styles.modalImage}
          style={{ pointerEvents: "none" }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default ImageModal;
