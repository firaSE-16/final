// login.js
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
  
    initLoginForm();
  });
  

  async function handleLogin(event) {
    event.preventDefault();
  
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
  
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }
  
    try {
      document.body.style.cursor = "wait";
  
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Login failed.");
      }
  
      const { token } = await response.json();
      localStorage.setItem("authToken", token);
  
      alert("Login successful!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Invalid email or password. Please try again.");
    } finally {
      document.body.style.cursor = "default";
    }
  }
  



  function initLoginForm() {
    const loginForm = document.querySelector("form");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }
  }
  