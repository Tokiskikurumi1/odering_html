// ===============================
// TRANSACTION HISTORY
// ===============================

const historyData = [
  {
    id: "TX0001",
    timestamp: "2026-06-01T08:30:00",
    type: "IMPORT",
    ingredientId: 1,
    qty: 50,
    user: "Nguyễn Minh Nam",
    details: "Nhập thịt bò từ NCC An Phát",
  },
  {
    id: "TX0002",
    timestamp: "2026-06-01T10:15:00",
    type: "EXPORT",
    ingredientId: 1,
    qty: -8,
    user: "Nguyễn Minh Nam",
    details: "Xuất cho bếp chế biến",
  },
  {
    id: "TX0003",
    timestamp: "2026-06-01T14:20:00",
    type: "IMPORT",
    ingredientId: 2,
    qty: 30,
    user: "Trần Văn Hải",
    details: "Nhập rau xà lách",
  },
  {
    id: "TX0004",
    timestamp: "2026-06-02T09:00:00",
    type: "AUDIT",
    ingredientId: 3,
    qty: -2,
    user: "Nguyễn Minh Nam",
    details: "Điều chỉnh sau kiểm kê",
  },
  {
    id: "TX0005",
    timestamp: "2026-06-02T11:45:00",
    type: "CRUD",
    ingredientId: 4,
    qty: 0,
    user: "Admin",
    details: "Cập nhật thông tin nguyên liệu",
  },
];

const ingredients = [
  {
    id: 1,
    code: "NL001",
    name: "Thịt bò Mỹ",
    unit: "kg",
  },
  {
    id: 2,
    code: "NL002",
    name: "Rau xà lách",
    unit: "kg",
  },
  {
    id: 3,
    code: "NL003",
    name: "Kim chi",
    unit: "kg",
  },
  {
    id: 4,
    code: "NL004",
    name: "Nước sốt BBQ",
    unit: "chai",
  },
];

// State management
let historyPagination;
let currentFilteredHistory = [...historyData];

document.addEventListener("DOMContentLoaded", () => {
  refreshHistoryTable();

  document
    .getElementById("ingr-history-filter-reset")
    ?.addEventListener("click", resetHistoryFilter);

  [
    "ingr-history-date-start",
    "ingr-history-date-end",
    "ingr-history-type-filter",
  ].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", applyHistoryFilter);
  });
});

function applyHistoryFilter() {
  const startDate =
    document.getElementById("ingr-history-date-start")?.value || "";

  const endDate = document.getElementById("ingr-history-date-end")?.value || "";

  const typeFilter =
    document.getElementById("ingr-history-type-filter")?.value || "all";

  currentFilteredHistory = historyData.filter((tx) => {
    const txDate = new Date(tx.timestamp);

    const matchStart =
      !startDate || txDate >= new Date(startDate + "T00:00:00");

    const matchEnd = !endDate || txDate <= new Date(endDate + "T23:59:59");

    const matchType = typeFilter === "all" || tx.type === typeFilter;

    return matchStart && matchEnd && matchType;
  });

  refreshHistoryTable();
}

function refreshHistoryTable() {
  if (!historyPagination) {
    historyPagination = new Pagination({
      data: currentFilteredHistory,
      itemsPerPage: 10,
      infoElementId: "ingr-ingredients-page-info",
      controlsElementId: "ingr-ingredients-page-controls",
      onRender: renderHistory,
    });
    historyPagination.render();
  } else {
    historyPagination.setData(currentFilteredHistory);
  }
}

function renderHistory(pageData) {
  const tbody = document.getElementById("ingr-history-table-body");

  if (!tbody) return;

  if (!pageData || !pageData.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="ingr-empty-state-card-wrapper">
            <i class="fa-solid fa-receipt ingr-empty-state-illustrated-icon"></i>
            <p class="ingr-empty-state-headline">
              Không tìm thấy giao dịch nào
            </p>
            <p class="ingr-empty-state-guidance">
              Không có dữ liệu phù hợp với bộ lọc.
            </p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pageData
    .map((tx) => {
      const ingredient = ingredients.find(
        (item) => item.id === tx.ingredientId,
      );

      const ingredientName = ingredient
        ? ingredient.name
        : "Nguyên liệu không tồn tại";

      const unit = ingredient?.unit || "";

      let badgeClass = "info";

      if (tx.type === "IMPORT") badgeClass = "good";
      if (tx.type === "EXPORT") badgeClass = "warning";
      if (tx.type === "AUDIT") badgeClass = "info";
      if (tx.type === "CRUD") badgeClass = "expired";

      const qtyColor =
        tx.qty >= 0
          ? "var(--ingr-status-success)"
          : "var(--ingr-status-danger)";

      const qtyText = (tx.qty > 0 ? "+" : "") + tx.qty.toFixed(1) + " " + unit;

      return `
        <tr>
          <td>
            ${new Date(tx.timestamp).toLocaleString("vi-VN")}
          </td>

          <td>
            <strong style="color:var(--ingr-text-muted)">
              ${tx.id}
            </strong>
          </td>

          <td>
            <span class="ingr-ingredient-status-badge ${badgeClass}">
              ${tx.type}
            </span>
          </td>

          <td>
            <strong style="color:#fff">
              ${ingredientName}
            </strong>
          </td>

          <td
            style="
              text-align:right;
              font-weight:700;
              color:${qtyColor};
            "
          >
            ${qtyText}
          </td>

          <td>${tx.user}</td>

          <td>
            <span style="color:var(--ingr-text-muted)">
              ${tx.details}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
}

function resetHistoryFilter() {
  document.getElementById("ingr-history-date-start").value = "";
  document.getElementById("ingr-history-date-end").value = "";
  document.getElementById("ingr-history-type-filter").value = "all";

  currentFilteredHistory = [...historyData];
  refreshHistoryTable();
}
