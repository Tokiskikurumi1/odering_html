// ======================================
// SAMPLE INGREDIENT DATA
// ======================================

const ingredients = [
  {
    id: "NL001",
    name: "Thịt ba chỉ bò Mỹ",
    category: "Thịt",
    categoryColor: "#ef4444",
    stock: 45.5,
    minStock: 15,
    unit: "kg",
    expiry: "2026-06-15",
    price: 220000,
  },
  {
    id: "NL002",
    name: "Tôm sú tươi sống",
    category: "Hải sản",
    categoryColor: "#06b6d4",
    stock: 4.2,
    minStock: 10,
    unit: "kg",
    expiry: "2026-05-27",
    price: 380000,
  },
  {
    id: "NL003",
    name: "Xà lách thủy canh",
    category: "Rau củ",
    categoryColor: "#22c55e",
    stock: 12,
    minStock: 5,
    unit: "kg",
    expiry: "2026-05-24",
    price: 45000,
  },
  {
    id: "NL004",
    name: "Sốt BBQ đặc chế Kurumi",
    category: "Gia vị",
    categoryColor: "#f59e0b",
    stock: 35,
    minStock: 10,
    unit: "lít",
    expiry: "2026-09-30",
    price: 85000,
  },
  {
    id: "NL005",
    name: "Sườn Tomahawk Mỹ",
    category: "Thịt",
    categoryColor: "#ef4444",
    stock: 2,
    minStock: 8,
    unit: "kg",
    expiry: "2026-06-10",
    price: 1250000,
  },
  {
    id: "NL006",
    name: "Sốt BBQ đặc chế Kurumi",
    category: "Gia vị",
    categoryColor: "#f59e0b",
    stock: 35,
    minStock: 10,
    unit: "lít",
    expiry: "2026-09-30",
    price: 85000,
  },
  {
    id: "NL007",
    name: "Sườn Tomahawk Mỹ",
    category: "Thịt",
    categoryColor: "#ef4444",
    stock: 2,
    minStock: 8,
    unit: "kg",
    expiry: "2026-06-10",
    price: 1250000,
  },
  {
    id: "NL008",
    name: "Sườn Tomahawk Mỹ",
    category: "Khác",
    categoryColor: "#beb8b8",
    stock: 2,
    minStock: 8,
    unit: "kg",
    expiry: "2026-06-10",
    price: 1250000,
  },
];

// ======================================
// HISTORY DATA
// ======================================

const historyData = [
  {
    id: "TX-001",
    timestamp: "2026-05-25T08:30:00+07:00",
    type: "IMPORT",
    details: "Nhập hàng từ CP Group",
    ingredientId: "NL001",
    qty: 20,
    user: "Nguyễn Minh Nam",
  },
  {
    id: "TX-002",
    timestamp: "2026-05-25T09:15:00+07:00",
    type: "EXPORT",
    details: "Xuất kho phục vụ Bếp chính",
    ingredientId: "NL001",
    qty: -12.5,
    user: "Nguyễn Minh Nam",
  },
  {
    id: "TX-003",
    timestamp: "2026-05-24T16:00:00+07:00",
    type: "AUDIT",
    details: "Điều chỉnh kiểm kê",
    ingredientId: "NL004",
    qty: 2,
    user: "Nguyễn Minh Nam",
  },
  {
    id: "TX-004",
    timestamp: "2026-05-24T17:45:00+07:00",
    type: "CRUD",
    details: "Khởi tạo nguyên liệu mới",
    ingredientId: "NL007",
    qty: 2,
    user: "Nguyễn Minh Nam",
  },
  {
    id: "TX-005",
    timestamp: "2026-05-26T10:20:00+07:00",
    type: "IMPORT",
    details: "Nhập thêm hàng từ nhà cung cấp",
    ingredientId: "NL002",
    qty: 15,
    user: "Trần Quốc Huy",
  },
  {
    id: "TX-006",
    timestamp: "2026-05-26T11:10:00+07:00",
    type: "EXPORT",
    details: "Xuất kho cho bếp buffet",
    ingredientId: "NL003",
    qty: -5,
    user: "Lê Văn Khánh",
  },
];

// ======================================
// GET STATUS
// ======================================

function getIngredientStatus(item) {
  const today = new Date();
  const expiry = new Date(item.expiry);

  if (expiry < today) {
    return "expired";
  }

  if (item.stock <= item.minStock * 0.5) {
    return "critical";
  }

  if (item.stock <= item.minStock) {
    return "warning";
  }

  return "good";
}

// ======================================
// RENDER DASHBOARD STATS
// ======================================

function renderStats() {
  const totalIngredients = ingredients.length;

  const lowStock = ingredients.filter((item) => {
    const status = getIngredientStatus(item);

    return status === "warning" || status === "critical";
  }).length;

  const expired = ingredients.filter((item) => {
    return getIngredientStatus(item) === "expired";
  }).length;

  const totalValue = ingredients.reduce((sum, item) => {
    return sum + item.stock * item.price;
  }, 0);

  document.getElementById("ingr-dashboard-stat-total").textContent =
    totalIngredients;

  document.getElementById("ingr-dashboard-stat-low").textContent = lowStock;

  document.getElementById("ingr-dashboard-stat-expired").textContent = expired;

  document.getElementById("ingr-dashboard-stat-value").textContent =
    totalValue.toLocaleString("vi-VN") + " đ";
}

// ======================================
// RENDER CHART
// ======================================

function renderChart() {
  const canvas = document.getElementById("ingr-dashboard-pie-chart");

  if (!canvas) return;

  const categoryMap = {};

  ingredients.forEach((item) => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = {
        value: 0,
        color: item.categoryColor,
      };
    }

    categoryMap[item.category].value += item.stock * item.price;
  });

  const labels = Object.keys(categoryMap);

  const values = Object.values(categoryMap).map((item) => item.value);

  const colors = Object.values(categoryMap).map((item) => item.color);

  new Chart(canvas, {
    type: "doughnut",

    data: {
      labels: labels,

      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      layout: {
        padding: {
          top: 10,
          bottom: 10,
        },
      },

      plugins: {
        legend: {
          position: "bottom",

          align: "center",

          labels: {
            color: "#e2e8f0",

            usePointStyle: false,

            boxWidth: 40,
            boxHeight: 14,

            padding: 20,

            font: {
              size: 14,
              weight: "600",
            },
          },
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              return (
                context.label +
                ": " +
                context.raw.toLocaleString("vi-VN") +
                " đ"
              );
            },
          },
        },
      },

      cutout: "58%",
    },
  });
}

// ======================================
// RENDER URGENT LIST
// ======================================

function renderUrgentList() {
  const container = document.getElementById("ingr-dashboard-urgent-list");

  if (!container) return;

  const urgentItems = ingredients.filter((item) => {
    const status = getIngredientStatus(item);

    return (
      status === "critical" || status === "warning" || status === "expired"
    );
  });

  if (urgentItems.length === 0) {
    container.innerHTML = `
      <div class="ingr-empty-state-card-wrapper">
        <p>Không có nguyên liệu khẩn cấp</p>
      </div>
    `;

    return;
  }

  container.innerHTML = urgentItems
    .map((item) => {
      const status = getIngredientStatus(item);

      let label = "Sắp hết";
      let badgeClass = "warning";

      if (status === "critical") {
        label = "Nhập gấp";
        badgeClass = "danger";
      }

      if (status === "expired") {
        label = "Hết hạn";
        badgeClass = "expired";
      }

      return `
        <div class="ingr-urgent-replenish-item">

          <div class="ingr-urgent-item-info">
            <span class="ingr-urgent-item-name">
              ${item.name}
            </span>

            <span class="ingr-urgent-item-details">
              Tồn: ${item.stock} ${item.unit}
            </span>
          </div>

          <span class="ingr-urgent-item-badge ${badgeClass}">
            ${label}
          </span>

        </div>
      `;
    })
    .join("");
}

// ======================================
// RENDER ACTIVITIES
// ======================================

function renderActivities() {
  const container = document.getElementById("ingr-dashboard-activities");

  if (!container) return;

  const recent = historyData.slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = `
      <p style="
        text-align:center;
        color:#94a3b8;
        font-size:0.85rem;
        margin:20px 0;
      ">
        Chưa có hoạt động nào được ghi nhận.
      </p>
    `;

    return;
  }

  container.innerHTML = recent
    .map((tx) => {
      // =========================
      // TYPE STYLE
      // =========================

      let typeClass = "import";
      let sign = "+";

      if (tx.type === "EXPORT") {
        typeClass = "export";
        sign = "-";
      }

      if (tx.type === "AUDIT") {
        typeClass = "audit";
        sign = "±";
      }

      if (tx.type === "CRUD") {
        typeClass = "crud";
        sign = "";
      }

      // =========================
      // FIND INGREDIENT
      // =========================

      const ingredient = ingredients.find(
        (item) => item.id === tx.ingredientId,
      );

      const ingredientName = ingredient ? ingredient.name : "Nguyên liệu";

      const unit = ingredient ? ingredient.unit : "";

      // =========================
      // FORMAT TIME
      // =========================

      const date = new Date(tx.timestamp);

      const timeFormatted =
        date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }) +
        " " +
        date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });

      // =========================
      // RETURN HTML
      // =========================

      return `
        <div class="ingr-timeline-activity-item ${typeClass}">

          <div class="ingr-activity-item-dot"></div>

          <div class="ingr-activity-item-content">

            <span class="ingr-activity-item-desc">
              ${tx.details}:
              <strong>${ingredientName}</strong>
              (${sign}${Math.abs(tx.qty)} ${unit})
            </span>

            <span class="ingr-activity-item-time">
              ${timeFormatted} - ${tx.user}
            </span>

          </div>

        </div>
      `;
    })
    .join("");
}

showToast(
  "Chào mừng",
  "Hệ thống Quản lý kho Kurumi BBQ đã khởi động thành công.",
  "success",
);

// ======================================
// LOAD PAGE
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  renderStats();

  renderChart();

  renderUrgentList();

  renderActivities();
});
