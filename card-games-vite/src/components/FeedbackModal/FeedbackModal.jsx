import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useState } from "react";

function FeedbackModal({
  isOpen,
  onCloseModal,
  isLoading,
  handleFeedbackSubmit,
  serverError,
}) {
  const {
    values = { email: "", feedbackType: "", description: "" },
    handleChange,
    errors,
    isValid,
    resetForm,
  } = useFormWithValidation({ email: "", feedbackType: "", description: "" });

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
        handleFeedbackSubmit(values, resetForm);
      }}
    >
      <fieldset className="modal__fieldset_radio" required={true}>
        <legend className="modal__legend">* Select the feedback type:</legend>

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
        <span className="modal__error">{errors.email}</span>
      </label>
      {feedbackRequestType === "bug" ? (
        <label className="modal__label">
          * Please add a description of the bug.
          <span className="modal__error">{errors.feedbackRequestType}</span>
        </label>
      ) : (
        ""
      )}
      {feedbackRequestType === "recommendation" ? (
        <label className="modal__label">
          * Thank you for your recommendation! If possible, I'll try to
          incorporate it when I have time
          <span className="modal__error">{errors.feedbackRequestType}</span>
        </label>
      ) : (
        ""
      )}
      {feedbackRequestType !== "" ? (
        <label className="modal__label">
          <textarea
            rows={5}
            onChange={handleChange}
            type="text"
            name="description"
            minLength={10}
            value={values.description || ""}
            className="modal__input"
            required={true}
          />
          <span className="modal__error">{errors.description}</span>
        </label>
      ) : (
        ""
      )}
    </ModalWithForm>
  );
}

export default FeedbackModal;
