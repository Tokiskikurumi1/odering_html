// ==========================================
// GOODS RECEIPT NOTES MANAGEMENT
// ==========================================

const suppliers = [
  {
    id: 1,
    code: "SUP001",
    name: "Công ty Thực phẩm Minh Phát",
    phone: "0901 234 567",
    email: "contact@minhphatfood.vn",
    address: "Đường số 7, KCN Vĩnh Lộc, Bình Tân, TP.HCM"
  },
  {
    id: 2,
    code: "SUP002",
    name: "Công ty Hải Sản Đại Dương",
    phone: "0918 765 432",
    email: "sales@daiduongseafood.com",
    address: "128 Cảng Trần Đề, Sóc Trăng"
  },
  {
    id: 3,
    code: "SUP003",
    name: "Công ty Rau Sạch Đà Lạt",
    phone: "0989 333 444",
    email: "info@dalatcleanveg.vn",
    address: "Thôn Đa Quý, Xuân Thọ, TP. Đà Lạt"
  }
];

const mockReceiptNotes = [
  {
    id: "GR-20260601-001",
    timestamp: "2026-06-01T09:15:00",
    supplierId: 1,
    items: [
      { code: "ING001", name: "Ba chỉ bò Mỹ", unit: "kg", quantity: 50.0, price: 285000 },
      { code: "ING002", name: "Nạc vai bò Mỹ", unit: "kg", quantity: 30.0, price: 320000 }
    ],
    createdBy: "Nguyễn Minh Nam",
    status: "COMPLETED",
    invoiceDoc: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80",
    vatPercent: 8,
    notes: "Nhập hàng thịt bò nhập khẩu phục vụ cho tuần lễ Buffet."
  },
  {
    id: "GR-20260602-001",
    timestamp: "2026-06-02T10:30:00",
    supplierId: 3,
    items: [
      { code: "ING005", name: "Xà lách thủy canh", unit: "kg", quantity: 15.5, price: 45000 },
      { code: "ING006", name: "Cà chua bi", unit: "kg", quantity: 10.0, price: 35000 },
      { code: "ING007", name: "Nấm đùi gà", unit: "kg", quantity: 12.0, price: 85000 }
    ],
    createdBy: "Trần Văn Hải",
    status: "COMPLETED",
    invoiceDoc: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80",
    vatPercent: 8,
    notes: "Nhà cung cấp giao rau củ tươi ngon, đúng hẹn ca sáng."
  },
  {
    id: "GR-20260603-001",
    timestamp: "2026-06-03T15:45:00",
    supplierId: 2,
    items: [
      { code: "ING003", name: "Tôm sú tươi", unit: "kg", quantity: 20.0, price: 420000 },
      { code: "ING004", name: "Mực ống", unit: "kg", quantity: 15.0, price: 250000 }
    ],
    createdBy: "Nguyễn Minh Nam",
    status: "COMPLETED",
    invoiceDoc: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=400&q=80",
    vatPercent: 10,
    notes: "Hải sản bảo quản thùng xốp đông đá tốt, tươi sống."
  },
  {
    id: "GR-20260604-001",
    timestamp: "2026-06-04T08:00:00",
    supplierId: 1,
    items: [
      { code: "ING001", name: "Ba chỉ bò Mỹ", unit: "kg", quantity: 40.0, price: 285000 }
    ],
    createdBy: "Trần Văn Hải",
    status: "COMPLETED",
    invoiceDoc: "",
    vatPercent: 8,
    notes: "Nhập bổ sung khẩn cấp do lượng khách tăng đột biến."
  },
  {
    id: "GR-20260605-001",
    timestamp: "2026-06-05T11:20:00",
    supplierId: 3,
    items: [
      { code: "ING008", name: "Ớt chuông Đà Lạt", unit: "kg", quantity: 8.0, price: 65000 },
      { code: "ING009", name: "Khoai tây", unit: "kg", quantity: 25.0, price: 28000 }
    ],
    createdBy: "Nguyễn Minh Nam",
    status: "COMPLETED",
    invoiceDoc: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80",
    vatPercent: 8,
    notes: "Nhập kho củ quả định kỳ."
  },
  {
    id: "GR-20260606-001",
    timestamp: "2026-06-06T14:10:00",
    supplierId: 2,
    items: [
      { code: "ING003", name: "Tôm sú tươi", unit: "kg", quantity: 15.0, price: 420000 }
    ],
    createdBy: "Trần Văn Hải",
    status: "COMPLETED",
    invoiceDoc: "",
    vatPercent: 10,
    notes: "Hàng hải sản chiều."
  }
];

// State management
let receiptPagination;
let filteredNotes = [...mockReceiptNotes];
let selectedNote = null;

document.addEventListener("DOMContentLoaded", () => {
  // Populate Supplier filter options
  populateSupplierFilter();

  // Initial render
  refreshReceiptTable();

  // Listeners for filters
  document.getElementById("ingr-receipt-search")?.addEventListener("input", handleFiltersChange);
  document.getElementById("ingr-receipt-date-start")?.addEventListener("change", handleFiltersChange);
  document.getElementById("ingr-receipt-date-end")?.addEventListener("change", handleFiltersChange);
  document.getElementById("ingr-receipt-supplier-filter")?.addEventListener("change", handleFiltersChange);

  // Reset filter button
  document.getElementById("ingr-receipt-filter-reset")?.addEventListener("click", resetFilters);

  // Modal events
  document.getElementById("ingr-receipt-detail-close")?.addEventListener("click", closeDetailModal);
  document.getElementById("ingr-receipt-detail-close-btn")?.addEventListener("click", closeDetailModal);
  document.getElementById("ingr-receipt-print-btn")?.addEventListener("click", printReceiptNote);
  document.getElementById("ingr-receipt-pdf-btn")?.addEventListener("click", exportPDFReceiptNote);

  // Image preview zoom close
  document.getElementById("ingr-image-preview-close")?.addEventListener("click", closeImageZoom);
  document.getElementById("ingr-image-preview-zoom-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "ingr-image-preview-zoom-modal") {
      closeImageZoom();
    }
  });
});

function populateSupplierFilter() {
  const filterSelect = document.getElementById("ingr-receipt-supplier-filter");
  if (!filterSelect) return;

  suppliers.forEach(supplier => {
    const opt = document.createElement("option");
    opt.value = supplier.id;
    opt.textContent = supplier.name;
    filterSelect.appendChild(opt);
  });
}

function handleFiltersChange() {
  const query = document.getElementById("ingr-receipt-search").value.toLowerCase().trim();
  const dateStart = document.getElementById("ingr-receipt-date-start").value;
  const dateEnd = document.getElementById("ingr-receipt-date-end").value;
  const supplierId = document.getElementById("ingr-receipt-supplier-filter").value;

  filteredNotes = mockReceiptNotes.filter(note => {
    const supplier = suppliers.find(s => s.id === note.supplierId);
    const supplierName = supplier ? supplier.name.toLowerCase() : "";
    const noteId = note.id.toLowerCase();
    
    // Check search query
    const matchesQuery = !query || noteId.includes(query) || supplierName.includes(query);

    // Check dates
    const txDate = new Date(note.timestamp);
    const matchesStart = !dateStart || txDate >= new Date(dateStart + "T00:00:00");
    const matchesEnd = !dateEnd || txDate <= new Date(dateEnd + "T23:59:59");

    // Check supplier dropdown
    const matchesSupplier = supplierId === "all" || note.supplierId == supplierId;

    return matchesQuery && matchesStart && matchesEnd && matchesSupplier;
  });

  refreshReceiptTable();
}

function resetFilters() {
  document.getElementById("ingr-receipt-search").value = "";
  document.getElementById("ingr-receipt-date-start").value = "";
  document.getElementById("ingr-receipt-date-end").value = "";
  document.getElementById("ingr-receipt-supplier-filter").value = "all";

  filteredNotes = [...mockReceiptNotes];
  refreshReceiptTable();

  if (typeof showToast === "function") {
    showToast("Bộ lọc", "Đã thiết lập lại các bộ lọc về mặc định", "info");
  }
}

function refreshReceiptTable() {
  if (!receiptPagination) {
    receiptPagination = new Pagination({
      data: filteredNotes,
      itemsPerPage: 5,
      infoElementId: "ingr-ingredients-page-info",
      controlsElementId: "ingr-ingredients-page-controls",
      onRender: renderReceiptNotes,
    });
    receiptPagination.render();
  } else {
    receiptPagination.setData(filteredNotes);
  }
}

function renderReceiptNotes(pageData) {
  const tbody = document.getElementById("ingr-receipt-notes-tbody");
  if (!tbody) return;

  if (!pageData || pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="ingr-empty-state-card-wrapper" style="text-align: center; padding: 40px;">
            <i class="fa-solid fa-receipt" style="font-size: 2.5rem; color: var(--ingr-text-disabled); margin-bottom: 15px;"></i>
            <p class="ingr-empty-state-headline" style="font-weight: 700; color: var(--ingr-text-bright); margin: 0 0 5px 0;">Không tìm thấy phiếu nhập nào</p>
            <p class="ingr-empty-state-guidance" style="color: var(--ingr-text-muted); font-size: 0.85rem; margin: 0;">Không có dữ liệu phù hợp với điều kiện lọc.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pageData.map(note => {
    const supplier = suppliers.find(s => s.id === note.supplierId);
    const supplierName = supplier ? supplier.name : "N/A";
    
    // Calculations
    const itemsCount = note.items.length;
    const subtotal = note.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const vatAmount = subtotal * (note.vatPercent / 100);
    const grandTotal = subtotal + vatAmount;

    return `
      <tr style="cursor: pointer;" onclick="openDetailModalByCode('${note.id}')">
        <td>
          <span style="font-size: 0.8rem; color: var(--ingr-text-muted);">
            ${new Date(note.timestamp).toLocaleDateString("vi-VN")}
          </span>
          <br>
          <span style="font-size: 0.75rem; color: var(--ingr-text-disabled);">
            ${new Date(note.timestamp).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
          </span>
        </td>
        <td>
          <strong class="ingr-highlight-code" style="color: var(--ingr-accent-amber);">
            ${note.id}
          </strong>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--ingr-text-bright);">${supplierName}</div>
          <span style="font-size: 0.75rem; color: var(--ingr-text-muted);">Mã NCC: ${supplier ? supplier.code : 'N/A'}</span>
        </td>
        <td style="text-align: center; font-weight: 700; color: var(--ingr-text-muted);">
          ${itemsCount}
        </td>
        <td style="text-align: right; font-weight: 700; color: var(--ingr-text-bright);">
          ${grandTotal.toLocaleString("vi-VN")} đ
        </td>
        <td>
          <span style="font-size: 0.85rem; color: var(--ingr-text-normal);">${note.createdBy}</span>
        </td>
        <td>
          <span class="ingr-ingredient-status-badge good">
            <i class="fa-solid fa-check-double" style="margin-right: 4px;"></i> Đã hoàn thành
          </span>
        </td>
        <td style="text-align: center;" onclick="event.stopPropagation();">
          <button class="ingr-icon-action-btn" title="Xem chi tiết" onclick="openDetailModalByCode('${note.id}')" style="background: none; border: none; color: var(--ingr-text-muted); cursor: pointer; padding: 5px; font-size: 1rem; margin-right: 8px;">
            <i class="fa-solid fa-eye" style="color: var(--ingr-accent-amber);"></i>
          </button>
          <button class="ingr-icon-action-btn" title="In phiếu" onclick="printDirectly('${note.id}')" style="background: none; border: none; color: var(--ingr-text-muted); cursor: pointer; padding: 5px; font-size: 1rem; margin-right: 8px;">
            <i class="fa-solid fa-print"></i>
          </button>
          <button class="ingr-icon-action-btn" title="Xuất PDF" onclick="exportPDFDirectly('${note.id}')" style="background: none; border: none; color: var(--ingr-text-muted); cursor: pointer; padding: 5px; font-size: 1rem;">
            <i class="fa-solid fa-file-pdf" style="color: var(--ingr-status-danger);"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Open modal functions
window.openDetailModalByCode = function(code) {
  const note = mockReceiptNotes.find(n => n.id === code);
  if (!note) return;

  selectedNote = note;
  renderDetailModalContent(note);

  const modal = document.getElementById("ingr-receipt-detail-modal");
  modal?.classList.add("active");
};

function renderDetailModalContent(note) {
  const container = document.getElementById("ingr-receipt-detail-body");
  if (!container) return;

  const supplier = suppliers.find(s => s.id === note.supplierId);
  
  // Calculate Totals
  const subtotal = note.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const vatAmount = subtotal * (note.vatPercent / 100);
  const grandTotal = subtotal + vatAmount;

  // Build items rows
  const itemsHTML = note.items.map((item, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="font-family: monospace; font-weight: 700;">${item.code}</td>
      <td><strong>${item.name}</strong></td>
      <td>${item.unit}</td>
      <td style="text-align: right; font-weight: 600;">${item.quantity.toFixed(1)}</td>
      <td style="text-align: right;">${item.price.toLocaleString("vi-VN")} đ</td>
      <td style="text-align: right; font-weight: 700; color: var(--ingr-accent-amber);">${(item.quantity * item.price).toLocaleString("vi-VN")} đ</td>
    </tr>
  `).join("");

  // Invoice Preview Section HTML
  let invoiceHTML = "";
  if (note.invoiceDoc) {
    invoiceHTML = `
      <div class="ingr-slip-invoice-preview">
        <div class="ingr-slip-invoice-title">
          <i class="fa-solid fa-paperclip"></i> Hóa đơn chứng từ đính kèm
        </div>
        <div class="ingr-slip-invoice-thumb-container" onclick="zoomInvoiceImage('${note.invoiceDoc}')">
          <img src="${note.invoiceDoc}" alt="Hóa đơn điện tử" class="ingr-slip-invoice-thumb">
          <i class="fa-solid fa-maximize ingr-slip-invoice-zoom-icon"></i>
        </div>
      </div>
    `;
  } else {
    invoiceHTML = `
      <div class="ingr-slip-invoice-preview" style="border-style: dashed; text-align: center; padding: 15px;">
        <span style="color: var(--ingr-text-disabled); font-size: 0.8rem;">
          <i class="fa-solid fa-circle-info"></i> Phiếu này không đính kèm hóa đơn chứng từ điện tử.
        </span>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Slip Container Wrapper -->
    <div class="ingr-slip-container-inner">
      <!-- Slip Header -->
      <div class="ingr-slip-header">
        <div class="ingr-slip-logo-info">
          <i class="fa-solid fa-fire-burner ingr-slip-logo-icon"></i>
          <div>
            <div class="ingr-slip-company-name">KURUMI BBQ</div>
            <div class="ingr-slip-company-sub">Hệ thống Nhà hàng & Quản lý Kho POS/ERP</div>
          </div>
        </div>
        <div class="ingr-slip-meta">
          <div class="ingr-slip-title">PHIẾU NHẬP KHO NGUYÊN LIỆU</div>
          <div class="ingr-slip-code">Số phiếu: ${note.id}</div>
          <div class="ingr-slip-date">Thời gian: ${new Date(note.timestamp).toLocaleString("vi-VN")}</div>
        </div>
      </div>

      <!-- Split Detail Information -->
      <div class="ingr-slip-grid-details">
        <div class="ingr-slip-detail-block">
          <h5 class="ingr-slip-block-title">Đơn vị cung cấp</h5>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Nhà cung cấp:</span>
            <span class="ingr-slip-detail-value">${supplier ? supplier.name : 'N/A'}</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Điện thoại:</span>
            <span class="ingr-slip-detail-value">${supplier ? supplier.phone : 'N/A'}</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Email liên hệ:</span>
            <span class="ingr-slip-detail-value">${supplier ? supplier.email : 'N/A'}</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Địa chỉ:</span>
            <span class="ingr-slip-detail-value" style="max-width: 70%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${supplier ? supplier.address : 'N/A'}</span>
          </div>
        </div>

        <div class="ingr-slip-detail-block">
          <h5 class="ingr-slip-block-title">Thông tin nhập kho</h5>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Thực hiện bởi:</span>
            <span class="ingr-slip-detail-value">${note.createdBy}</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Kho lưu trữ:</span>
            <span class="ingr-slip-detail-value">Kho Nguyên liệu chính - Q1</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Trạng thái phiếu:</span>
            <span class="ingr-slip-detail-value" style="color: var(--ingr-status-success);">ĐÃ HOÀN THÀNH</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Ghi chú:</span>
            <span class="ingr-slip-detail-value" style="font-style: italic; font-weight: 500;">${note.notes || "Không có ghi chú"}</span>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <h5 class="ingr-slip-table-title"><i class="fa-solid fa-list-check"></i> Danh sách mặt hàng nguyên liệu</h5>
      <table class="ingr-slip-table">
        <thead>
          <tr>
            <th style="width: 50px; text-align: center;">STT</th>
            <th style="width: 100px;">Mã NL</th>
            <th>Tên nguyên liệu</th>
            <th style="width: 80px;">Đơn vị</th>
            <th style="width: 100px; text-align: right;">S.Lượng nhập</th>
            <th style="width: 130px; text-align: right;">Đơn giá nhập</th>
            <th style="width: 150px; text-align: right;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Totals & VAT calculations -->
      <div class="ingr-slip-totals-area">
        <div class="ingr-slip-total-line">
          <span>Cộng tiền hàng:</span>
          <strong>${subtotal.toLocaleString("vi-VN")} đ</strong>
        </div>
        <div class="ingr-slip-total-line">
          <span>Thuế VAT (${note.vatPercent}%):</span>
          <strong>${vatAmount.toLocaleString("vi-VN")} đ</strong>
        </div>
        <div class="ingr-slip-total-line grand-total">
          <span>TỔNG TIỀN THANH TOÁN:</span>
          <strong>${grandTotal.toLocaleString("vi-VN")} đ</strong>
        </div>
      </div>

      <!-- Signatures Block -->
      <div class="ingr-slip-signatures-container">
        <div class="ingr-signature-box">
          <div class="ingr-signature-title">Người lập phiếu</div>
          <div class="ingr-signature-subtitle">(Ký, họ tên)</div>
          <div class="ingr-signature-name">${note.createdBy}</div>
        </div>
        <div class="ingr-signature-box">
          <div class="ingr-signature-title">Người giao hàng</div>
          <div class="ingr-signature-subtitle">(Ký, họ tên)</div>
          <div class="ingr-signature-name" style="color: var(--ingr-text-disabled);">Đại diện nhà cung cấp</div>
        </div>
        <div class="ingr-signature-box">
          <div class="ingr-signature-title">Thủ kho nhận hàng</div>
          <div class="ingr-signature-subtitle">(Ký, họ tên)</div>
          <div class="ingr-signature-name" style="color: var(--ingr-text-disabled);">Thủ kho Kurumi Q1</div>
        </div>
      </div>

      <!-- Invoice attached document -->
      ${invoiceHTML}
    </div>
  `;
}

function closeDetailModal() {
  const modal = document.getElementById("ingr-receipt-detail-modal");
  modal?.classList.remove("active");
  selectedNote = null;
}

// Invoice zoom preview
window.zoomInvoiceImage = function(src) {
  const zoomModal = document.getElementById("ingr-image-preview-zoom-modal");
  const img = document.getElementById("ingr-image-preview-large-img");
  if (zoomModal && img) {
    img.src = src;
    zoomModal.classList.add("active");
  }
};

function closeImageZoom() {
  const zoomModal = document.getElementById("ingr-image-preview-zoom-modal");
  zoomModal?.classList.remove("active");
}

// Export & Print actions
function printReceiptNote() {
  window.print();
}

function exportPDFReceiptNote() {
  if (!selectedNote) return;

  if (typeof showToast === "function") {
    showToast("Đang kết xuất", "Đang chuyển đổi hóa đơn sang định dạng PDF...", "info");
    
    setTimeout(() => {
      showToast("Xuất PDF thành công", `Đã lưu phiếu ${selectedNote.id}.pdf về máy của bạn.`, "success");
    }, 1500);
  }
}

// Action button triggers directly from listing
window.printDirectly = function(code) {
  const note = mockReceiptNotes.find(n => n.id === code);
  if (!note) return;

  selectedNote = note;
  renderDetailModalContent(note);
  setTimeout(() => {
    window.print();
  }, 100);
};

window.exportPDFDirectly = function(code) {
  const note = mockReceiptNotes.find(n => n.id === code);
  if (!note) return;

  selectedNote = note;
  if (typeof showToast === "function") {
    showToast("Đang kết xuất", `Bắt đầu xuất PDF cho phiếu ${code}...`, "info");
    setTimeout(() => {
      showToast("Xuất PDF thành công", `Tệp ${code}.pdf đã được tải xuống.`, "success");
    }, 1200);
  }
};
