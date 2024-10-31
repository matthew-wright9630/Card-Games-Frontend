import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({
  isOpen,
  handleCloseModal,
  handleDeleteGameInfo,
  handleDeleteUser,
  selectedItem,
  buttonText,
}) {
  const handleDeleteClick = () => {
    if (selectedItem.email !== undefined) {
      handleDeleteUser(selectedItem._id);
    } else if (selectedItem.description !== undefined) {
      handleDeleteGameInfo(selectedItem._id);
    }
  };

  return (
    <div className={`modal modal_delete ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__container">
        <button
          onClick={handleCloseModal}
          type="button"
          className="modal__close-button"
        />
        <div className="modal__delete-section">
          <div className="modal__delete-text">
            <p className="modal__delete-paragraph">
              Are you sure you want to delete this{" "}
              {selectedItem.email === undefined ? "game's history" : "user"}?
            </p>
            <p className="modal__delete-paragraph">
              This action is irreversible.
            </p>
          </div>
          <button
            onClick={handleDeleteClick}
            type="button"
            className="modal__delete-btn-confirm"
          >
            {buttonText}
          </button>
          <button
            onClick={handleCloseModal}
            type="button"
            className="modal__cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
