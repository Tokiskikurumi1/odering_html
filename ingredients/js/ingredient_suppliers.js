// ===============================
// DATA
// ===============================

const suppliers = [
  {
    id: "SUP001",
    name: "Công ty Thực Phẩm An Phát",
    email: "anphat@gmail.com",
    phone: "0901234567",
    address: "Quận 1, TP.HCM",
  },
  {
    id: "SUP002",
    name: "HTX Rau Sạch Đà Lạt",
    email: "dalatfarm@gmail.com",
    phone: "0912345678",
    address: "Đà Lạt, Lâm Đồng",
  },
  {
    id: "SUP003",
    name: "Công ty Hải Sản Biển Đông",
    email: "biendong@gmail.com",
    phone: "0934567890",
    address: "Nha Trang, Khánh Hòa",
  },
];

const ingredients = [
  {
    id: 1,
    name: "Thịt bò Mỹ",
    price: 320000,
  },
  {
    id: 2,
    name: "Rau xà lách",
    price: 45000,
  },
  {
    id: 3,
    name: "Tôm sú",
    price: 280000,
  },
];

const importHistory = [
  {
    id: "PN001",
    supplierId: "SUP001",
    ingredientId: 1,
    quantity: 50,
    timestamp: "2026-06-01",
  },
  {
    id: "PN002",
    supplierId: "SUP001",
    ingredientId: 2,
    quantity: 30,
    timestamp: "2026-06-02",
  },
  {
    id: "PN003",
    supplierId: "SUP002",
    ingredientId: 2,
    quantity: 100,
    timestamp: "2026-06-03",
  },
  {
    id: "PN004",
    supplierId: "SUP003",
    ingredientId: 3,
    quantity: 20,
    timestamp: "2026-06-04",
  },
];

// ===============================
// ELEMENTS
// ===============================

const supplierGrid = document.getElementById("ingr-suppliers-grid-container");

const supplierModal = document.getElementById("ingr-supplier-crud-modal");

const supplierForm = document.getElementById("ingr-supplier-form-element");

const historyModal = document.getElementById("ingr-supplier-history-modal");

// ===============================
// RENDER SUPPLIERS
// ===============================

function renderSuppliers() {
  supplierGrid.innerHTML = "";

  suppliers.forEach((supplier) => {
    const card = document.createElement("div");

    card.className = "ingr-supplier-profile-card";

    card.innerHTML = `
      <div class="ingr-supplier-card-header">
          <div class="ingr-supplier-card-avatar">
              <i class="fa-solid fa-truck"></i>
          </div>

          <div class="ingr-supplier-card-title-box">
              <h4 class="ingr-supplier-card-name">
                  ${supplier.name}
              </h4>

              <span class="ingr-supplier-card-meta">
                  ID: ${supplier.id}
              </span>
          </div>
      </div>

      <div class="ingr-supplier-card-body">
          <div class="ingr-supplier-card-contact-row">
              <i class="fa-solid fa-envelope"></i>
              <span>${supplier.email}</span>
          </div>

          <div class="ingr-supplier-card-contact-row">
              <i class="fa-solid fa-phone"></i>
              <span>${supplier.phone}</span>
          </div>

          <div class="ingr-supplier-card-contact-row">
              <i class="fa-solid fa-location-dot"></i>
              <span>${supplier.address}</span>
          </div>
      </div>

      <div class="ingr-supplier-card-actions">

          <button
              class="ingr-outline-add-btn supplier-history-btn"
              style="padding:7px 12px;font-size:0.75rem;"
          >
              <i class="fa-solid fa-clock-rotate-left"></i>
              Lịch sử
          </button>

          <button
              class="ingr-ingredient-action-btn-circle supplier-edit-btn"
          >
              <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button
              class="ingr-ingredient-action-btn-circle delete supplier-delete-btn"
          >
              <i class="fa-solid fa-trash-can"></i>
          </button>

      </div>
    `;

    card
      .querySelector(".supplier-history-btn")
      .addEventListener("click", () => {
        viewSupplierHistory(supplier.id, supplier.name);
      });

    card.querySelector(".supplier-edit-btn").addEventListener("click", () => {
      editSupplier(supplier.id);
    });

    card.querySelector(".supplier-delete-btn").addEventListener("click", () => {
      deleteSupplier(supplier.id);
    });

    supplierGrid.appendChild(card);
  });
}

// ===============================
// OPEN ADD MODAL
// ===============================

function openAddSupplierModal() {
  supplierForm.reset();

  document.getElementById("ingr-form-supplier-id").value = "";

  document.getElementById("ingr-supplier-modal-title").textContent =
    "Thêm Nhà Cung Cấp Mới";

  supplierModal.classList.add("active");
}

// ===============================
// EDIT SUPPLIER
// ===============================

function editSupplier(id) {
  const supplier = suppliers.find((item) => item.id === id);

  if (!supplier) return;

  document.getElementById("ingr-form-supplier-id").value = supplier.id;

  document.getElementById("ingr-form-supplier-name").value = supplier.name;

  document.getElementById("ingr-form-supplier-email").value = supplier.email;

  document.getElementById("ingr-form-supplier-phone").value = supplier.phone;

  document.getElementById("ingr-form-supplier-address").value =
    supplier.address;

  document.getElementById("ingr-supplier-modal-title").textContent =
    "Cập Nhật Nhà Cung Cấp";

  supplierModal.classList.add("active");
}

// ===============================
// DELETE SUPPLIER
// ===============================

function deleteSupplier(id) {
  const index = suppliers.findIndex((item) => item.id === id);

  if (index === -1) return;

  const supplier = suppliers[index];

  const confirmDelete = confirm(`Bạn có chắc muốn xóa '${supplier.name}' ?`);

  if (!confirmDelete) return;

  suppliers.splice(index, 1);

  renderSuppliers();
}

// ===============================
// SAVE SUPPLIER
// ===============================

function saveSupplier(event) {
  event.preventDefault();

  const id = document.getElementById("ingr-form-supplier-id").value;

  const name = document.getElementById("ingr-form-supplier-name").value.trim();

  const email = document
    .getElementById("ingr-form-supplier-email")
    .value.trim();

  const phone = document
    .getElementById("ingr-form-supplier-phone")
    .value.trim();

  const address = document
    .getElementById("ingr-form-supplier-address")
    .value.trim();

  if (!name || !email || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  if (id) {
    const supplier = suppliers.find((item) => item.id === id);

    supplier.name = name;
    supplier.email = email;
    supplier.phone = phone;
    supplier.address = address;
  } else {
    const newId = "SUP" + String(suppliers.length + 1).padStart(3, "0");

    suppliers.push({
      id: newId,
      name,
      email,
      phone,
      address,
    });
  }

  closeSupplierModal();

  renderSuppliers();
}

// ===============================
// HISTORY
// ===============================

function viewSupplierHistory(supplierId, supplierName) {
  const tbody = document.getElementById("ingr-supplier-history-table-body");

  document.getElementById("ingr-supplier-history-title").textContent =
    `Lịch sử giao hàng: ${supplierName}`;

  const history = importHistory.filter(
    (item) => item.supplierId === supplierId,
  );

  tbody.innerHTML = "";

  history.forEach((item) => {
    const ingredient = ingredients.find((i) => i.id === item.ingredientId);

    const price = ingredient?.price || 0;

    const total = price * item.quantity;

    tbody.innerHTML += `
      <tr>
        <td>
          ${new Date(item.timestamp).toLocaleDateString("vi-VN")}
        </td>

        <td>${item.id}</td>

        <td>
          ${ingredient?.name || ""}
        </td>

        <td style="text-align:right">
          ${item.quantity}
        </td>

        <td style="text-align:right">
          ${price.toLocaleString("vi-VN")} đ
        </td>

        <td style="text-align:right">
          ${total.toLocaleString("vi-VN")} đ
        </td>
      </tr>
    `;
  });

  historyModal.classList.add("active");
}

// ===============================
// CLOSE MODALS
// ===============================

function closeSupplierModal() {
  supplierModal.classList.remove("active");
}

function closeHistoryModal() {
  historyModal.classList.remove("active");
}

// ===============================
// EVENTS
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  renderSuppliers();

  document
    .getElementById("ingr-btn-add-supplier")
    .addEventListener("click", openAddSupplierModal);

  document
    .getElementById("ingr-supplier-modal-close")
    .addEventListener("click", closeSupplierModal);

  document
    .getElementById("ingr-supplier-modal-cancel-btn")
    .addEventListener("click", closeSupplierModal);

  document
    .getElementById("ingr-supplier-history-close")
    .addEventListener("click", closeHistoryModal);

  supplierForm.addEventListener("submit", saveSupplier);
});
