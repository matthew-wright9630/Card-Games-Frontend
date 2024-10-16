import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegistrationModal.css";
import { useForm } from "../../hooks/useForm";

function RegisterationModal({
  isOpen,
  onCloseModal,
  handleRegistration,
  isLoading,
  handleLoginClick,
}) {
  const { values, handleChange, setValues } = useForm({
    email: "",
    password: "",
    name: "",
    avatar: "",
  });

  const handleReset = () => {
    setValues({ email: "", password: "", name: "", avatar: "" });
  };

  return (
    <ModalWithForm
      title="Sign Up"
      buttonTitle="Sign Up"
      handleCloseModal={onCloseModal}
      isOpen={isOpen}
      buttonText={isLoading ? "Registering..." : "Sign Up"}
      handleSubmit={(evt) => {
        evt.preventDefault();
        handleRegistration(values, handleReset);
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
          value={values.email}
          required={true}
          autoComplete="username"
        />
      </label>
      <label className="modal__label">
        Password *
        <input
          onChange={handleChange}
          type="password"
          className="modal__input"
          id="password"
          name="password"
          placeholder="password"
          value={values.password}
          required={true}
          autoComplete="current-password"
        />
      </label>
      <label className="modal__label">
        Name *
        <input
          onChange={handleChange}
          type="text"
          className="modal__input"
          id="username"
          name="name"
          placeholder="username"
          value={values.name}
          required={true}
          autoComplete="username"
        />
      </label>
      <label className="modal__label">
        Avatar URL *
        <input
          onChange={handleChange}
          type="url"
          className="modal__input"
          id="avatar"
          name="avatar"
          placeholder="avatar"
          value={values.avatar}
          required={true}
        />
      </label>
      <button
        type="button"
        onClick={handleLoginClick}
        className="modal__login-btn"
      >
        or Login
      </button>
    </ModalWithForm>
  );
}

export default RegisterationModal;
