
 
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
  // Initialize the cart badge on page load
  });
  
  
// Fetch orders from the backend and display them
async function displayOrders() {
  try {
    const response = await axios.get('http://localhost:8000/orders');
    const orders = response.data.orders;
    const ordersContainer = document.getElementById('orders-container');

    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="text-center">
          <p>You have no orders. Add items to your cart and check them out!</p>
        </div>`;
      return;
    }

    ordersContainer.innerHTML = orders
      .map((order) => {
        const productList = order.products
          .map((product) => {
            // Access the productId object directly since it now contains details
            const productTitle = product.productId ? product.productId.title : 'Unknown Product';
            const productPrice = product.productId && product.productId.price ? product.productId.price.toFixed(2) : 'N/A';

            return `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${productTitle} (x${product.quantity || 1})</span>
                <span>$${productPrice}</span>
              </li>`;
          })
          .join("");

        return `
          <div class="card mb-4" data-order-id="${order._id}">
            <div class="card-body">
              <h5 class="card-title">Order #${order._id}</h5>
              <p><strong>Status:</strong> ${order.state}</p>
              <p><strong>Shipping to:</strong> ${order.address}</p>
              <h6>Products:</h6>
              <ul class="list-group mb-3">
                ${productList}
              </ul>
              <button class="btn btn-success mark-received-btn" data-order-id="${order._id}">
                Mark as Received
              </button>
            </div>
          </div>`;
      })
      .join("");

    // Add event listeners for "Mark as Received" buttons
    document.querySelectorAll('.mark-received-btn').forEach((button) => {
      button.addEventListener('click', (e) => {
        const orderId = e.target.getAttribute('data-order-id');
        markOrderAsReceived(orderId);
      });
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

// Mark an order as received, update the backend, and delete the order
async function markOrderAsReceived(orderId) {
  if (confirm("Are you sure you want to mark this order as received?")) {
    try {
      // Step 1: Update the order state to "Completed"
      const response = await axios.patch(`http://localhost:8000/orders/${orderId}`, {
        state: 'Completed',
      });

      if (response.status === 200) {
        alert("Thank you! Your order has been marked as received.");
        
        // Step 2: Delete the order after it has been completed
        await axios.delete(`http://localhost:8000/orders/${orderId}`);
        
        // Step 3: Remove the order from the DOM
        const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
        if (orderElement) {
          orderElement.remove();
        }

        // Optionally, refresh the list of orders (if you want to reload all orders from the server)
        // displayOrders(); 
      } else {
        alert("Failed to update the order status.");
      }
    } catch (error) {
      console.error("Error updating the order:", error);
      alert("An error occurred while updating the order.");
    }
  }
}

// Initialize the orders page
document.addEventListener('DOMContentLoaded', () => {
  displayOrders();
});
