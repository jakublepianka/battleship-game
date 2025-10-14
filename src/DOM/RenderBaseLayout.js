export const RenderBaseLayout = () => {
  const body = document.querySelector("body");
  const header = document.createElement("header");
  const content = document.createElement("div");

  const playerDataContainer = document.createElement("div");
  const headerTextContainer = document.createElement("div");
  const headerText = document.createElement("h1");

  content.classList.add("content");
  playerDataContainer.classList.add("player-data-container");
  headerTextContainer.classList.add("header-text-container");
  headerText.classList.add("header-text");

  body.appendChild(header);
  body.appendChild(content);
  header.appendChild(headerTextContainer);
  header.appendChild(playerDataContainer);
  headerTextContainer.appendChild(headerText);
};
