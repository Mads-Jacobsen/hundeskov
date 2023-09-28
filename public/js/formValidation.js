const fileInput = document.querySelector('#billede-uploader input[type=file]');
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('#billede-uploader .file-name');
    fileName.textContent = fileInput.files[0].name;
}
}