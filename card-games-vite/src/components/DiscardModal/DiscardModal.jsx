import "./DiscardModal.css";

function DiscardModal({ isOpen, discardPile, onCloseModal }) {
  return (
    <div className={`modal modal__discard ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__container modal__discard-container">
        <h2 className="modal__title">Discard Pile</h2>
        <button
          onClick={onCloseModal}
          type="button"
          className="modal__close-button"
        />
        <div className="modal__discard-cards">
          {discardPile.map((card) => {
            return (
              <img
                key={card?.code}
                className="modal__discard__images"
                src={card?.image}
              ></img>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DiscardModal;
