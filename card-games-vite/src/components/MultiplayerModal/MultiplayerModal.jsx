import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./MultiplayerModal.css";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";

function MultiplayerModal({
  isOpen,
  onCloseModal,
  handleLogin,
  isLoading,
  handleRegistrationClick,
  serverError,
}) {
  const {
    values = { room: "", password: "" },
    handleChange,
    errors,
    isValid,
    resetForm,
  } = useFormWithValidation({ room: "", password: "" });

  return (
    <ModalWithForm
      title="Multiplayer"
      onClose={onCloseModal}
      isOpen={isOpen}
      buttonText={isLoading ? "Searching..." : "Search"}
      isDisabled={!isValid}
      handleSubmit={(evt) => {
        evt.preventDefault();
        handleLogin(values, resetForm);
      }}
    >
      <label className="modal__label">
        Room
        <input
          onChange={handleChange}
          type="string"
          className="modal__input"
          name="room"
          id="roomNumber"
          placeholder=""
          value={values.room || ""}
          required={true}
        //   autoComplete="username"
        />
      </label>
      <span className="modal__error">{errors.room}</span>
      {/* <label className="modal__label">
        Password *
        <input
          onChange={handleChange}
          type="password"
          className="modal__input"
          id="loginPassword"
          name="password"
          placeholder="password"
          value={values.password || ""}
          required={true}
          autoComplete="current-password"
          minLength={8}
        />
      </label> */}
      {/* <span className="modal__error">{errors.password}</span> */}
      {/* <button
        type="button"
        onClick={handleRegistrationClick}
        className="modal__signup-btn modal__submit-button"
      >
        or sign up
      </button> */}
      <span className="modal__error">{serverError.error}</span>
    </ModalWithForm>
  );
}

export default MultiplayerModal;
