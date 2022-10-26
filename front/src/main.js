import upload, { abort } from "./js/upload";

const btn = document.querySelector("#btn");
const input = document.querySelector("#fileInput");
const btnAbort = document.querySelector("#btnAbort");
btn.addEventListener("click", () => {
  const file = input.files[0];
  console.log(file);
  upload(file);
});

btnAbort.addEventListener("click", () => {
  abort();
});
