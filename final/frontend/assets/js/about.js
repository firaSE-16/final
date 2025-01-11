import { loadComponent } from "../fetch-api/api.js";
import updateCartBadge from "./updateCartBadge.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");
  
  updateCartBadge();
});
