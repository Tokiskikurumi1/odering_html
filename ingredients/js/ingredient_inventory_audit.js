const ingredients = [
  {
    id: 1,
    code: "ING001",
    name: "Ba chỉ bò Mỹ",
    stock: 25.5,
    unit: "kg",
  },
  {
    id: 2,
    code: "ING002",
    name: "Nạc vai bò Mỹ",
    stock: 18,
    unit: "kg",
  },
  {
    id: 3,
    code: "ING003",
    name: "Tôm sú",
    stock: 12,
    unit: "kg",
  },
  {
    id: 4,
    code: "ING004",
    name: "Mực ống",
    stock: 9,
    unit: "kg",
  },
  {
    id: 5,
    code: "ING005",
    name: "Kim chi",
    stock: 20,
    unit: "kg",
  },
  {
    id: 6,
    code: "ING001",
    name: "Ba chỉ bò Mỹ",
    stock: 25.5,
    unit: "kg",
  },
  {
    id: 7,
    code: "ING002",
    name: "Nạc vai bò Mỹ",
    stock: 18,
    unit: "kg",
  },
  {
    id: 8,
    code: "ING003",
    name: "Tôm sú",
    stock: 12,
    unit: "kg",
  },
  {
    id: 9,
    code: "ING004",
    name: "Mực ống",
    stock: 9,
    unit: "kg",
  },
  {
    id: 10,
    code: "ING005",
    name: "Kim chi",
    stock: 20,
    unit: "kg",
  },
  {
    id: 1,
    code: "ING001",
    name: "Ba chỉ bò Mỹ",
    stock: 25.5,
    unit: "kg",
  },
  {
    id: 2,
    code: "ING002",
    name: "Nạc vai bò Mỹ",
    stock: 18,
    unit: "kg",
  },
  {
    id: 3,
    code: "ING003",
    name: "Tôm sú",
    stock: 12,
    unit: "kg",
  },
  {
    id: 4,
    code: "ING004",
    name: "Mực ống",
    stock: 9,
    unit: "kg",
  },
  {
    id: 5,
    code: "ING005",
    name: "Kim chi",
    stock: 20,
    unit: "kg",
  },
  {
    id: 6,
    code: "ING001",
    name: "Ba chỉ bò Mỹ",
    stock: 25.5,
    unit: "kg",
  },
  {
    id: 7,
    code: "ING002",
    name: "Nạc vai bò Mỹ",
    stock: 18,
    unit: "kg",
  },
  {
    id: 8,
    code: "ING003",
    name: "Tôm sú",
    stock: 12,
    unit: "kg",
  },
  {
    id: 9,
    code: "ING004",
    name: "Mực ống",
    stock: 9,
    unit: "kg",
  },
];
// State management
let auditPagination;
window.initPage = function () {
  refreshAuditTable();
};
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("ingr-btn-audit-load-all")
    ?.addEventListener("click", loadAllIngredients);

  document
    .getElementById("ingr-btn-save-audit")
    ?.addEventListener("click", saveAudit);
});

function refreshAuditTable() {
  if (!auditPagination) {
    auditPagination = new Pagination({
      data: ingredients,
      itemsPerPage: 10,
      infoElementId: "ingr-ingredients-page-info",
      controlsElementId: "ingr-ingredients-page-controls",
      onRender: renderAudit,
    });
    auditPagination.render();
  } else {
    auditPagination.setData(ingredients);
  }
}

function renderAudit(pageData) {
  const tbody = document.getElementById("ingr-audit-table-body");

  if (!tbody) return;

  if (!pageData || pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="ingr-empty-state-card-wrapper">
            <i class="fa-solid fa-clipboard-question ingr-empty-state-illustrated-icon"></i>
            <p class="ingr-empty-state-headline">
              Chưa có nguyên liệu để kiểm kê
            </p>
            <p class="ingr-empty-state-guidance">
              Vui lòng khởi tạo các nguyên liệu trong hệ thống trước.
            </p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pageData
    .map(
      (ingr) => `
      <tr id="ingr-audit-row-${ingr.id}">
        <td>
          <strong style="color: var(--ingr-accent-amber); font-weight:700;">
            ${ingr.code}
          </strong>
        </td>

        <td>
          <span style="font-weight:600;color:#fff;">
            ${ingr.name}
          </span>
        </td>

        <td
          style="text-align:right;font-weight:600;"
          id="ingr-audit-sys-${ingr.id}"
          data-stock="${ingr.stock}"
        >
          ${ingr.stock.toFixed(1)} ${ingr.unit}
        </td>

        <td style="text-align:center;">
          <div
            style="
              display:flex;
              align-items:center;
              justify-content:center;
              gap:8px;
            "
          >
            <input
              type="number"
              class="ingr-audit-qty-input"
              placeholder="Nhập thực tế"
              min="0"
              step="any"
              data-id="${ingr.id}"
            >

            <span
              style="
                font-weight:600;
                color:var(--ingr-text-muted);
                width:25px;
                text-align:left;
              "
            >
              ${ingr.unit}
            </span>
          </div>
        </td>

        <td style="text-align:right;">
          <span
            id="ingr-audit-diff-${ingr.id}"
            class="ingr-audit-discrepancy-text neutral"
          >
            0.0
          </span>
        </td>

        <td style="text-align:center;">
          <span
            id="ingr-audit-badge-${ingr.id}"
            class="ingr-ingredient-status-badge good"
          >
            <i class="fa-solid fa-circle-check"></i>
            Khớp
          </span>
        </td>

        <td>
          <input
            type="text"
            class="ingr-form-text-input"
            placeholder="Lý do chênh lệch (nếu có)..."
            style="padding:6px 12px;font-size:0.8rem;"
          >
        </td>
      </tr>
    `,
    )
    .join("");

  bindAuditEvents();
}
function bindAuditEvents() {
  document.querySelectorAll(".ingr-audit-qty-input").forEach((input) => {
    input.addEventListener("input", function () {
      const id = this.dataset.id;

      const ingredient = ingredients.find((x) => x.id == id);

      calculateAuditDiscrepancy(id, ingredient.stock);
    });
  });
}

function calculateAuditDiscrepancy(ingrId, sysStock) {
  const row = document.getElementById(`ingr-audit-row-${ingrId}`);

  if (!row) return;

  const input = row.querySelector(".ingr-audit-qty-input");

  const diffSpan = document.getElementById(`ingr-audit-diff-${ingrId}`);

  const badge = document.getElementById(`ingr-audit-badge-${ingrId}`);

  if (input.value === "") {
    diffSpan.textContent = "0.0";
    diffSpan.className = "ingr-audit-discrepancy-text neutral";

    badge.className = "ingr-ingredient-status-badge good";

    badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Khớp';

    return;
  }

  const realStock = parseFloat(input.value) || 0;

  const diff = Math.round((realStock - sysStock) * 100) / 100;

  diffSpan.textContent = (diff > 0 ? "+" : "") + diff.toFixed(1);

  if (diff === 0) {
    diffSpan.className = "ingr-audit-discrepancy-text neutral";

    badge.className = "ingr-ingredient-status-badge good";

    badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Khớp';
  } else if (diff > 0) {
    diffSpan.className = "ingr-audit-discrepancy-text positive";

    badge.className = "ingr-ingredient-status-badge warning";

    badge.innerHTML =
      '<i class="fa-solid fa-circle-exclamation"></i> Thừa / Dư';
  } else {
    diffSpan.className = "ingr-audit-discrepancy-text negative";

    badge.className = "ingr-ingredient-status-badge critical";

    badge.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> Thiếu hụt';
  }
}
function loadAllIngredients() {
  ingredients.forEach((ingr) => {
    const row = document.getElementById(`ingr-audit-row-${ingr.id}`);

    if (!row) return;

    const input = row.querySelector(".ingr-audit-qty-input");

    input.value = ingr.stock.toFixed(1);

    calculateAuditDiscrepancy(ingr.id, ingr.stock);
  });

  showToast(
    "Kiểm kê kho",
    "Đã đồng bộ nhanh toàn bộ tồn hệ thống sang cột thực tế.",
    "success",
  );
}
async function saveAudit() {
  const rows = document.querySelectorAll("#ingr-audit-table-body tr");

  let hasChanges = false;

  const auditData = [];

  rows.forEach((tr) => {
    const ingrId = tr.id.replace("ingr-audit-row-", "");

    const qtyInput = tr.querySelector(".ingr-audit-qty-input");

    const reasonInput = tr.querySelector("input[type='text']");

    if (qtyInput.value === "") return;

    const ingredient = ingredients.find((x) => x.id == ingrId);

    const realStock = parseFloat(qtyInput.value) || 0;

    const discrepancy = realStock - ingredient.stock;

    if (discrepancy !== 0) {
      hasChanges = true;

      auditData.push({
        ingredientId: ingrId,
        systemStock: ingredient.stock,
        realStock,
        discrepancy,
        reason: reasonInput.value || "Không có ghi chú",
      });
    }
  });

  if (!hasChanges) {
    showToast("Cảnh báo kiểm kê", "Không phát hiện thay đổi.", "warning");
    return;
  }

  console.log(auditData);

  showToast("Kiểm kê thành công", "Đã ghi nhận dữ liệu kiểm kê.", "success");
}
