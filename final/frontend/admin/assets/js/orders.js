const API_BASE_URL = "http://localhost:8000"; // Replace with your backend API base URL

function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "block";
}

function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}

/**
 * Fetch and display orders from the backend.
 */
async function fetchAndDisplayOrders() {
  const ordersContainer = document.getElementById("orders-container");
  if (!ordersContainer) {
    console.error("Orders container not found.");
    return;
  }

  showSpinner();
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const orders = await response.json();
    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="alert alert-info text-center">
          No orders found.
        </div>`;
      return;
    }

    ordersContainer.innerHTML = orders
      .map(
        (order) => `
        <div class="col-md-4">
          <div class="card">
            <div class="card-header bg-primary text-white">
              Order #${order._id}
            </div>
            <div class="card-body">
              <h5 class="card-title">Customer: ${order.customerName}</h5>
              <p class="card-text"><strong>Email:</strong> ${order.customerEmail}</p>
              <p class="card-text"><strong>Address:</strong> ${order.address}</p>
              <ul class="list-group mb-3">
                ${order.products
                  .map(
                    (product) => `
                  <li class="list-group-item">
                    ${product.title} (x${product.quantity}) - $${(
                      product.price * product.quantity
                    ).toFixed(2)}
                  </li>`
                  )
                  .join("")}
              </ul>
              <p class="card-text"><strong>Total:</strong> $${order.total.toFixed(
                2
              )}</p>
              <button class="btn btn-success btn-sm me-2" onclick="markOrderAsShipped(${order._id})">Mark as Shipped</button>
              <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order._id})">Delete</button>
            </div>
          </div>
        </div>`
      )
      .join("");
  } catch (error) {
    console.error("Error fetching orders:", error);
    ordersContainer.innerHTML = `
      <div class="alert alert-danger text-center">
        Failed to load orders. Please try again later.
      </div>`;
  } finally {
    hideSpinner();
  }
}

/**
 * Mark an order as shipped.
 */
async function markOrderAsShipped(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/ship`, {
      method: "PATCH",
    });

    if (response.ok) {
      alert(`Order #${orderId} marked as shipped.`);
      fetchAndDisplayOrders();
    } else {
      alert("Failed to mark the order as shipped.");
    }
  } catch (error) {
    console.error("Error marking order as shipped:", error);
  }
}

/**
 * Delete an order.
 */
async function deleteOrder(orderId) {
  if (!confirm(`Are you sure you want to delete order #${orderId}?`)) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert(`Order #${orderId} deleted successfully.`);
      fetchAndDisplayOrders();
    } else {
      alert("Failed to delete the order.");
    }
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}

// Initialize the orders page
document.addEventListener("DOMContentLoaded", fetchAndDisplayOrders);
