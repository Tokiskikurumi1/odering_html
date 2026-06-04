// ===============================
// GOODS ISSUE
// ===============================

let issueRowCounter = 0;

const ingredients = [
  {
    id: 1,
    code: "ING001",
    name: "Ba chỉ bò Mỹ",
    unit: "kg",
    stock: 25.5,
  },
  {
    id: 2,
    code: "ING002",
    name: "Nạc vai bò Mỹ",
    unit: "kg",
    stock: 18,
  },
  {
    id: 3,
    code: "ING003",
    name: "Tôm sú",
    unit: "kg",
    stock: 12,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  renderGoodsIssue();

  document
    .getElementById("ingr-issue-add-item-row-btn")
    ?.addEventListener("click", addIssueItemRow);

  document
    .getElementById("ingr-issue-reset-btn")
    ?.addEventListener("click", resetIssueForm);

  document
    .getElementById("ingr-issue-creation-form")
    ?.addEventListener("submit", handleIssueSubmit);
});

function renderGoodsIssue() {
  const tbody = document.getElementById("ingr-issue-items-tbody");

  if (tbody) {
    tbody.innerHTML = "";
  }

  issueRowCounter = 0;

  addIssueItemRow();
}

function addIssueItemRow() {
  const tbody = document.getElementById("ingr-issue-items-tbody");

  if (!tbody) return;

  issueRowCounter++;

  const rowId = `ingr-issue-row-${issueRowCounter}`;

  const optionsHtml = ingredients
    .map(
      (i) => `
        <option
          value="${i.id}"
          data-stock="${i.stock}"
          data-unit="${i.unit}"
        >
          ${i.name} (${i.code})
        </option>
      `,
    )
    .join("");

  const tr = document.createElement("tr");

  tr.id = rowId;

  tr.innerHTML = `
        <td>
            <select class="ingr-form-dropdown-select" required>
                <option value="">-- Chọn nguyên liệu --</option>
                ${optionsHtml}
            </select>
        </td>

        <td>
            <strong id="${rowId}-stock" class="ingr-issue-stock-indicator">-</strong>
            <span id="${rowId}-unit-lbl"></span>
        </td>

        <td>
            <input
                type="number"
                class="ingr-receipt-qty-input"
                placeholder="0"
                min="0.1"
                step="any"
                required
            >
        </td>

        <td>
            <span
                id="${rowId}-unit-lbl2"
                style="font-weight:600;color:var(--ingr-text-muted)"
            >
                -
            </span>
        </td>

        <td style="text-align:center">
            <button
                type="button"
                class="ingr-receipt-delete-row-btn"
                title="Xóa dòng"
            >
                <i class="fa-solid fa-circle-minus"></i>
            </button>
        </td>
    `;

  tbody.appendChild(tr);

  bindIssueRowEvents(tr);
}

function bindIssueRowEvents(row) {
  const select = row.querySelector("select");
  const input = row.querySelector("input[type='number']");
  const deleteBtn = row.querySelector(".ingr-receipt-delete-row-btn");

  select.addEventListener("change", () => {
    handleIssueIngredientChange(row);
  });

  input.addEventListener("input", () => {
    validateIssueQuantity(row);
  });

  deleteBtn.addEventListener("click", () => {
    deleteIssueItemRow(row);
  });
}

function handleIssueIngredientChange(row) {
  const select = row.querySelector("select");
  const option = select.options[select.selectedIndex];

  const stockIndicator = row.querySelector(".ingr-issue-stock-indicator");

  const unitLabel = row.querySelector(`[id$="-unit-lbl"]`);

  const unitLabel2 = row.querySelector(`[id$="-unit-lbl2"]`);

  if (select.value) {
    const stock = Number(option.dataset.stock);
    const unit = option.dataset.unit;

    stockIndicator.textContent = stock.toFixed(1);
    unitLabel.textContent = unit;
    unitLabel2.textContent = unit;
  } else {
    stockIndicator.textContent = "-";
    unitLabel.textContent = "";
    unitLabel2.textContent = "-";
  }

  validateIssueQuantity(row);
}

function validateIssueQuantity(row) {
  const select = row.querySelector("select");
  const input = row.querySelector("input[type='number']");

  const qty = Number(input.value) || 0;

  if (!select.value) return;

  const option = select.options[select.selectedIndex];
  const stock = Number(option.dataset.stock);

  if (qty > stock) {
    input.style.borderColor = "var(--ingr-status-danger)";
    input.setCustomValidity("Số lượng xuất vượt quá tồn kho khả dụng!");
  } else {
    input.style.borderColor = "";
    input.setCustomValidity("");
  }
}

function deleteIssueItemRow(row) {
  const tbody = document.getElementById("ingr-issue-items-tbody");

  if (tbody.children.length <= 1) {
    showToast(
      "Cảnh báo form",
      "Phiếu xuất kho phải chứa tối thiểu một dòng nguyên liệu.",
      "warning",
    );
    return;
  }

  row.remove();
}

function resetIssueForm() {
  document.getElementById("ingr-issue-creation-form")?.reset();

  renderGoodsIssue();
}

function handleIssueSubmit(e) {
  e.preventDefault();

  const rows = document.querySelectorAll("#ingr-issue-items-tbody tr");

  const items = [];

  rows.forEach((row) => {
    const ingredientId = row.querySelector("select").value;

    const quantity =
      Number(row.querySelector("input[type='number']").value) || 0;

    if (ingredientId && quantity > 0) {
      items.push({
        ingredientId,
        quantity,
      });
    }
  });

  if (!items.length) {
    showToast("Lỗi", "Vui lòng chọn ít nhất một nguyên liệu.", "error");
    return;
  }

  showToast("Thành công", "Đã tạo phiếu xuất kho.", "success");

  // Reset form sau khi xuất kho thành công
  resetIssueForm();
}
