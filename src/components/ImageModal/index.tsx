import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import styles from "./ImageModal.module.css";

export interface ImageModalProps {
  src?: string;
  imageUrl?: string;
  alt?: string;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const htmlElement =
  typeof document !== "undefined" ? document.documentElement : null;

export const ImageModal: React.FC<ImageModalProps> = ({
  src,
  imageUrl,
  alt = "Preview",
  className,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}) => {
  const imgSrc = src || imageUrl || "";
  const isControlled = controlledIsOpen !== undefined;

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isExpanded = isControlled ? controlledIsOpen : internalIsOpen;

  const [originRect, setOriginRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const thumbnailRef = useRef<HTMLImageElement | null>(null);

  const handleOpen = useCallback(() => {
    if (thumbnailRef.current) {
      const rect = thumbnailRef.current.getBoundingClientRect();
      setOriginRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setOriginRect(null);
    }
    setInternalIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);

    if (thumbnailRef.current) {
      const rect = thumbnailRef.current.getBoundingClientRect();
      setOriginRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }

    setTimeout(() => {
      setIsClosing(false);
      setIsAnimating(false);
      if (isControlled && controlledOnClose) {
        controlledOnClose();
      } else {
        setInternalIsOpen(false);
      }
      if (htmlElement) {
        htmlElement.style.overflow = "";
      }
    }, 280);
  }, [isControlled, controlledOnClose]);

  useEffect(() => {
    if (!isExpanded) return;

    if (htmlElement) {
      htmlElement.style.overflow = "hidden";
    }

    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      if (htmlElement) {
        htmlElement.style.overflow = "";
      }
    };
  }, [isExpanded, handleClose]);

  const getAnimStyle = (): React.CSSProperties => {
    if (isAnimating && !isClosing) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(1)",
        opacity: 1,
        maxHeight: "88vh",
        maxWidth: "90vw",
        borderRadius: "14px",
      };
    }

    if (originRect) {
      return {
        position: "fixed",
        top: `${originRect.top}px`,
        left: `${originRect.left}px`,
        width: `${originRect.width}px`,
        height: `${originRect.height}px`,
        transform: "none",
        borderRadius: "8px",
        opacity: 0.7,
      };
    }

    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) scale(0.85)",
      opacity: 0,
      borderRadius: "14px",
    };
  };

  return (
    <>
      {!isControlled && imgSrc && (
        <div
          className={`${styles.thumbnailWrapper} ${className || ""}`}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          title="Click to view image"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
        >
          <img
            ref={thumbnailRef}
            src={imgSrc}
            alt={alt}
            className={styles.thumbnailImg}
          />
        </div>
      )}

      {isExpanded &&
        imgSrc &&
        createPortal(
          <div
            className={`${styles.overlay} ${
              isAnimating && !isClosing ? styles.overlayActive : ""
            } ${isClosing ? styles.overlayClosing : ""}`}
            onClick={handleClose}
          >
            <div
              className={styles.actionBar}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleClose}
                aria-label="Close"
                title="Close (Esc)"
              >
                <FiX size={20} />
              </button>
            </div>

            <div
              className={`${styles.imageFrame} ${
                isAnimating && !isClosing ? styles.frameActive : ""
              } ${isClosing ? styles.frameClosing : ""}`}
              style={getAnimStyle()}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={imgSrc} alt={alt} className={styles.expandedImg} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ImageModal;
