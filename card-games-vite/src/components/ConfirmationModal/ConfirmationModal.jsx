function ConfirmationModal({ isOpen, onCloseModal }) {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__container">
        <h2 className="modal__title">Thank you for reaching out!</h2>
        <p className="modal__paragraph">
          If you left your email, I will try to reach out within 7 days with an
          update.
        </p>
        <button
          onClick={onCloseModal}
          type="button"
          className="modal__close-button"
        />
      </div>
    </div>
  );
}

export default ConfirmationModal;
