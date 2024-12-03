import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useState } from "react";

function FeedbackModal({
  isOpen,
  onCloseModal,
  handleLogin,
  isLoading,
  handleRegistrationClick,
  serverError,
}) {
  const {
    values = { email: "", feedbackType: "" },
    handleChange,
    errors,
    isValid,
    resetForm,
  } = useFormWithValidation({ email: "", feedbackType: "" });

  const handleFeedbackChange = (event) => {
    handleChange(event);
  };

  const [feedbackRequestType, setFeedbackRequestType] = useState("");

  return (
    <ModalWithForm
      title={"Provide Feedback"}
      onClose={onCloseModal}
      isOpen={isOpen}
      buttonText={isLoading ? "Submitting..." : "Submit"}
      isDisabled={!isValid}
      handleSubmit={(evt) => {
        evt.preventDefault();
        // handleLogin(values, resetForm);
      }}
    >
      <fieldset className="modal__fieldset_radio" required={true}>
        <legend className="modal__legend">Select the feedback type:</legend>
        <div>
          <input
            onChange={(event) => {
              handleFeedbackChange(event);
              setFeedbackRequestType("recommendation");
            }}
            type="radio"
            className="modal__input_radio"
            id="recommendation"
            name="feedbackType"
            value="recommendation"
            checked={values.feedbackType === "recommendation"}
          />
          <label htmlFor="recommendation" className="modal__label_radio">
            Recommendation
          </label>
        </div>
        <div>
          <input
            onChange={(event) => {
              handleFeedbackChange(event);
              setFeedbackRequestType("bug");
            }}
            type="radio"
            className="modal__input_radio"
            id="bug"
            name="feedbackType"
            value="bug"
            checked={values.feedbackType === "bug"}
          />
          <label htmlFor="bug" className="modal__label_radio">
            Report a bug
          </label>
        </div>
      </fieldset>
      <label className="modal__label">
        Email
        <p className="modal__help-text">
          If you would like a response, please provide an email
        </p>
        <input
          onChange={handleChange}
          type="email"
          className="modal__input"
          name="email"
          id="feedbackEmail"
          placeholder="email"
          value={values.email || ""}
          autoComplete="email"
        />
      </label>
        {feedbackRequestType === "bug"
          ? "Please add a description of the bug."
          : ""}
        {feedbackRequestType === "recommendation"
          ? "Here you can share your recommendation! If possible, I'll try to incorporate it when I have time"
          : ""}
      <label className="modal__label">
        <textarea
          rows={5}
          onChange={handleChange}
          type="text"
          className="modal__input"
          required={true}
        />
      </label>
      {feedbackRequestType === "bug" ? (
        <label className="modal__label">
          If able, please attach a screenshot of the bug
          <input type="file" className="modal__file" id="bugAttachment" />
        </label>
      ) : (
        ""
      )}
    </ModalWithForm>
  );
}

export default FeedbackModal;
