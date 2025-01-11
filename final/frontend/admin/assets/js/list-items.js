const apiUrl = "http://localhost:8000/products"; // Base URL for API
const productGrid = document.getElementById("product-grid");
const loadingSpinner = document.getElementById("loading-spinner");

// Fetch and display products
async function fetchProducts() {
  loadingSpinner.style.display = "flex"; // Show loading spinner
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
    loadingSpinner.style.display = "none"; // Hide loading spinner
  }
}

// Display products in the grid
function displayProducts(products) {
  productGrid.innerHTML = ""; // Clear any existing content

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("col-md-4");

    productCard.innerHTML = `
      <div class="card">
        <img src="../../Backend${product.image}" class="card-img-top" alt="${product.title}" style="width: 100%; height: 200px; object-fit: cover;">
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
async function viewProductDetails(productId) {
  try {
    const response = await fetch(`${apiUrl}/${productId}`);
    const product = await response.json();

    const modalContent = document.getElementById("product-details-content");
    modalContent.innerHTML = `
      <p><strong>Title:</strong> ${product.title}</p>
      <p><strong>Description:</strong> ${product.description}</p>
      <p><strong>Price:</strong> $${product.price}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Rating:</strong> ${product.rating?.rate || "N/A"} stars (${product.rating?.count || 0} reviews)</p>
    `;
    new bootstrap.Modal(document.getElementById("productDetailsModal")).show();
  } catch (error) {
    console.error("Error fetching product details:", error);
    alert("Error fetching product details");
  }
}

// Edit product
async function editProduct(productId) {
  try {
    const response = await fetch(`${apiUrl}/${productId}`);
    const product = await response.json();

    document.getElementById("edit-title").value = product.title;
    document.getElementById("edit-description").value = product.description;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-category").value = product.category;

    const form = document.getElementById("edit-product-form");
    form.onsubmit = function (event) {
      event.preventDefault();
      updateProduct(productId);
    };

    new bootstrap.Modal(document.getElementById("editProductModal")).show();
  } catch (error) {
    console.error("Error fetching product for editing:", error);
    alert("Error fetching product for editing");
  }
}

// Update product
async function updateProduct(productId) {
  const updatedProduct = {
    title: document.getElementById("edit-title").value,
    description: document.getElementById("edit-description").value,
    price: parseFloat(document.getElementById("edit-price").value) || 0,
    category: document.getElementById("edit-category").value,
  };

  try {
    const response = await fetch(`${apiUrl}/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      alert("Product updated successfully");
      fetchProducts(); // Refresh product list
      bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();
    } else {
      alert("Failed to update product");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Error updating product");
  }
}

// Delete product
async function deleteProduct(productId) {
  const confirmed = confirm("Are you sure you want to delete this product?");
  if (confirmed) {
    try {
      const response = await fetch(`${apiUrl}/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully");
        fetchProducts(); // Refresh product list
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  }
}

// Initial fetch of products
fetchProducts();
