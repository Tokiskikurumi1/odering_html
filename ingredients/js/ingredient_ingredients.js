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
// RENDER TABLE
// ===============================
function renderIngredients() {
  const tbody = document.getElementById("ingr-ingredients-table-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  ingredients.forEach((item) => {
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
          <button class="ingr-ingredient-action-btn-circle">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button class="ingr-ingredient-action-btn-circle delete">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;

    tbody.innerHTML += row;
  });

  // Pagination Info
  const pageInfo = document.getElementById("ingr-ingredients-page-info");

  if (pageInfo) {
    pageInfo.textContent = `Hiển thị 1-${ingredients.length} trên ${ingredients.length} nguyên liệu`;
  }
}

// ===============================
// LOAD WHEN PAGE READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderIngredients();
});
