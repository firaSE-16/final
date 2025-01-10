const apiUrl = "http://localhost:8000/products"; // Base URL for API
const productGrid = document.getElementById("product-grid");
const loadingSpinner = document.getElementById("loading-spinner");

// Fetch and display products
async function fetchProducts() {
  loadingSpinner.style.display = "flex";
  try {
    const response = await fetch(apiUrl);
    const products = await response.json();

    if (response.ok) {
      displayProducts(products);
    } else {
      alert("Failed to load products");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Error fetching products");
  } finally {
    loadingSpinner.style.display = "none";
  }
}

// Display products in the grid
function displayProducts(products) {
  productGrid.innerHTML = ''; // Clear any existing content

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("col-md-4");

    productCard.innerHTML = `
      <div class="card">
        <img src="../../../../Backend${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text">Price: $${product.price}</p>
          <button class="btn btn-info" onclick="viewProductDetails('${product._id}')">View</button>
          <button class="btn btn-warning" onclick="editProduct('${product._id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
        </div>
      </div>
    `;

    productGrid.appendChild(productCard);
  });
}

// View product details
function viewProductDetails(productId) {
  fetch(`${apiUrl}/${productId}`)
    .then(response => response.json())
    .then(product => {
      const modalContent = document.getElementById("product-details-content");
      modalContent.innerHTML = `
        <p><strong>Title:</strong> ${product.title}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Rating:</strong> ${product.rating.rate} stars (${product.rating.count} reviews)</p>
      `;
      new bootstrap.Modal(document.getElementById("productDetailsModal")).show();
    })
    .catch(error => {
      console.error("Error fetching product details:", error);
      alert("Error fetching product details");
    });
}

// Edit product
function editProduct(productId) {
  // Open the modal with pre-filled data (similar to the view function)
  fetch(`${apiUrl}/${productId}`)
    .then(response => response.json())
    .then(product => {
      document.getElementById("edit-title").value = product.title;
      document.getElementById("edit-description").value = product.description;
      document.getElementById("edit-price").value = product.price;
      document.getElementById("edit-image").value = product.image;
      document.getElementById("edit-category").value = product.category;
      const form = document.getElementById("edit-product-form");
      form.onsubmit = function(event) {
        event.preventDefault();
        updateProduct(productId);
      };

      new bootstrap.Modal(document.getElementById("editProductModal")).show();
    })
    .catch(error => {
      console.error("Error fetching product for editing:", error);
      alert("Error fetching product for editing");
    });
}

// Update product
function updateProduct(productId) {
  const updatedProduct = {
    title: document.getElementById("edit-title").value,
    description: document.getElementById("edit-description").value,
    price: document.getElementById("edit-price").value,
    image: document.getElementById("edit-image").value,
    category: document.getElementById("edit-category").value,
  };

  fetch(`${apiUrl}/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then(response => response.json())
    .then(() => {
      alert("Product updated successfully");
      fetchProducts();  // Refresh product list
      document.getElementById("editProductModal").modal('hide');
    })
    .catch(error => {
      console.error("Error updating product:", error);
      alert("Error updating product");
    });
}

// Delete product
function deleteProduct(productId) {
  const confirmed = confirm("Are you sure you want to delete this product?");
  if (confirmed) {
    fetch(`${apiUrl}/${productId}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          alert("Product deleted successfully");
          fetchProducts();  // Refresh product list
        } else {
          alert("Failed to delete product");
        }
      })
      .catch(error => {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      });
}
}
// Initial fetch of products
fetchProducts()