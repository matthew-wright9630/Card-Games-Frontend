import ModalWithForm from "../ModalWithForm/ModalWithForm";
import Preloader from "../Preloader/Preloader";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";

function EditModal({
  isOpen,
  onCloseModal,
  handleEditProfile,
  isLoading,
  serverError,
}) {
  const user = useContext(CurrentUserContext);
  const {
    values = { name: user.name },
    handleChange,
    errors,
    isValid,
    resetForm,
  } = useFormWithValidation(user.name);

  return (
    <div>
      {isLoading ? <Preloader></Preloader> : ""}
      <ModalWithForm
        title="Edit Profile"
        buttonTitle="Save changes"
        onClose={onCloseModal}
        isOpen={isOpen}
        buttonText={isLoading ? "Saving..." : "Save changes"}
        isDisabled={!isValid}
        handleSubmit={(evt) => {
          evt.preventDefault();
          handleEditProfile(values, resetForm);
        }}
      >
        <label htmlFor="editProfileName" className="modal__label">
          Name *
          <input
            onChange={handleChange}
            type="name"
            className="modal__input"
            name="name"
            id="editProfileName"
            placeholder="Name"
            autoComplete="off"
            value={values.name || ""}
            required={true}
            minLength={2}
            maxLength={40}
          />
        </label>
        <span className="modal__error">{errors.name}</span>
        <span className="modal__error">{serverError.error}</span>
      </ModalWithForm>
    </div>
  );
}

export default EditModal;
