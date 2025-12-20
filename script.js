const apiUrl = "http://localhost:8081/api/items"; 
let chart; // for Chart.js instance

// ✅ Show success or error message
function showMessage(type, text) {
  const message = document.getElementById("message");
  message.textContent = text;
  message.className = `message ${type}`;
  message.style.display = "block";
  setTimeout(() => {
    message.style.display = "none";
  }, 3000);
}

// ✅ Load all items into the table and dashboard
function loadItems() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(items => {
      const tableBody = document.getElementById("itemTableBody");
      tableBody.innerHTML = "";

      let totalQuantity = 0;
      let totalPrice = 0;

      items.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price;

        const row = `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
              <button onclick="editItem(${item.id}, '${item.name}', ${item.quantity}, ${item.price})">Edit</button>
              <button onclick="deleteItem(${item.id})">Delete</button>
            </td>
          </tr>`;
        tableBody.innerHTML += row;
      });

      // ✅ Dashboard summary
      document.getElementById("totalItems").textContent = items.length;
      document.getElementById("totalQuantity").textContent = totalQuantity;
      document.getElementById("avgPrice").textContent = items.length
        ? (totalPrice / items.length).toFixed(2)
        : 0;

      // ✅ Chart update
      updateChart(items);
    })
    .catch(() => showMessage("error", "Failed to load items. Check backend!"));
}

// ✅ Add or update item
document.getElementById("itemForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("itemId").value;
  const name = document.getElementById("name").value.trim();
  const quantity = Number(document.getElementById("quantity").value);
  const price = Number(document.getElementById("price").value);

  if (!name || quantity <= 0 || price <= 0) {
    showMessage("error", "Please enter valid item details!");
    return;
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${apiUrl}/${id}` : apiUrl;

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity, price })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      loadItems();
      document.getElementById("itemForm").reset();
      document.getElementById("itemId").value = "";
      showMessage("success", id ? "Item updated successfully!" : "Item added successfully!");
    })
    .catch(() => showMessage("error", "Failed to save item!"));
});

// ✅ Edit item (prefills the form)
function editItem(id, name, quantity, price) {
  document.getElementById("itemId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("quantity").value = quantity;
  document.getElementById("price").value = price;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ✅ Delete item
function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error();
      loadItems();
      showMessage("success", "Item deleted successfully!");
    })
    .catch(() => showMessage("error", "Failed to delete item!"));
}

// ✅ Chart.js - create or update chart
function updateChart(items) {
  const ctx = document.getElementById("itemChart").getContext("2d");
  const labels = items.map(i => i.name);
  const quantities = items.map(i => i.quantity);
  const prices = items.map(i => i.price);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Quantity",
          data: quantities,
          backgroundColor: "rgba(33, 150, 243, 0.6)"
        },
        {
          label: "Price (₹)",
          data: prices,
          backgroundColor: "rgba(76, 175, 80, 0.6)"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ✅ Load items on page load
window.onload = loadItems;
