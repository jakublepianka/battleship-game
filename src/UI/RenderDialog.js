export const RenderDialog = (mediator) => {
  const body = document.querySelector("body");
  const dialog = document.createElement("dialog");
  const input = document.createElement("input");
  const submitBtn = document.createElement("button");

  input.type = "text";
  input.id = "player-name";
  submitBtn.id = "submit-name-button";
  submitBtn.textContent = "Confirm";

  submitBtn.addEventListener("click", () => {
    mediator.onNameChosen(input.value);
    dialog.close();
  });

  body.appendChild(dialog);
  dialog.appendChild(input);
  dialog.appendChild(submitBtn);
  dialog.showModal();
};
