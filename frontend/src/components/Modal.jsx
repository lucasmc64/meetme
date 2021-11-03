import React, { useEffect } from "react";

import styles from "../styles/components/Modal.module.css";
import Button from "./Button";

const Modal = ({
  isOpened = false,
  setIsModalOpened = () => {},
  title = "",
  children = null,
  onModalClose = null,
  onConfirmClick = null,
  closeOnOverlayClick = false,
  showCancelButton = false,
  confirmButtonText = "Ok",
  confirmButtonClassName = "",
  headerClassName = "",
  className = "",
  ...props
}) => {
  function closeModal() {
    setIsModalOpened(false);
    onModalClose && onModalClose();
  }

  function handleConfirmButtonClick() {
    closeModal();
    onConfirmClick && onConfirmClick();
  }

  function handleOverlayClick({ target, currentTarget }) {
    if (closeOnOverlayClick && target === currentTarget) closeModal();
  }

  useEffect(() => {
    isOpened
      ? document.body.classList.add("block-scroll")
      : document.body.classList.remove("block-scroll");
  }, [isOpened]);

  return (
    <div
      className={`${styles.overlay} ${!isOpened ? styles.hide : ""}`}
      onClick={handleOverlayClick}
    >
      <div {...props} className={`${styles.modal} ${className}`}>
        <div className={`${styles.header} ${headerClassName}`}>
          <h1 className={styles.title}>{title}</h1>
        </div>

        <div className={styles.scrollBox}>
          <div className={styles.content}>
            {children}

            <div className={styles.actions}>
              <Button
                onClick={handleConfirmButtonClick}
                className={confirmButtonClassName}
              >
                {confirmButtonText}
              </Button>
              {showCancelButton ? (
                <Button onClick={closeModal}>Cancelar</Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
