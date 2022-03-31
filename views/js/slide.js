var tabButtons = document.querySelectorAll(
  ".tabContainer .buttonContainer button"
);
var tabPanels = document.querySelectorAll(".tabContainer  .tabPanel");

function showPanel(panelIndex, colorCode) {
  tabButtons.forEach(function (node) {
    node.style.backgroundColor = "";
    node.style.color = "";
  });
  tabButtons[panelIndex].style.backgroundColor = "#e7b744";
  tabButtons[panelIndex].style.color = "white";
  tabPanels.forEach(function (node) {
    node.style.display = "none";
  });
  tabPanels[panelIndex].style.display = "block";
  tabPanels[panelIndex].style.backgroundColor = "#d9d9d9";
}
showPanel(0, "#f44336");
