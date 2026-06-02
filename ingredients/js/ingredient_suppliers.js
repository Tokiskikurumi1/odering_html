// ===============================
// SUPPLIERS
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

document.addEventListener("DOMContentLoaded", () => {
  renderSuppliers();

  document
    .getElementById("ingr-supplier-history-close")
    ?.addEventListener("click", closeSupplierHistoryModal);

  document
    .getElementById("ingr-supplier-modal-close")
    ?.addEventListener("click", closeSupplierCrudModal);

  document
    .getElementById("ingr-supplier-modal-cancel-btn")
    ?.addEventListener("click", closeSupplierCrudModal);
});

function renderSuppliers() {
  const container = document.getElementById("ingr-suppliers-grid-container");

  if (!container) return;

  container.innerHTML = "";

  suppliers.forEach((supplier) => {
    const card = document.createElement("div");

    card.className = "ingr-supplier-profile-card";

    card.innerHTML = `
      <div class="ingr-supplier-card-header">
          <div class="ingr-supplier-card-avatar">
              <i class="fa-solid fa-truck"></i>
          </div>

          <div class="ingr-supplier-card-title-box">
              <h4 class="ingr-supplier-card-name">${supplier.name}</h4>
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
              style="padding: 7px 12px; font-size: 0.75rem;"
          >
              <i class="fa-solid fa-history"></i>
              Lịch sử
          </button>

          <button
              class="ingr-ingredient-action-btn-circle supplier-edit-btn"
              title="Sửa nhà cung cấp"
          >
              <i class="fa-solid fa-pen-to-square"></i>
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

    container.appendChild(card);
  });
}

function viewSupplierHistory(supplierId, supplierName) {
  const modal = document.getElementById("ingr-supplier-history-modal");

  const tbody = document.getElementById("ingr-supplier-history-table-body");

  document.getElementById("ingr-supplier-history-title").textContent =
    `Lịch sử giao hàng: ${supplierName}`;

  const history = importHistory.filter(
    (item) => item.supplierId === supplierId,
  );

  if (!history.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6"
            style="
              text-align:center;
              padding:30px;
              color:var(--ingr-text-disabled);
            ">
          Chưa phát sinh phiếu nhập hàng.
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = history
      .map((item) => {
        const ingredient = ingredients.find(
          (ing) => ing.id === item.ingredientId,
        );

        const price = ingredient?.price || 0;

        const total = price * item.quantity;

        return `
          <tr>
            <td>
              ${new Date(item.timestamp).toLocaleDateString("vi-VN")}
            </td>

            <td>
              <strong
                style="
                  color:var(--ingr-text-muted);
                  font-size:0.75rem;
                "
              >
                ${item.id}
              </strong>
            </td>

            <td>
              <span
                style="
                  font-weight:600;
                  color:#fff;
                "
              >
                ${ingredient?.name || ""}
              </span>
            </td>

            <td
              style="
                text-align:right;
                font-weight:700;
              "
            >
              +${item.quantity}
            </td>

            <td style="text-align:right">
              ${price.toLocaleString("vi-VN")} đ
            </td>

            <td
              style="
                text-align:right;
                color:var(--ingr-accent-amber);
                font-weight:700;
              "
            >
              ${total.toLocaleString("vi-VN")} đ
            </td>
          </tr>
        `;
      })
      .join("");
  }

  modal.classList.add("active");
}

function closeSupplierHistoryModal() {
  document
    .getElementById("ingr-supplier-history-modal")
    ?.classList.remove("active");
}

function closeSupplierCrudModal() {
  document
    .getElementById("ingr-supplier-crud-modal")
    ?.classList.remove("active");
}

function editSupplier(supplierId) {
  const supplier = suppliers.find((item) => item.id === supplierId);

  if (!supplier) return;

  document.getElementById("ingr-form-supplier-id").value = supplier.id;

  document.getElementById("ingr-form-supplier-name").value = supplier.name;

  document.getElementById("ingr-form-supplier-email").value = supplier.email;

  document.getElementById("ingr-form-supplier-phone").value = supplier.phone;

  document.getElementById("ingr-form-supplier-address").value =
    supplier.address;

  document.getElementById("ingr-supplier-modal-title").textContent =
    "Chỉnh sửa Nhà Cung Cấp";

  document.getElementById("ingr-supplier-crud-modal").classList.add("active");
}
