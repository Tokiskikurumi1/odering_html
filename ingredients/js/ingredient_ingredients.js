// ===============================
// SAMPLE DATA
// ===============================
const ingredients = [
  {
    id: "NL001",
    code: "NL001",
    name: "Thịt ba chỉ bò Mỹ",
    category: "Thịt",
    categoryColor: "#ef4444",
    stock: 45.5,
    unit: "kg",
    minStock: 15,
    expiry: "2026-06-15",
  },
  {
    id: "NL002",
    code: "NL002",
    name: "Tôm sú tươi sống",
    category: "Hải sản",
    categoryColor: "#06b6d4",
    stock: 4.2,
    unit: "kg",
    minStock: 10,
    expiry: "2026-05-27",
  },
  {
    id: "NL003",
    code: "NL003",
    name: "Xà lách thủy canh",
    category: "Rau củ",
    categoryColor: "#22c55e",
    stock: 12,
    unit: "kg",
    minStock: 5,
    expiry: "2026-05-24",
  },
  {
    id: "NL004",
    code: "NL004",
    name: "Sốt BBQ đặc chế",
    category: "Gia vị",
    categoryColor: "#f59e0b",
    stock: 35,
    unit: "lít",
    minStock: 10,
    expiry: "2026-09-30",
  },
  {
    id: "NL005",
    code: "NL005",
    name: "Than nướng không khói",
    category: "Khác",
    categoryColor: "#64748b",
    stock: 250,
    unit: "kg",
    minStock: 50,
    expiry: "2027-12-31",
  },
  {
    id: "NL006",
    code: "NL006",
    name: "Bia Heineken đóng chai",
    categoryId: "cat-3",
    stock: 40.0,
    unit: "thùng",
    minStock: 12.0,
    expiry: "2027-04-10",
    price: 410000,
  },
  {
    id: "NL007",
    code: "NL007",
    name: "Thịt sườn Tomahawk Mỹ",
    categoryId: "cat-1",
    stock: 2.0,
    unit: "kg",
    minStock: 8.0,
    expiry: "2026-06-10",
    price: 1250000,
  }, // Critical Low
  {
    id: "NL008",
    code: "NL008",
    name: "Nấm kim châm Đà Lạt",
    categoryId: "cat-2",
    stock: 9.0,
    unit: "gói",
    minStock: 15.0,
    expiry: "2026-05-29",
    price: 12000,
  }, // Warning Low
  {
    id: "NL009",
    code: "NL009",
    name: "Coca-Cola 330ml",
    categoryId: "cat-3",
    stock: 100.0,
    unit: "chai",
    minStock: 20.0,
    expiry: "2027-06-30",
    price: 15000,
  }, // Excess stock
  {
    id: "NL010",
    code: "NL010",
    name: "Bia Heineken đóng chai",
    categoryId: "cat-3",
    stock: 40.0,
    unit: "thùng",
    minStock: 12.0,
    expiry: "2027-04-10",
    price: 410000,
  },
  {
    id: "NL011",
    code: "NL011",
    name: "Thịt sườn Tomahawk Mỹ",
    categoryId: "cat-1",
    stock: 2.0,
    unit: "kg",
    minStock: 8.0,
    expiry: "2026-06-10",
    price: 1250000,
  }, // Critical Low
  {
    id: "NL012",
    code: "NL012",
    name: "Nấm kim châm Đà Lạt",
    categoryId: "cat-2",
    stock: 9.0,
    unit: "gói",
    minStock: 15.0,
    expiry: "2026-05-29",
    price: 12000,
  }, // Warning Low
];

// ===============================
// GET STATUS
// ===============================
function getIngredientStatus(item) {
  const today = new Date();
  const expiry = new Date(item.expiry);

  if (expiry < today) {
    return {
      className: "expired",
      label: "Hết hạn",
      icon: "fa-triangle-exclamation",
    };
  }

  if (item.stock <= item.minStock * 0.5) {
    return {
      className: "critical",
      label: "Cần nhập gấp",
      icon: "fa-triangle-exclamation",
    };
  }

  if (item.stock <= item.minStock) {
    return {
      className: "warning",
      label: "Sắp hết",
      icon: "fa-triangle-exclamation",
    };
  }

  return {
    className: "good",
    label: "Tồn kho tốt",
    icon: "fa-circle-check",
  };
}

// ===============================
// PAGINATION STATE
// ===============================
let currentPage = 1;
const itemsPerPage = 10;

// ===============================
// RENDER TABLE WITH PAGINATION
// ===============================
function renderIngredients() {
  const tbody = document.getElementById("ingr-ingredients-table-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  // Calculate pagination
  const totalItems = ingredients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Get items for current page
  const paginatedItems = ingredients.slice(startIndex, endIndex);

  paginatedItems.forEach((item) => {
    const status = getIngredientStatus(item);

    const expiryDate = new Date(item.expiry).toLocaleDateString("vi-VN");

    const row = `
      <tr>
        <td>
          <strong style="color: #f59e0b;">
            ${item.code}
          </strong>
        </td>

        <td style="font-weight: 600; color: white;">
          ${item.name}
        </td>

        <td>
          <span style="
            display:flex;
            align-items:center;
            gap:8px;
            font-weight:600;
          ">
            <span style="
              width:10px;
              height:10px;
              border-radius:50%;
              background:${item.categoryColor};
              display:inline-block;
            "></span>

            ${item.category}
          </span>
        </td>

        <td style="
          text-align:right;
          font-weight:700;
          color:${status.className === "critical" ? "#ef4444" : "white"};
        ">
          ${item.stock}
        </td>

        <td>${item.unit}</td>

        <td>${expiryDate}</td>

        <td>
          <span class="ingr-ingredient-status-badge ${status.className}">
            <i class="fa-solid ${status.icon}"></i>
            ${status.label}
          </span>
        </td>

        <td style="text-align:center;">
          <button
            class="ingr-ingredient-action-btn-circle"
            onclick="editIngredient('${item.id}')"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            class="ingr-ingredient-action-btn-circle delete"
            onclick="deleteIngredient('${item.id}')"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;

    tbody.innerHTML += row;
  });

  // Update pagination info
  renderPaginationInfo(startIndex, endIndex, totalItems);
  
  // Render pagination controls
  renderPaginationControls(totalPages);
}

// ===============================
// RENDER PAGINATION INFO
// ===============================
function renderPaginationInfo(startIndex, endIndex, totalItems) {
  const pageInfo = document.getElementById("ingr-ingredients-page-info");

  if (pageInfo) {
    const startNum = totalItems > 0 ? startIndex + 1 : 0;
    pageInfo.textContent = `Hiển thị ${startNum}-${endIndex} trên ${totalItems} nguyên liệu`;
  }
}

// ===============================
// RENDER PAGINATION CONTROLS
// Smart pagination: < 1 2 3 ... n-2 n-1 n >
// ===============================
function renderPaginationControls(totalPages) {
  const controls = document.getElementById("ingr-ingredients-page-controls");
  
  if (!controls) return;
  
  if (totalPages <= 1) {
    controls.innerHTML = "";
    return;
  }

  let pages = [];
  
  // Always show first page
  pages.push(1);
  
  // Logic for middle pages
  if (totalPages <= 7) {
    // If total pages <= 7, show all
    for (let i = 2; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Smart pagination
    if (currentPage <= 3) {
      // Near start: 1 2 3 4 ... n-1 n
      pages.push(2, 3, 4, '...', totalPages - 1, totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near end: 1 2 ... n-3 n-2 n-1 n
      pages.push(2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Middle: 1 2 ... current-1 current current+1 ... n-1 n
      pages.push(2, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1, totalPages);
    }
  }

  // Build HTML
  let html = `
    <button 
      class="ingr-pagination-number-btn" 
      ${currentPage === 1 ? 'disabled' : ''} 
      onclick="setIngredientsPage(${currentPage - 1})" 
      title="Trang trước"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
  `;

  pages.forEach(page => {
    if (page === '...') {
      html += `<span class="ingr-pagination-ellipsis">...</span>`;
    } else {
      html += `
        <button 
          class="ingr-pagination-number-btn ${currentPage === page ? 'active' : ''}" 
          onclick="setIngredientsPage(${page})"
        >
          ${page}
        </button>
      `;
    }
  });

  html += `
    <button 
      class="ingr-pagination-number-btn" 
      ${currentPage === totalPages ? 'disabled' : ''} 
      onclick="setIngredientsPage(${currentPage + 1})" 
      title="Trang sau"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;

  controls.innerHTML = html;
}

// ===============================
// SET PAGE FUNCTION
// ===============================
function setIngredientsPage(pageNum) {
  const totalPages = Math.ceil(ingredients.length / itemsPerPage);
  
  if (pageNum < 1 || pageNum > totalPages) return;
  
  currentPage = pageNum;
  renderIngredients();
}

// =====================================
// CRUD INGREDIENT
// =====================================

const ingrModal = document.getElementById("ingr-ingredient-crud-modal");
const ingrForm = document.getElementById("ingr-ingredient-form-element");

const addIngredientBtn = document.getElementById("ingr-btn-add-ingredient");

const closeIngrBtn = document.getElementById("ingr-ingredient-modal-close");

const cancelIngrBtn = document.getElementById(
  "ingr-ingredient-modal-cancel-btn",
);

// =========================
// OPEN ADD MODAL
// =========================

addIngredientBtn.onclick = function () {
  document.getElementById("ingr-ingredient-modal-title").textContent =
    "Thêm Nguyên Liệu Mới";

  ingrForm.reset();

  document.getElementById("ingr-form-ingredient-id").value = "";

  ingrModal.classList.add("active");
};

// =========================
// CLOSE MODAL
// =========================

function dismissIngrModal() {
  ingrModal.classList.remove("active");
}

closeIngrBtn.onclick = dismissIngrModal;
cancelIngrBtn.onclick = dismissIngrModal;

// =========================
// EDIT
// =========================

function editIngredient(id) {
  const ingredient = ingredients.find((i) => i.id === id);

  if (!ingredient) return;

  document.getElementById("ingr-ingredient-modal-title").textContent =
    "Cập Nhật Nguyên Liệu";

  document.getElementById("ingr-form-ingredient-id").value = ingredient.id;

  document.getElementById("ingr-form-ingredient-code").value = ingredient.code;

  document.getElementById("ingr-form-ingredient-name").value = ingredient.name;

  document.getElementById("ingr-form-ingredient-unit").value = ingredient.unit;

  document.getElementById("ingr-form-ingredient-stock").value =
    ingredient.stock;

  document.getElementById("ingr-form-ingredient-min-stock").value =
    ingredient.minStock;

  document.getElementById("ingr-form-ingredient-expiry").value =
    ingredient.expiry;

  document.getElementById("ingr-form-ingredient-price").value =
    ingredient.price || 0;

  ingrModal.classList.add("active");
}

// =========================
// DELETE
// =========================

function deleteIngredient(id) {
  const ingredient = ingredients.find((i) => i.id === id);

  if (!ingredient) return;

  const confirmDelete = confirm(
    `Bạn có chắc muốn xóa nguyên liệu "${ingredient.name}" ?`,
  );

  if (!confirmDelete) return;

  const index = ingredients.findIndex((i) => i.id === id);

  if (index !== -1) {
    ingredients.splice(index, 1);
  }

  renderIngredients();

  if (typeof showToast === "function") {
    showToast("Xóa thành công", `${ingredient.name} đã được xóa`, "success");
  }
}

// =========================
// SAVE (ADD / UPDATE)
// =========================

ingrForm.onsubmit = function (e) {
  e.preventDefault();

  const id = document.getElementById("ingr-form-ingredient-id").value;

  const code = document
    .getElementById("ingr-form-ingredient-code")
    .value.trim();

  const name = document
    .getElementById("ingr-form-ingredient-name")
    .value.trim();

  const unit = document
    .getElementById("ingr-form-ingredient-unit")
    .value.trim();

  const stock =
    parseFloat(document.getElementById("ingr-form-ingredient-stock").value) ||
    0;

  const minStock =
    parseFloat(
      document.getElementById("ingr-form-ingredient-min-stock").value,
    ) || 0;

  const expiry = document.getElementById("ingr-form-ingredient-expiry").value;

  const price =
    parseFloat(document.getElementById("ingr-form-ingredient-price").value) ||
    0;

  if (!code || !name || !unit || !expiry) {
    if (typeof showToast === "function") {
      showToast("Thiếu dữ liệu", "Vui lòng nhập đầy đủ thông tin", "warning");
    }

    return;
  }

  // =====================
  // UPDATE
  // =====================

  if (id) {
    const ingredient = ingredients.find((i) => i.id === id);

    if (ingredient) {
      ingredient.code = code;
      ingredient.name = name;
      ingredient.unit = unit;
      ingredient.stock = stock;
      ingredient.minStock = minStock;
      ingredient.expiry = expiry;
      ingredient.price = price;
    }

    if (typeof showToast === "function") {
      showToast("Cập nhật thành công", `${name} đã được cập nhật`, "success");
    }
  }

  // =====================
  // ADD
  // =====================
  else {
    const newIngredient = {
      id: `NL${Date.now()}`,
      code,
      name,
      stock,
      unit,
      minStock,
      expiry,
      price,

      category: "Khác",
      categoryColor: "#64748b",
    };

    ingredients.push(newIngredient);

    if (typeof showToast === "function") {
      showToast("Thêm thành công", `${name} đã được thêm`, "success");
    }
  }

  dismissIngrModal();

  renderIngredients();
};

// ===============================
// LOAD WHEN PAGE READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderIngredients();
});
