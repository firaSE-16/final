const apiUrl = "http://localhost:8000/products"; // Base URL for API

// Handle the Add Product Form submission
document.getElementById("add-item-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  // Prepare form data
  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("price", parseFloat(document.getElementById("price").value));
  formData.append("category", document.getElementById("category").value);
  formData.append("image", document.getElementById("image").files[0]);
  formData.append("rating.rate", parseFloat(document.getElementById("ratingRate").value));
  formData.append("rating.count", parseInt(document.getElementById("ratingCount").value));

  // Send data to the backend to add the new product
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      alert("Product added successfully!");
      window.location.href = "list-items.html"; // Redirect to the list page
    } else {
      alert("Failed to add product.");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    alert("An error occurred while adding the product.");
  }
});
