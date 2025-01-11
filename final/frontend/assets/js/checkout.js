import { fetchCartProducts } from "../fetch-api/api.js";
import { getCart } from "./updateCartBadge.js";

function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "flex";
}

function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}


async function loadComponent(url, placeholderId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${url}`);
    }
    const content = await response.text();
    document.getElementById(placeholderId).innerHTML = content;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");
  
  });
  
async function displayCheckoutSummary() {
  const cart = getCart();
  const summaryContainer = document.getElementById("checkout-summary");
  const form = document.getElementById("checkout-form");

  if (!summaryContainer) {
    console.error("Checkout summary container not found.");
    return;
  }

  if (cart.length === 0) {
    form.style.display = "none";
    summaryContainer.innerHTML = `
      <div class="text-center">
        <p>Your cart is empty. Go back to products and add some items.</p>
      </div>`;
    return;
  }

  form.style.display = "block";
  showSpinner();

  try {
    const products = await fetchCartProducts(cart);

    let total = 0;
    summaryContainer.innerHTML = `
      <h4>Order Summary</h4>
      <ul class="list-group mb-4">
        ${products
          .map((product, index) => {
            const item = cart[index];
            const subtotal = item.quantity * product.price;
            total += subtotal;

            return `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${product.title} (x${item.quantity})</span>
                <span>$${subtotal.toFixed(2)}</span>
              </li>`;
          })
          .join("")}
        <li class="list-group-item d-flex justify-content-between align-items-center fw-bold">
          <span>Total</span>
          <span>$${total.toFixed(2)}</span>
        </li>
      </ul>`;
  } catch (error) {
    console.error("Error fetching cart products:", error);
    summaryContainer.innerHTML = `
      <div class="alert alert-danger">
        Failed to load the order summary. Please try again later.
      </div>`;
  } finally {
    hideSpinner();
  }
}


function handleCheckoutFormSubmission() {
  const form = document.getElementById("checkout-form");

  if (!form) {
    console.error("Checkout form not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !email || !address) {
      alert("Please fill in all required fields.");
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to the cart.");
      return;
    }

    showSpinner();
    try {
      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          address,
          products: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Thank you for your order, ${name}! Your order has been placed.`);
        localStorage.removeItem("cart"); 
        window.location.href = "./orders.html"; 
      } else {
        const errorData = await response.json();
        console.error("Error placing order:", errorData);
        alert("Failed to place the order. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      hideSpinner();
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  displayCheckoutSummary();
  handleCheckoutFormSubmission();
});
