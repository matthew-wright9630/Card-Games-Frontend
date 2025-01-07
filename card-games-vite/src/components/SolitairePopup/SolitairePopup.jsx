import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./SolitairePopup.css";

function SolitairePopup({ onCloseModal, isOpen, handleSolitaireSubmit }) {
  return (
    <div className={`modal modal__solitaire ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__container modal__solitaire-container">
        <h2 className="modal__title">Congratulations!</h2>
        <p>
          The game has now been completed. Do you want to continue with manually
          adding the cards, or complete the game now?
        </p>
        <button
          onClick={onCloseModal}
          type="button"
          className="modal__close-button"
        />
        <div className="modal__solitaire-buttons">
          <button
            onClick={onCloseModal}
            className="modal__solitaire-btn modal__solitaire-cancel-btn"
          >
            Complete Manually
          </button>
          <button
            onClick={() => {
              handleSolitaireSubmit();
              onCloseModal();
            }}
            className="modal__solitaire-btn modal__solitaire-complete-btn"
          >
            Auto Complete
          </button>
        </div>
      </div>
    </div>
  );
}

export default SolitairePopup;
