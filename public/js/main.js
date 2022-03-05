let artFileInput = document.getElementById("artFile");
let imageSection = document.getElementById("imageSection");

imageSection.style.display = "none";

artFileInput.onchange = () => {
  let artFileInputImage = document.getElementById("artFileImage");

  const [file] = artFileInput.files;
  if (file) {
    artFileInputImage.src = URL.createObjectURL(file);
    imageSection.style.display = "block";
  }
};
