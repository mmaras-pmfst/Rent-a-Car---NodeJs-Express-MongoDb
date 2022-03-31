window.onload = setup;

function setup() {
  document.getElementById("addAdmin").addEventListener("click", openForm);
  document.getElementById("close").addEventListener("click", closeForm);
  document.getElementById("addCar").addEventListener("click", openForm2);
  document.getElementById("close2").addEventListener("click", closeForm2);
}

function openForm() {
  document.getElementById("bg-modal").style.display = "flex";
}

function closeForm() {
  document.getElementById("bg-modal").style.display = "none";
}

function openForm2() {
  document.getElementById("bg-modal2").style.display = "flex";
}

function closeForm2() {
  document.getElementById("bg-modal2").style.display = "none";
}
