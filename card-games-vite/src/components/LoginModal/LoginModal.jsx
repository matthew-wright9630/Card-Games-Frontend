import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";

function LoginModal({
  isOpen,
  onCloseModal,
  handleLogin,
  isLoading,
  handleRegistrationClick,
  serverError,
}) {
  const {
    values = { email: "", password: "" },
    handleChange,
    errors,
    isValid,
    resetForm,
  } = useFormWithValidation({ email: "", password: "" });

  return (
    <ModalWithForm
      title="Login"
      buttonTitle="Login"
      onClose={onCloseModal}
      isOpen={isOpen}
      buttonText={isLoading ? "Logging in..." : "Login"}
      isDisabled={!isValid}
      handleSubmit={(evt) => {
        evt.preventDefault();
        handleLogin(values, resetForm);
      }}
    >
      <label className="modal__label">
        Email *
        <input
          onChange={handleChange}
          type="email"
          className="modal__input"
          name="email"
          id="loginEmail"
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
          id="loginPassword"
          name="password"
          placeholder="password"
          value={values.password || ""}
          required={true}
          autoComplete="current-password"
          minLength={8}
        />
      </label>
      <span className="modal__error">{errors.password}</span>
      <button
        type="button"
        onClick={handleRegistrationClick}
        className="modal__login-btn"
      >
        or sign up
      </button>
      <span className="modal__error">{serverError.error}</span>
    </ModalWithForm>
  );
}

export default LoginModal;
