const ingredients = [
  {
    id: 1,
    code: "ING001",
    name: "Ba chỉ bò Mỹ",
    unit: "kg",
    stock: 25.5,
    price: 285000,
  },
  {
    id: 2,
    code: "ING002",
    name: "Nạc vai bò Mỹ",
    unit: "kg",
    stock: 18,
    price: 320000,
  },
  {
    id: 3,
    code: "ING003",
    name: "Tôm sú",
    unit: "kg",
    stock: 12,
    price: 420000,
  },
  {
    id: 4,
    code: "ING004",
    name: "Mực ống",
    unit: "kg",
    stock: 9,
    price: 250000,
  },
];

const suppliers = [
  {
    id: 1,
    code: "SUP001",
    name: "Công ty Thực phẩm Minh Phát",
  },
  {
    id: 2,
    code: "SUP002",
    name: "Công ty Hải Sản Đại Dương",
  },
  {
    id: 3,
    code: "SUP003",
    name: "Công ty Rau Sạch Đà Lạt",
  },
];

// ===============================
// GOODS RECEIPT
// ===============================

let receiptRowCounter = 0;

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("ingr-receipt-items-tbody");

  if (tbody) {
    tbody.innerHTML = "";
    addReceiptItemRow();
    updateReceiptTotals();
  }

  // Button thêm dòng
  document
    .getElementById("ingr-receipt-add-item-row-btn")
    ?.addEventListener("click", addReceiptItemRow);

  // Reset form
  document
    .getElementById("ingr-receipt-reset-form-btn")
    ?.addEventListener("click", resetReceiptForm);

  // Submit
  document
    .getElementById("ingr-receipt-creation-form")
    ?.addEventListener("submit", handleReceiptSubmit);
});

function addReceiptItemRow() {
  const tbody = document.getElementById("ingr-receipt-items-tbody");
  if (!tbody) return;

  receiptRowCounter++;

  const rowId = `receipt-row-${receiptRowCounter}`;

  const ingredientList = ingredients;
  const options = ingredients
    .map(
      (item) => `
      <option
        value="${item.id}"
        data-stock="${item.stock}"
        data-unit="${item.unit}"
        data-price="${item.price}"
      >
        ${item.name} (${item.code})
      </option>
    `,
    )
    .join("");

  const tr = document.createElement("tr");

  tr.id = rowId;

  tr.innerHTML = `
        <td>
            <select class="ingr-form-dropdown-select ingredient-select" required>
                <option value="">-- Chọn nguyên liệu --</option>
                ${options}
            </select>
        </td>

        <td>
            <strong class="stock-label">-</strong>
            <span class="unit-label"></span>
        </td>

        <td>
            <input
                type="number"
                class="ingr-receipt-qty-input"
                min="0.1"
                step="any"
                placeholder="0"
                required
            >
        </td>

        <td>
            <input
                type="number"
                class="price-input ingr-receipt-qty-input"
                min="0"
                placeholder="Giá nhập"
                required
            >
        </td>

        <td>
            <strong
                class="row-total"
                data-total="0"
                style="color: var(--ingr-accent-amber)"
            >
                0 đ
            </strong>
        </td>

        <td style="text-align:center">
            <button
                type="button"
                class="ingr-receipt-delete-row-btn"
            >
                <i class="fa-solid fa-circle-minus"></i>
            </button>
        </td>
    `;

  tbody.appendChild(tr);

  bindReceiptRowEvents(tr);

  updateReceiptTotals();
}

function bindReceiptRowEvents(row) {
  const select = row.querySelector(".ingredient-select");
  const qtyInput = row.querySelector(".ingr-receipt-qty-input");
  const priceInput = row.querySelector(".price-input");
  const deleteBtn = row.querySelector(".ingr-receipt-delete-row-btn");

  select.addEventListener("change", () => {
    handleReceiptIngredientChange(row);
  });

  qtyInput.addEventListener("input", () => {
    calculateReceiptRowTotal(row);
  });

  priceInput.addEventListener("input", () => {
    calculateReceiptRowTotal(row);
  });

  deleteBtn.addEventListener("click", () => {
    deleteReceiptItemRow(row);
  });
}

function handleReceiptIngredientChange(row) {
  const select = row.querySelector(".ingredient-select");
  const option = select.options[select.selectedIndex];

  const stockLabel = row.querySelector(".stock-label");
  const unitLabel = row.querySelector(".unit-label");
  const priceInput = row.querySelector(".price-input");

  if (!select.value) {
    stockLabel.textContent = "-";
    unitLabel.textContent = "";
    priceInput.value = "";

    calculateReceiptRowTotal(row);
    return;
  }

  stockLabel.textContent = Number(option.dataset.stock).toFixed(1);

  unitLabel.textContent = option.dataset.unit || "";

  priceInput.value = option.dataset.price || 0;

  calculateReceiptRowTotal(row);
}

function calculateReceiptRowTotal(row) {
  const qty = Number(row.querySelector(".ingr-receipt-qty-input").value) || 0;

  const price = Number(row.querySelector(".price-input").value) || 0;

  const total = qty * price;

  const totalCell = row.querySelector(".row-total");

  totalCell.dataset.total = total;

  totalCell.textContent = total.toLocaleString("vi-VN") + " đ";

  updateReceiptTotals();
}

function deleteReceiptItemRow(row) {
  const tbody = document.getElementById("ingr-receipt-items-tbody");

  if (tbody.children.length <= 1) {
    window.showToast(
      "Cảnh báo",
      "Phiếu nhập phải có ít nhất 1 dòng nguyên liệu.",
      "warning",
    );
    return;
  }

  row.remove();

  updateReceiptTotals();
}

function updateReceiptTotals() {
  const rows = document.querySelectorAll("#ingr-receipt-items-tbody tr");

  let itemCount = 0;
  let grandTotal = 0;

  rows.forEach((row) => {
    const select = row.querySelector(".ingredient-select");

    const total = Number(row.querySelector(".row-total")?.dataset.total) || 0;

    if (select.value) {
      itemCount++;
    }

    grandTotal += total;
  });

  document.getElementById("ingr-receipt-summary-item-count").textContent =
    itemCount;

  document.getElementById("ingr-receipt-summary-grand-total").textContent =
    grandTotal.toLocaleString("vi-VN") + " đ";
}

function resetReceiptForm() {
  document.getElementById("ingr-receipt-creation-form")?.reset();

  const tbody = document.getElementById("ingr-receipt-items-tbody");

  tbody.innerHTML = "";

  receiptRowCounter = 0;

  addReceiptItemRow();

  updateReceiptTotals();
}

function handleReceiptSubmit(e) {
  e.preventDefault();

  const rows = document.querySelectorAll("#ingr-receipt-items-tbody tr");

  const items = [];

  rows.forEach((row) => {
    const ingredientId = row.querySelector(".ingredient-select").value;

    const quantity = Number(row.querySelector(".ingr-receipt-qty-input").value);

    const price = Number(row.querySelector(".price-input").value);

    if (ingredientId && quantity > 0) {
      items.push({
        ingredientId,
        quantity,
        price,
      });
    }
  });

  if (!items.length) {
    window.showToast("Lỗi", "Vui lòng chọn ít nhất một nguyên liệu.", "error");
    return;
  }

  console.log(items);

  window.showToast("Thành công", "Đã tạo phiếu nhập kho.", "success");
}
function loadSuppliers() {
  const supplierSelect = document.getElementById("ingr-receipt-supplier");

  supplierSelect.innerHTML = `
      <option value="">-- Chọn nhà cung cấp --</option>
  `;

  suppliers.forEach((supplier) => {
    supplierSelect.innerHTML += `
      <option value="${supplier.id}">
        ${supplier.name} (${supplier.code})
      </option>
    `;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  loadSuppliers();

  const tbody = document.getElementById("ingr-receipt-items-tbody");

  if (tbody) {
    tbody.innerHTML = "";
    addReceiptItemRow();
    updateReceiptTotals();
  }
});
