import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./SolitairePopup.css";

function SolitairePopup({ onCloseModal, isOpen }) {
  return (
    <div className={`modal modal__solitaire ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__container modal__solitaire-container">
        <h2 className="modal__title">Congratulations!</h2>
        <button
          onClick={onCloseModal}
          type="button"
          className="modal__close-button"
        />
        <div className="modal__solitaire-buttons">
          <button className="modal__solitaire-btn modal__solitaire-cancel-btn">
            Complete Manually
          </button>
          <button className="modal__solitaire-btn modal__solitaire-complete-btn">
            Auto Complete
          </button>
        </div>
      </div>
    </div>
  );
}

export default SolitairePopup;
