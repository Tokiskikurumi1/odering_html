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
  {
    id: "NL013",
    code: "NL013",
    name: "Thịt ba chỉ bò Mỹ",
    category: "Thịt",
    categoryColor: "#ef4444",
    stock: 45.5,
    unit: "kg",
    minStock: 15,
    expiry: "2026-06-15",
  },
  {
    id: "NL014",
    code: "NL014",
    name: "Tôm sú tươi sống",
    category: "Hải sản",
    categoryColor: "#06b6d4",
    stock: 4.2,
    unit: "kg",
    minStock: 10,
    expiry: "2026-05-27",
  },
  {
    id: "NL015",
    code: "NL015",
    name: "Xà lách thủy canh",
    category: "Rau củ",
    categoryColor: "#22c55e",
    stock: 12,
    unit: "kg",
    minStock: 5,
    expiry: "2026-05-24",
  },
  {
    id: "NL016",
    code: "NL016",
    name: "Sốt BBQ đặc chế",
    category: "Gia vị",
    categoryColor: "#f59e0b",
    stock: 35,
    unit: "lít",
    minStock: 10,
    expiry: "2026-09-30",
  },
  {
    id: "NL017",
    code: "NL017",
    name: "Than nướng không khói",
    category: "Khác",
    categoryColor: "#64748b",
    stock: 250,
    unit: "kg",
    minStock: 50,
    expiry: "2027-12-31",
  },
  {
    id: "NL018",
    code: "NL018",
    name: "Bia Heineken đóng chai",
    categoryId: "cat-3",
    stock: 40.0,
    unit: "thùng",
    minStock: 12.0,
    expiry: "2027-04-10",
    price: 410000,
  },
  {
    id: "NL019",
    code: "NL019",
    name: "Thịt sườn Tomahawk Mỹ",
    categoryId: "cat-1",
    stock: 2.0,
    unit: "kg",
    minStock: 8.0,
    expiry: "2026-06-10",
    price: 1250000,
  }, // Critical Low
  {
    id: "NL020",
    code: "NL020",
    name: "Nấm kim châm Đà Lạt",
    categoryId: "cat-2",
    stock: 9.0,
    unit: "gói",
    minStock: 15.0,
    expiry: "2026-05-29",
    price: 12000,
  }, // Warning Low
  {
    id: "NL021",
    code: "NL021",
    name: "Coca-Cola 330ml",
    categoryId: "cat-3",
    stock: 100.0,
    unit: "chai",
    minStock: 20.0,
    expiry: "2027-06-30",
    price: 15000,
  }, // Excess stock
  {
    id: "NL022",
    code: "NL022",
    name: "Bia Heineken đóng chai",
    categoryId: "cat-3",
    stock: 40.0,
    unit: "thùng",
    minStock: 12.0,
    expiry: "2027-04-10",
    price: 410000,
  },
  {
    id: "NL023",
    code: "NL023",
    name: "Thịt sườn Tomahawk Mỹ",
    categoryId: "cat-1",
    stock: 2.0,
    unit: "kg",
    minStock: 8.0,
    expiry: "2026-06-10",
    price: 1250000,
  }, // Critical Low
  {
    id: "NL024",
    code: "NL024",
    name: "Nấm kim châm Đà Lạt",
    categoryId: "cat-2",
    stock: 9.0,
    unit: "gói",
    minStock: 15.0,
    expiry: "2026-05-29",
    price: 12000,
  }, // Warning Low

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
  {
    id: "NL013",
    code: "NL013",
    name: "Thịt ba chỉ bò Mỹ",
    category: "Thịt",
    categoryColor: "#ef4444",
    stock: 45.5,
    unit: "kg",
    minStock: 15,
    expiry: "2026-06-15",
  },
  {
    id: "NL014",
    code: "NL014",
    name: "Tôm sú tươi sống",
    category: "Hải sản",
    categoryColor: "#06b6d4",
    stock: 4.2,
    unit: "kg",
    minStock: 10,
    expiry: "2026-05-27",
  },
  {
    id: "NL015",
    code: "NL015",
    name: "Xà lách thủy canh",
    category: "Rau củ",
    categoryColor: "#22c55e",
    stock: 12,
    unit: "kg",
    minStock: 5,
    expiry: "2026-05-24",
  },
  {
    id: "NL016",
    code: "NL016",
    name: "Sốt BBQ đặc chế",
    category: "Gia vị",
    categoryColor: "#f59e0b",
    stock: 35,
    unit: "lít",
    minStock: 10,
    expiry: "2026-09-30",
  },
  {
    id: "NL017",
    code: "NL017",
    name: "Than nướng không khói",
    category: "Khác",
    categoryColor: "#64748b",
    stock: 250,
    unit: "kg",
    minStock: 50,
    expiry: "2027-12-31",
  },
  {
    id: "NL018",
    code: "NL018",
    name: "Bia Heineken đóng chai",
    categoryId: "cat-3",
    stock: 40.0,
    unit: "thùng",
    minStock: 12.0,
    expiry: "2027-04-10",
    price: 410000,
  },
  {
    id: "NL019",
    code: "NL019",
    name: "Thịt sườn Tomahawk Mỹ",
    categoryId: "cat-1",
    stock: 2.0,
    unit: "kg",
    minStock: 8.0,
    expiry: "2026-06-10",
    price: 1250000,
  }, // Critical Low
  {
    id: "NL020",
    code: "NL020",
    name: "Nấm kim châm Đà Lạt",
    categoryId: "cat-2",
    stock: 9.0,
    unit: "gói",
    minStock: 15.0,
    expiry: "2026-05-29",
    price: 12000,
  }, // Warning Low
  {
    id: "NL021",
    code: "NL021",
    name: "Coca-Cola 330ml",
    categoryId: "cat-3",
    stock: 100.0,
    unit: "chai",
    minStock: 20.0,
    expiry: "2027-06-30",
    price: 15000,
  }, // Excess stock
  {
    id: "NL022",
    code: "NL022",
    name: "Bia Heineken đóng chai",
    categoryId: "cat-3",
    stock: 40.0,
    unit: "thùng",
    minStock: 12.0,
    expiry: "2027-04-10",
    price: 410000,
  },
  {
    id: "NL023",
    code: "NL023",
    name: "Thịt sườn Tomahawk Mỹ",
    categoryId: "cat-1",
    stock: 2.0,
    unit: "kg",
    minStock: 8.0,
    expiry: "2026-06-10",
    price: 1250000,
  }, // Critical Low
  {
    id: "NL024",
    code: "NL024",
    name: "Nấm kim châm Đà Lạt",
    categoryId: "cat-2",
    stock: 9.0,
    unit: "gói",
    minStock: 15.0,
    expiry: "2026-05-29",
    price: 12000,
  }, // Warning Low
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
  {
    id: "NL013",
    code: "NL013",
    name: "Thịt ba chỉ bò Mỹ",
    category: "Thịt",
    categoryColor: "#ef4444",
    stock: 45.5,
    unit: "kg",
    minStock: 15,
    expiry: "2026-06-15",
  },
  {
    id: "NL014",
    code: "NL014",
    name: "Tôm sú tươi sống",
    category: "Hải sản",
    categoryColor: "#06b6d4",
    stock: 4.2,
    unit: "kg",
    minStock: 10,
    expiry: "2026-05-27",
  },
  {
    id: "NL015",
    code: "NL015",
    name: "Xà lách thủy canh",
    category: "Rau củ",
    categoryColor: "#22c55e",
    stock: 12,
    unit: "kg",
    minStock: 5,
    expiry: "2026-05-24",
  },
  {
    id: "NL016",
    code: "NL016",
    name: "Sốt BBQ đặc chế",
    category: "Gia vị",
    categoryColor: "#f59e0b",
    stock: 35,
    unit: "lít",
    minStock: 10,
    expiry: "2026-09-30",
  },
  {
    id: "NL017",
    code: "NL017",
    name: "Than nướng không khói",
    category: "Khác",
    categoryColor: "#64748b",
    stock: 250,
    unit: "kg",
    minStock: 50,
    expiry: "2027-12-31",
  },
  {
    id: "NL018",
    code: "NL018",
    name: "Bia Heineken đóng chai",
    categoryId: "cat-3",
    stock: 40.0,
    unit: "thùng",
    minStock: 12.0,
    expiry: "2027-04-10",
    price: 410000,
  },
  {
    id: "NL019",
    code: "NL019",
    name: "Thịt sườn Tomahawk Mỹ",
    categoryId: "cat-1",
    stock: 2.0,
    unit: "kg",
    minStock: 8.0,
    expiry: "2026-06-10",
    price: 1250000,
  }, // Critical Low
  {
    id: "NL020",
    code: "NL020",
    name: "Nấm kim châm Đà Lạt",
    categoryId: "cat-2",
    stock: 9.0,
    unit: "gói",
    minStock: 15.0,
    expiry: "2026-05-29",
    price: 12000,
  }, // Warning Low
  {
    id: "NL021",
    code: "NL021",
    name: "Coca-Cola 330ml",
    categoryId: "cat-3",
    stock: 100.0,
    unit: "chai",
    minStock: 20.0,
    expiry: "2027-06-30",
    price: 15000,
  }, // Excess stock
  {
    id: "NL022",
    code: "NL022",
    name: "Bia Heineken đóng chai",
    categoryId: "cat-3",
    stock: 40.0,
    unit: "thùng",
    minStock: 12.0,
    expiry: "2027-04-10",
    price: 410000,
  },
  {
    id: "NL023",
    code: "NL023",
    name: "Thịt sườn Tomahawk Mỹ",
    categoryId: "cat-1",
    stock: 2.0,
    unit: "kg",
    minStock: 8.0,
    expiry: "2026-06-10",
    price: 1250000,
  }, // Critical Low
  {
    id: "NL024",
    code: "NL024",
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

// ===============================
// RENDER TABLE WITH PAGINATION
// ===============================

// ===============================
// RENDER PAGINATION INFO
// ===============================

const ingredientPagination = new Pagination({
  data: ingredients,
  itemsPerPage: 10,

  infoElementId: "ingr-ingredients-page-info",

  controlsElementId: "ingr-ingredients-page-controls",

  onRender: renderIngredientRows,
});

function renderIngredientRows(pageData) {
  const tbody = document.getElementById("ingr-ingredients-table-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  pageData.forEach((item) => {
    const status = getIngredientStatus(item);

    const expiryDate = new Date(item.expiry).toLocaleDateString("vi-VN");

    const row = `
      <tr>
        <td>
          <strong style="color:#f59e0b;">
            ${item.code}
          </strong>
        </td>

        <td style="font-weight:600;color:white;">
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

  ingredientPagination.setData(ingredients);

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

  ingredientPagination.setData(ingredients);
};

// ===============================
// LOAD WHEN PAGE READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  ingredientPagination.render();
});
