const ingredients = [
  {
    id: "NL001",
    code: "THITBO",
    name: "Thịt bò Mỹ",
    stock: 5,
    unit: "kg",
    minStock: 10,
    expiry: "2026-06-01",
  },
  {
    id: "NL002",
    code: "RAUXL",
    name: "Rau xà lách",
    stock: 2,
    unit: "kg",
    minStock: 8,
    expiry: "2026-05-20",
  },
  {
    id: "NL003",
    code: "NAMKIM",
    name: "Nấm kim châm",
    stock: 7,
    unit: "kg",
    minStock: 10,
    expiry: "2026-06-05",
  },
  {
    id: "NL004",
    code: "SOOTBBQ",
    name: "Sốt BBQ",
    stock: 80,
    unit: "chai",
    minStock: 20,
    expiry: "2026-12-31",
  },
];
function getIngredientStatus(ingr) {
  const today = new Date();
  const expiryDate = new Date(ingr.expiry);

  if (expiryDate < today) {
    return "expired";
  }

  if (ingr.stock <= ingr.minStock * 0.5) {
    return "critical";
  }

  if (ingr.stock < ingr.minStock) {
    return "warning";
  }

  if (ingr.stock > ingr.minStock * 3) {
    return "excess";
  }

  return "normal";
}
let activeWarningTypeFilter = "all";
let warningsPagination;

document.addEventListener("DOMContentLoaded", () => {
  refreshWarningsTable();

  const warningPillFilters = document.querySelectorAll(
    ".ingr-warning-pill-filter",
  );

  warningPillFilters.forEach((pill) => {
    pill.addEventListener("click", () => {
      warningPillFilters.forEach((p) => p.classList.remove("active"));

      pill.classList.add("active");

      activeWarningTypeFilter = pill.dataset.type;

      refreshWarningsTable();
    });
  });
});

function getFilteredWarnings() {
  return ingredients.filter((ingr) => {
    const status = getIngredientStatus(ingr);

    if (activeWarningTypeFilter === "all") {
      return (
        status === "critical" ||
        status === "warning" ||
        status === "expired" ||
        status === "excess"
      );
    }

    return status === activeWarningTypeFilter;
  });
}

function refreshWarningsTable() {
  const warningIngredients = getFilteredWarnings();

  if (!warningsPagination) {
    warningsPagination = new Pagination({
      data: warningIngredients,
      itemsPerPage: 10,
      infoElementId: "ingr-ingredients-page-info",
      controlsElementId: "ingr-ingredients-page-controls",
      onRender: renderWarnings,
    });
    warningsPagination.render();
  } else {
    warningsPagination.setData(warningIngredients);
  }
}

function renderWarnings(pageData) {
  const tbody = document.getElementById("ingr-warnings-table-body");

  if (!tbody) return;

  if (!pageData || pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="ingr-empty-state-card-wrapper">
            <i class="fa-solid fa-circle-check ingr-empty-state-illustrated-icon"
               style="color: var(--ingr-status-success);"></i>
            <p class="ingr-empty-state-headline">
              Kho hàng tuyệt đối an toàn
            </p>
            <p class="ingr-empty-state-guidance">
              Không ghi nhận bất cứ cảnh báo nào.
            </p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pageData
    .map((ingr) => {
      const status = getIngredientStatus(ingr);

      let riskLabel = "";
      let urgency = "";
      let actionBtn = "";

      switch (status) {
        case "expired":
          riskLabel = "Hết hạn sử dụng";

          urgency = `
            <span style="color:var(--ingr-status-expired);font-weight:800">
              <i class="fa-solid fa-skull-crossbones"></i> HỦY GẤP
            </span>
          `;

          actionBtn = `
            <button
              class="ingr-primary-btn-action danger dispose-btn"
              data-id="${ingr.id}"
              style="padding:6px 12px;font-size:.75rem"
            >
              <i class="fa-solid fa-dumpster"></i> Tiêu hủy
            </button>
          `;
          break;

        case "critical":
          riskLabel = "Tồn kho cực thấp";

          urgency = `
            <span style="color:var(--ingr-status-danger);font-weight:800">
              <i class="fa-solid fa-angles-up"></i> KHẨN CẤP
            </span>
          `;

          actionBtn = `
            <button
              class="ingr-primary-btn-action replenish-btn"
              data-id="${ingr.id}"
              style="padding:6px 12px;font-size:.75rem"
            >
              <i class="fa-solid fa-cart-shopping"></i> Nhập hàng
            </button>
          `;
          break;

        case "warning":
          riskLabel = "Dưới định mức tối thiểu";

          urgency = `
            <span style="color:var(--ingr-status-warning);font-weight:700">
              <i class="fa-solid fa-bell"></i> TRUNG BÌNH
            </span>
          `;

          actionBtn = `
            <button
              class="ingr-primary-btn-action replenish-btn"
              data-id="${ingr.id}"
              style="padding:6px 12px;font-size:.75rem"
            >
              <i class="fa-solid fa-cart-shopping"></i> Nhập hàng
            </button>
          `;
          break;

        case "excess":
          riskLabel = "Tồn kho quá nhiều";

          urgency = `
            <span style="color:var(--ingr-status-success);font-weight:600">
              <i class="fa-solid fa-circle-info"></i> THẤP
            </span>
          `;

          actionBtn = `
            <button
              class="ingr-primary-btn-action replenish-btn"
              data-id="${ingr.id}"
              style="padding:6px 12px;font-size:.75rem"
            >
              <i class="fa-solid fa-cart-shopping"></i> Xem thêm
            </button>
          `;
          break;
      }

      return `
        <tr>
          <td>
            <strong style="color:var(--ingr-accent-amber)">
              ${ingr.code}
            </strong>
          </td>

          <td>${ingr.name}</td>

          <td>${riskLabel}</td>

          <td style="text-align:right">
            ${ingr.stock.toFixed(1)}
          </td>

          <td>${ingr.unit}</td>

          <td>${ingr.minStock} ${ingr.unit}</td>

          <td>
            ${new Date(ingr.expiry).toLocaleDateString("vi-VN")}
          </td>

          <td style="text-align:center">
            ${urgency}
          </td>

          <td style="text-align:center">
            ${actionBtn}
          </td>
        </tr>
      `;
    })
    .join("");

  bindWarningEvents();
}
function bindWarningEvents() {
  document.querySelectorAll(".replenish-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ingrId = btn.dataset.id;

      console.log("Nhập thêm:", ingrId);

      showToast(
        "Nhập hàng",
        `Chọn nguyên liệu ${ingrId} để nhập thêm`,
        "success",
      );
    });
  });

  document.querySelectorAll(".dispose-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ingrId = btn.dataset.id;

      const ingredient = ingredients.find((i) => i.id === ingrId);

      if (!ingredient) return;

      if (!confirm("Bạn muốn tiêu hủy nguyên liệu này?")) {
        return;
      }

      ingredient.stock = 0;

      refreshWarningsTable();

      showToast("Thành công", "Đã tiêu hủy nguyên liệu hết hạn", "success");
    });
  });
}
