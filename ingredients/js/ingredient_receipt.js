// Clear existing input table
const tbody = document.getElementById("ingr-receipt-items-tbody");
if (tbody) tbody.innerHTML = "";

receiptRowCounter = 0;
addReceiptItemRow(); // Prepopulate first row
updateReceiptTotals();

window.addReceiptItemRow = function () {
  const tbody = document.getElementById("ingr-receipt-items-tbody");
  if (!tbody) return;

  receiptRowCounter++;
  const rowId = `ingr-receipt-row-${receiptRowCounter}`;
  const tr = document.createElement("tr");
  tr.id = rowId;

  // Create ingredient options
  const optionsHtml = window.ingredientState.ingredients
    .map(
      (i) =>
        `<option value="${i.id}" data-stock="${i.stock}" data-unit="${i.unit}" data-price="${i.price}">${i.name} (${i.code})</option>`,
    )
    .join("");

  tr.innerHTML = `
            <td>
                <select class="ingr-form-dropdown-select" onchange="window.handleReceiptIngredientChange('${rowId}', this)" required>
                    <option value="">-- Chọn nguyên liệu --</option>
                    ${optionsHtml}
                </select>
            </td>
            <td><strong id="${rowId}-stock" class="ingr-receipt-stock-indicator">-</strong> <span id="${rowId}-unit-lbl"></span></td>
            <td>
                <input type="number" class="ingr-receipt-qty-input" placeholder="0" min="0.1" step="any" oninput="window.calculateReceiptRowTotal('${rowId}')" required>
            </td>
            <td>
                <input type="number" class="ingr-receipt-qty-input" placeholder="Giá nhập" min="0" oninput="window.calculateReceiptRowTotal('${rowId}')" required>
            </td>
            <td><strong id="${rowId}-total" style="color: var(--ingr-accent-amber);">0 đ</strong></td>
            <td style="text-align: center;">
                <button type="button" class="ingr-receipt-delete-row-btn" onclick="window.deleteReceiptItemRow('${rowId}')" title="Xóa dòng"><i class="fa-solid fa-circle-minus"></i></button>
            </td>
        `;

  tbody.appendChild(tr);
  updateReceiptTotals();
};

window.handleReceiptIngredientChange = function (rowId, selectElem) {
  const option = selectElem.options[selectElem.selectedIndex];
  const stockIndicator = document.getElementById(`${rowId}-stock`);
  const unitLabel = document.getElementById(`${rowId}-unit-lbl`);
  const qtyInputs = document.querySelectorAll(`#${rowId} input`);

  if (selectElem.value) {
    const stock = parseFloat(option.getAttribute("data-stock"));
    const unit = option.getAttribute("data-unit");
    const defaultPrice = option.getAttribute("data-price");

    stockIndicator.textContent = stock.toFixed(1);
    unitLabel.textContent = unit;
    qtyInputs[1].value = defaultPrice; // Autofill historical pricing
  } else {
    stockIndicator.textContent = "-";
    unitLabel.textContent = "";
    qtyInputs[1].value = "";
  }
  window.calculateReceiptRowTotal(rowId);
};

window.calculateReceiptRowTotal = function (rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;

  const inputs = row.querySelectorAll("input");
  const qty = parseFloat(inputs[0].value) || 0;
  const price = parseFloat(inputs[1].value) || 0;

  const totalCell = document.getElementById(`${rowId}-total`);
  const total = qty * price;
  totalCell.textContent = total.toLocaleString("vi-VN") + " đ";
  totalCell.setAttribute("data-raw-value", total);

  updateReceiptTotals();
};

window.deleteReceiptItemRow = function (rowId) {
  const tbody = document.getElementById("ingr-receipt-items-tbody");
  if (tbody.children.length <= 1) {
    window.showToast(
      "Cảnh báo form",
      "Phiếu nhập kho phải chứa tối thiểu một nguyên liệu.",
      "warning",
    );
    return;
  }
  const row = document.getElementById(rowId);
  if (row) row.remove();
  updateReceiptTotals();
};

function updateReceiptTotals() {
  const tbody = document.getElementById("ingr-receipt-items-tbody");
  if (!tbody) return;

  let itemsCount = 0;
  let grandTotal = 0;

  tbody.querySelectorAll("tr").forEach((tr) => {
    const select = tr.querySelector("select");
    if (select && select.value) {
      const totalCell = document.getElementById(`${tr.id}-total`);
      const rawVal = parseFloat(totalCell.getAttribute("data-raw-value")) || 0;
      if (rawVal > 0) {
        itemsCount++;
        grandTotal += rawVal;
      }
    }
  });

  document.getElementById("ingr-receipt-summary-item-count").textContent =
    itemsCount;
  document.getElementById("ingr-receipt-summary-grand-total").textContent =
    grandTotal.toLocaleString("vi-VN") + " đ";
}

// 5. RENDER GOODS ISSUE FORM
let issueRowCounter = 0;
function renderGoodsIssue() {
  const tbody = document.getElementById("ingr-issue-items-tbody");
  if (tbody) tbody.innerHTML = "";

  issueRowCounter = 0;
  addIssueItemRow(); // Prepopulate first row
}

window.addIssueItemRow = function () {
  const tbody = document.getElementById("ingr-issue-items-tbody");
  if (!tbody) return;

  issueRowCounter++;
  const rowId = `ingr-issue-row-${issueRowCounter}`;
  const tr = document.createElement("tr");
  tr.id = rowId;

  const optionsHtml = window.ingredientState.ingredients
    .map(
      (i) =>
        `<option value="${i.id}" data-stock="${i.stock}" data-unit="${i.unit}">${i.name} (${i.code})</option>`,
    )
    .join("");

  tr.innerHTML = `
            <td>
                <select class="ingr-form-dropdown-select" onchange="window.handleIssueIngredientChange('${rowId}', this)" required>
                    <option value="">-- Chọn nguyên liệu --</option>
                    ${optionsHtml}
                </select>
            </td>
            <td><strong id="${rowId}-stock" class="ingr-issue-stock-indicator">-</strong> <span id="${rowId}-unit-lbl"></span></td>
            <td>
                <input type="number" class="ingr-receipt-qty-input" placeholder="0" min="0.1" step="any" oninput="window.validateIssueQuantity('${rowId}')" required>
            </td>
            <td><span id="${rowId}-unit-lbl2" style="font-weight: 600; color: var(--ingr-text-muted);">-</span></td>
            <td style="text-align: center;">
                <button type="button" class="ingr-receipt-delete-row-btn" onclick="window.deleteIssueItemRow('${rowId}')" title="Xóa dòng"><i class="fa-solid fa-circle-minus"></i></button>
            </td>
        `;

  tbody.appendChild(tr);
};

window.handleIssueIngredientChange = function (rowId, selectElem) {
  const option = selectElem.options[selectElem.selectedIndex];
  const stockIndicator = document.getElementById(`${rowId}-stock`);
  const unitLabel = document.getElementById(`${rowId}-unit-lbl`);
  const unitLabel2 = document.getElementById(`${rowId}-unit-lbl2`);

  if (selectElem.value) {
    const stock = parseFloat(option.getAttribute("data-stock"));
    const unit = option.getAttribute("data-unit");

    stockIndicator.textContent = stock.toFixed(1);
    unitLabel.textContent = unit;
    unitLabel2.textContent = unit;
  } else {
    stockIndicator.textContent = "-";
    unitLabel.textContent = "";
    unitLabel2.textContent = "-";
  }
  window.validateIssueQuantity(rowId);
};

window.validateIssueQuantity = function (rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;

  const select = row.querySelector("select");
  const input = row.querySelector("input[type='number']");
  const qty = parseFloat(input.value) || 0;

  if (select.value) {
    const option = select.options[select.selectedIndex];
    const stock = parseFloat(option.getAttribute("data-stock"));

    if (qty > stock) {
      input.style.borderColor = "var(--ingr-status-danger)";
      input.setCustomValidity("Số lượng xuất vượt quá tồn kho khả dụng!");
    } else {
      input.style.borderColor = "";
      input.setCustomValidity("");
    }
  }
};

window.deleteIssueItemRow = function (rowId) {
  const tbody = document.getElementById("ingr-issue-items-tbody");
  if (tbody.children.length <= 1) {
    window.showToast(
      "Cảnh báo form",
      "Phiếu xuất kho phải chứa tối thiểu một dòng nguyên liệu.",
      "warning",
    );
    return;
  }
  const row = document.getElementById(rowId);
  if (row) row.remove();
};

// 6. RENDER INVENTORY AUDIT SHEET
function renderAudit() {
  const tbody = document.getElementById("ingr-audit-table-body");
  if (!tbody) return;

  if (window.ingredientState.ingredients.length === 0) {
    tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="ingr-empty-state-card-wrapper">
                            <i class="fa-solid fa-clipboard-question ingr-empty-state-illustrated-icon"></i>
                            <p class="ingr-empty-state-headline">Chưa có nguyên liệu để kiểm kê</p>
                            <p class="ingr-empty-state-guidance">Vui lòng khởi tạo các nguyên liệu trong hệ thống trước.</p>
                        </div>
                    </td>
                </tr>
            `;
    return;
  }

  tbody.innerHTML = window.ingredientState.ingredients
    .map((ingr) => {
      return `
                <tr id="ingr-audit-row-${ingr.id}">
                    <td><strong style="color: var(--ingr-accent-amber); font-weight: 700;">${ingr.code}</strong></td>
                    <td><span style="font-weight: 600; color: #fff;">${ingr.name}</span></td>
                    <td style="text-align: right; font-weight: 600;" id="ingr-audit-sys-${ingr.id}">${ingr.stock.toFixed(1)} ${ingr.unit}</td>
                    <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <input type="number" class="ingr-audit-qty-input" placeholder="Nhập thực tế" min="0" step="any" oninput="window.calculateAuditDiscrepancy('${ingr.id}', ${ingr.stock})" required>
                            <span style="font-weight: 600; color: var(--ingr-text-muted); width: 25px; text-align: left;">${ingr.unit}</span>
                        </div>
                    </td>
                    <td style="text-align: right;">
                        <span id="ingr-audit-diff-${ingr.id}" class="ingr-audit-discrepancy-text neutral">0.0</span>
                    </td>
                    <td style="text-align: center;">
                        <span id="ingr-audit-badge-${ingr.id}" class="ingr-ingredient-status-badge good">
                            <i class="fa-solid fa-circle-check"></i> Khớp
                        </span>
                    </td>
                    <td>
                        <input type="text" class="ingr-form-text-input" placeholder="Lý do chênh lệch (nếu có)..." style="padding: 6px 12px; font-size: 0.8rem;">
                    </td>
                </tr>
            `;
    })
    .join("");
}

window.calculateAuditDiscrepancy = function (ingrId, sysStock) {
  const row = document.getElementById(`ingr-audit-row-${ingrId}`);
  if (!row) return;

  const input = row.querySelector("input[type='number']");
  const diffSpan = document.getElementById(`ingr-audit-diff-${ingrId}`);
  const badge = document.getElementById(`ingr-audit-badge-${ingrId}`);

  if (input.value === "") {
    diffSpan.textContent = "0.0";
    diffSpan.className = "ingr-audit-discrepancy-text neutral";
    badge.textContent = "Khớp";
    badge.className = "ingr-ingredient-status-badge good";
    badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Khớp`;
    return;
  }

  const realStock = parseFloat(input.value) || 0;
  const diff = realStock - sysStock;

  // Round to 2 decimal places to avoid standard JS float point quirks
  const roundedDiff = Math.round(diff * 100) / 100;

  diffSpan.textContent = (roundedDiff > 0 ? "+" : "") + roundedDiff.toFixed(1);

  if (roundedDiff === 0) {
    diffSpan.className = "ingr-audit-discrepancy-text neutral";
    badge.className = "ingr-ingredient-status-badge good";
    badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Khớp`;
  } else if (roundedDiff > 0) {
    diffSpan.className = "ingr-audit-discrepancy-text positive";
    badge.className = "ingr-ingredient-status-badge warning";
    badge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Thừa / Dư`;
  } else {
    diffSpan.className = "ingr-audit-discrepancy-text negative";
    badge.className = "ingr-ingredient-status-badge critical";
    badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Thiếu hụt`;
  }
};

// Load all ingredients dynamically helper for audit
const loadAllAuditBtn = document.getElementById("ingr-btn-audit-load-all");
if (loadAllAuditBtn) {
  loadAllAuditBtn.onclick = function () {
    window.ingredientState.ingredients.forEach((ingr) => {
      const row = document.getElementById(`ingr-audit-row-${ingr.id}`);
      if (row) {
        const input = row.querySelector("input[type='number']");
        input.value = ingr.stock.toFixed(1);
        window.calculateAuditDiscrepancy(ingr.id, ingr.stock);
      }
    });
    window.showToast(
      "Kiểm kê kho",
      "Đã đồng bộ nhanh toàn bộ tồn hệ thống sang cột thực tế.",
      "success",
    );
  };
}

// Save audit sheet
const saveAuditBtn = document.getElementById("ingr-btn-save-audit");
if (saveAuditBtn) {
  saveAuditBtn.onclick = async function () {
    const rows = document.querySelectorAll("#ingr-audit-table-body tr");
    let hasChanges = false;
    let promises = [];

    // Display loading
    saveAuditBtn.disabled = true;
    saveAuditBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang cân bằng...`;

    for (let tr of rows) {
      const ingrId = tr.id.replace("ingr-audit-row-", "");
      const input = tr.querySelector("input[type='number']");
      const reasonInput = tr.querySelector("input[type='text']");

      if (input.value !== "") {
        const sysStockVal = parseFloat(
          document.getElementById(`ingr-audit-sys-${ingrId}`).textContent,
        );
        const realStockVal = parseFloat(input.value) || 0;
        const discrepancy = realStockVal - sysStockVal;

        if (discrepancy !== 0) {
          hasChanges = true;

          // Push transaction
          promises.push(
            fetch("/api/transactions", {
              method: "POST",
              body: JSON.stringify({
                type: "AUDIT",
                details: `Cân bằng kho kiểm kê (${reasonInput.value || "Lý do hệ thống"})`,
                ingredientId: ingrId,
                qty: discrepancy,
                user: "Nguyễn Minh Nam",
              }),
            }),
          );
        }
      }
    }

    if (!hasChanges) {
      window.showToast(
        "Cảnh báo kiểm kê",
        "Không phát hiện thay đổi hoặc bạn chưa nhập bất kỳ tồn thực tế nào.",
        "warning",
      );
      saveAuditBtn.disabled = false;
      saveAuditBtn.innerHTML = `<i class="fa-solid fa-square-check"></i> Hoàn Tất & Cân Bằng Kho`;
      return;
    }

    try {
      await Promise.all(promises);
      window.showToast(
        "Kiểm kê thành công",
        "Đã cân bằng số lượng tồn kho hệ thống khớp theo số liệu kiểm đếm thực tế.",
        "success",
      );

      // Reload audit tab
      renderAudit();
      renderGlobalSidebarAlerts();
    } catch (err) {
      window.showToast(
        "Lỗi kiểm kê",
        "Có lỗi xảy ra trong quá trình cập nhật.",
        "error",
      );
    } finally {
      saveAuditBtn.disabled = false;
      saveAuditBtn.innerHTML = `<i class="fa-solid fa-square-check"></i> Hoàn Tất & Cân Bằng Kho`;
    }
  };
}

// 7. RENDER WARNINGS DOCK
let activeWarningTypeFilter = "all";
function renderWarnings() {
  const tbody = document.getElementById("ingr-warnings-table-body");
  if (!tbody) return;

  const warningIngredients = window.ingredientState.ingredients.filter(
    (ingr) => {
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
    },
  );

  if (warningIngredients.length === 0) {
    tbody.innerHTML = `
                <tr>
                    <td colspan="9">
                        <div class="ingr-empty-state-card-wrapper">
                            <i class="fa-solid fa-circle-check ingr-empty-state-illustrated-icon" style="color: var(--ingr-status-success);"></i>
                            <p class="ingr-empty-state-headline">Kho hàng tuyệt đối an toàn</p>
                            <p class="ingr-empty-state-guidance">Không ghi nhận bất cứ cảnh báo rủi ro tồn kho nào theo tiêu chí đã chọn.</p>
                        </div>
                    </td>
                </tr>
            `;
    return;
  }

  tbody.innerHTML = warningIngredients
    .map((ingr) => {
      const status = getIngredientStatus(ingr);
      let riskLabel = "";
      let riskClass = "";
      let badgeClass = "";
      let urgency = "";

      if (status === "expired") {
        riskLabel = "Hết hạn sử dụng";
        riskClass = "expired";
        badgeClass = "expired";
        urgency = `<span style="color: var(--ingr-status-expired); font-weight: 800;"><i class="fa-solid fa-skull-crossbones"></i> HỦY GẤP</span>`;
      } else if (status === "critical") {
        riskLabel = "Tồn kho cực thấp";
        riskClass = "critical";
        badgeClass = "danger";
        urgency = `<span style="color: var(--ingr-status-danger); font-weight: 800;"><i class="fa-solid fa-angles-up"></i> KHẨN CẤP</span>`;
      } else if (status === "warning") {
        riskLabel = "Dưới định mức tối thiểu";
        riskClass = "warning";
        badgeClass = "warning";
        urgency = `<span style="color: var(--ingr-status-warning); font-weight: 700;"><i class="fa-solid fa-bell"></i> TRUNG BÌNH</span>`;
      } else if (status === "excess") {
        riskLabel = "Tồn kho quá mức (Đọng vốn)";
        riskClass = "excess";
        badgeClass = "good";
        urgency = `<span style="color: var(--ingr-status-success); font-weight: 600;"><i class="fa-solid fa-circle-info"></i> THẤP</span>`;
      }

      const expiryDate = new Date(ingr.expiry).toLocaleDateString("vi-VN");

      return `
                <tr>
                    <td><strong style="color: var(--ingr-accent-amber); font-weight: 700;">${ingr.code}</strong></td>
                    <td><span style="font-weight: 600; color: #fff;">${ingr.name}</span></td>
                    <td><span style="font-weight: 600; color: var(--ingr-text-muted);">${riskLabel}</span></td>
                    <td style="text-align: right; font-weight: 700; font-size: 0.95rem;">${ingr.stock.toFixed(1)}</td>
                    <td><span style="color: var(--ingr-text-muted);">${ingr.unit}</span></td>
                    <td style="font-weight: 500;">${ingr.minStock} ${ingr.unit}</td>
                    <td><span style="font-weight: 500; color: ${status === "expired" ? "var(--ingr-status-danger)" : "inherit"};">${expiryDate}</span></td>
                    <td style="text-align: center;">${urgency}</td>
                    <td style="text-align: center;">
                        ${
                          status === "expired"
                            ? `<button class="ingr-primary-btn-action danger" style="padding: 6px 12px; font-size: 0.75rem;" onclick="window.quickDisposeExpired('${ingr.id}', ${ingr.stock})"><i class="fa-solid fa-dumpster"></i> Tiêu hủy</button>`
                            : `<button class="ingr-primary-btn-action" style="padding: 6px 12px; font-size: 0.75rem;" onclick="window.quickOrderReplenish('${ingr.id}')"><i class="fa-solid fa-cart-shopping"></i> Nhập hàng</button>`
                        }
                    </td>
                </tr>
            `;
    })
    .join("");
}

// Quick handlers inside warnings
window.quickOrderReplenish = function (ingrId) {
  // Redirect to goods receipt tab
  const tabBtn = document.querySelector(`[data-tab="goods-receipt"]`);
  if (tabBtn) {
    tabBtn.click();
    // Prepopulate goods receipt Row
    setTimeout(() => {
      const row = document.querySelector(
        "#ingr-receipt-items-tbody tr:last-child select",
      );
      if (row) {
        row.value = ingrId;
        window.handleReceiptIngredientChange(row.closest("tr").id, row);
      }
    }, 100);
  }
};
