import { loadComponent } from "../fetch-api/api.js";
import updateCartBadge from "./updateCartBadge.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");
  
  updateCartBadge();
});


const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you! Your message has been sent.");
    form.reset();
  });
}
