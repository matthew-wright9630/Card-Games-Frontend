import ModalWithForm from "../ModalWithForm/ModalWithForm";
import Preloader from "../Preloader/Preloader";
import { useForm } from "../../hooks/useForm";

function EditModal({ isOpen, onCloseModal, handleEditProfile, isLoading }) {
  const { values, handleChange, setValues } = useForm({
    name: "",
    avatar: "",
  });

  const handleReset = () => {
    setValues({ email: "", password: "", name: "", avatar: "" });
  };
  return (
    <div>
      {isLoading ? <Preloader></Preloader> : ""}
      <ModalWithForm
        title="Edit Profile"
        buttonTitle="Save changes"
        onClose={onCloseModal}
        isOpen={isOpen}
        buttonText={isLoading ? "Saving..." : "Save changes"}
        handleSubmit={(evt) => {
          evt.preventDefault();
          handleEditProfile(values, handleReset);
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
            autoComplete="username"
            value={values.name}
            required={true}
          />
        </label>
        <label htmlFor="editProfileAvatar" className="modal__label">
          Avatar *
          <input
            onChange={handleChange}
            type="url"
            className="modal__input"
            id="editProfileAvatar"
            name="avatar"
            placeholder="avatar"
            value={values.avatar}
            required={true}
          />
        </label>
      </ModalWithForm>
    </div>
  );
}

export default EditModal;
