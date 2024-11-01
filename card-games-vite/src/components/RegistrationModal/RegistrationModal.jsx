import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegistrationModal.css";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";

function RegisterationModal({
  isOpen,
  onCloseModal,
  handleRegistration,
  isLoading,
  handleLoginClick,
  serverError,
}) {
  const {
    values = { name: "", email: "", password: "" },
    handleChange,
    errors,
    isValid,
    resetForm,
  } = useFormWithValidation({ name: "", email: "", password: "" });

  return (
    <ModalWithForm
      title="Sign Up"
      buttonTitle="Sign Up"
      onClose={onCloseModal}
      isOpen={isOpen}
      buttonText={isLoading ? "Registering..." : "Sign Up"}
      isDisabled={!isValid}
      handleSubmit={(evt) => {
        evt.preventDefault();
        handleRegistration(values, resetForm);
      }}
    >
      <label className="modal__label">
        Email *
        <input
          onChange={handleChange}
          type="email"
          className="modal__input"
          name="email"
          id="email"
          placeholder="email"
          value={values.email || ""}
          required={true}
          autoComplete="username"
        />
      </label>
      <span className="modal__error">{errors.email}</span>
      <label className="modal__label">
        Password *
        <input
          onChange={handleChange}
          type="password"
          className="modal__input"
          id="password"
          name="password"
          placeholder="password"
          value={values.password || ""}
          required={true}
          minLength={8}
          autoComplete="current-password"
        />
      </label>
      <span className="modal__error">{errors.password}</span>
      <label className="modal__label">
        Name *
        <input
          onChange={handleChange}
          type="text"
          className="modal__input"
          id="username"
          name="name"
          placeholder="username"
          value={values.name || ""}
          required={true}
          autoComplete="username"
          minLength={2}
        />
      </label>
      <span className="modal__error">{errors.name}</span>
      <button
        type="button"
        onClick={handleLoginClick}
        className="modal__login-btn"
      >
        or Login
      </button>
      <span className="modal__error">{serverError.error}</span>
    </ModalWithForm>
  );
}

export default RegisterationModal;
