const baseURL = "http://127.0.0.1:8000/products/";
let editId = null;

// Elements
const table = document.getElementById("product-table");
const msg = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");

// Fetch products
async function fetchProducts() {
  try {
    const res = await fetch(baseURL);
    const products = await res.json();
    displayProducts(products);
  } catch (err) {
    showMessage("Failed to fetch products", "error");
  }
}

// Display products in table
function displayProducts(products) {
  const search = document.getElementById("search").value.toLowerCase();
  table.innerHTML = "";
  products
    .filter(p => 
      String(p.id).includes(search) ||
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    )
    .forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.description}</td>
        <td>${p.price.toFixed(2)}</td>
        <td>${p.quantity}</td>
        <td>
          <button onclick="editProduct(${p.id})">Edit</button>
          <button onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      `;
      table.appendChild(tr);
    });
}

// Show message
function showMessage(text, type="success") {
  msg.textContent = text;
  msg.className = type;
  setTimeout(() => msg.textContent = "", 5000);
}

// Add or update product
submitBtn.onclick = async () => {
  const id = Number(document.getElementById("product-id").value);
  const name = document.getElementById("product-name").value;
  const desc = document.getElementById("product-desc").value;
  const price = Number(document.getElementById("product-price").value);
  const quantity = Number(document.getElementById("product-quantity").value);

  const payload = { id, name, description: desc, price, quantity };

  try {
    if(editId){
      await fetch(baseURL + editId, { method: "PUT", headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      showMessage("Product updated successfully");
      editId = null;
      submitBtn.textContent = "Add Product";
      cancelBtn.style.display = "none";
      formTitle.textContent = "Add Product";
    } else {
      await fetch(baseURL, { method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      showMessage("Product added successfully");
    }
    clearForm();
    fetchProducts();
  } catch(err){
    showMessage("Operation failed", "error");
  }
};

// Delete product
async function deleteProduct(id){
  if(!confirm("Delete this product?")) return;
  try {
    await fetch(baseURL + id, { method: "DELETE" });
    showMessage("Product deleted successfully");
    fetchProducts();
  } catch(err){
    showMessage("Delete failed", "error");
  }
}

// Edit product
async function editProduct(id){
  try {
    const res = await fetch(baseURL + id);
    const p = await res.json();
    document.getElementById("product-id").value = p.id;
    document.getElementById("product-name").value = p.name;
    document.getElementById("product-desc").value = p.description;
    document.getElementById("product-price").value = p.price;
    document.getElementById("product-quantity").value = p.quantity;
    editId = id;
    submitBtn.textContent = "Update Product";
    cancelBtn.style.display = "inline";
    formTitle.textContent = "Edit Product";
  } catch(err){
    showMessage("Failed to load product", "error");
  }
}

// Cancel edit
cancelBtn.onclick = () => {
  editId = null;
  clearForm();
  submitBtn.textContent = "Add Product";
  cancelBtn.style.display = "none";
  formTitle.textContent = "Add Product";
}

// Clear form
function clearForm(){
  document.getElementById("product-id").value = "";
  document.getElementById("product-name").value = "";
  document.getElementById("product-desc").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-quantity").value = "";
}

// Search input
document.getElementById("search").addEventListener("input", fetchProducts);

// Initial fetch
fetchProducts();
