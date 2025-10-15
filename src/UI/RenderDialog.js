export const RenderDialog = (mediator) => {
  const body = document.querySelector("body");
  const dialog = document.createElement("dialog");
  const dialogContent = document.createElement("div");
  const input = document.createElement("input");
  const submitBtn = document.createElement("button");

  dialogContent.classList.add("dialog-content");
  input.type = "text";
  input.id = "player-name";
  input.pattern = "^[A-Za-z]*";
  input.required = true;
  input.placeholder = "Your name";
  input.maxLength = "13";
  submitBtn.id = "submit-name-button";
  submitBtn.textContent = "Confirm";

  submitBtn.addEventListener("click", () => {
    if (!isValidName(input)) return;
    mediator.onNameChosen(input.value);
    dialog.close();
  });

  function isValidName(input) {
    let isValid = false;

    switch (true) {
      case input.validity.patternMismatch:
        input.setCustomValidity(`Please use letters and no spaces`);
        break;
      case input.validity.valueMissing:
        input.setCustomValidity("Can't be empty");
        break;
      case input.validity.tooLong:
        input.setCustomValidity(
          `The name is too long! Maximum allowed length is ${input.maxLength}. Current length is ${input.value.length}`,
        );
        break;
      default:
        input.setCustomValidity("");
        isValid = true;
        break;
    }

    input.reportValidity();
    return isValid;
  }
  
  body.appendChild(dialog);
  dialog.appendChild(dialogContent);
  dialogContent.appendChild(input);
  dialogContent.appendChild(submitBtn);
  dialog.showModal();
};
