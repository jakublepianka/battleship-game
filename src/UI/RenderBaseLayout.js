export const RenderBaseLayout = () => {
  const body = document.querySelector("body");
  const header = document.createElement("header");
  const content = document.createElement("div");

  const headerTextContainer = document.createElement("div");
  const headerText = document.createElement("h1");

  content.classList.add("content");
  headerTextContainer.classList.add("header-text-container");
  headerText.classList.add("header-text");

  headerText.textContent = "BATTLESHIP";

  body.appendChild(header);
  body.appendChild(content);
  header.appendChild(headerTextContainer);
  headerTextContainer.appendChild(headerText);
};
