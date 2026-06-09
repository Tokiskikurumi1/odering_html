// ==========================================
// GOODS ISSUE NOTES MANAGEMENT
// ==========================================

const mockIssueNotes = [
  {
    id: "GI-20260601-001",
    timestamp: "2026-06-01T10:15:00",
    reason: "Bếp - Chế biến món ăn",
    receiverName: "Trần Quốc Bảo (Bếp trưởng)",
    items: [
      { code: "ING001", name: "Ba chỉ bò Mỹ", unit: "kg", quantity: 8.0 },
      { code: "ING002", name: "Nạc vai bò Mỹ", unit: "kg", quantity: 5.5 },
    ],
    createdBy: "Nguyễn Minh Nam",
    status: "COMPLETED",
    notes:
      "Xuất ba chỉ bò Mỹ và nạc vai bò Mỹ làm nguyên liệu chế biến ca sáng.",
  },
  {
    id: "GI-20260601-002",
    timestamp: "2026-06-01T16:30:00",
    reason: "Quầy Bar - Pha chế",
    receiverName: "Lê Thị Thảo (Bar trưởng)",
    items: [{ code: "ING009", name: "Khoai tây", unit: "kg", quantity: 10.0 }],
    createdBy: "Nguyễn Minh Nam",
    status: "COMPLETED",
    notes: "Xuất khoai tây bổ sung làm món khoai tây chiên giòn ca tối.",
  },
  {
    id: "GI-20260602-001",
    timestamp: "2026-06-02T09:00:00",
    reason: "Kiểm kê - Bù trừ hao hụt",
    receiverName: "Nguyễn Minh Nam (Thủ kho)",
    items: [{ code: "ING003", name: "Tôm sú tươi", unit: "kg", quantity: 2.0 }],
    createdBy: "Nguyễn Minh Nam",
    status: "COMPLETED",
    notes: "Điều chỉnh hao hụt sau khi kiểm kê kho định kỳ tuần.",
  },
  {
    id: "GI-20260603-001",
    timestamp: "2026-06-03T11:00:00",
    reason: "Hủy nguyên liệu hết hạn",
    receiverName: "Trần Văn Hải (Giám sát)",
    items: [
      { code: "ING005", name: "Xà lách thủy canh", unit: "kg", quantity: 3.5 },
    ],
    createdBy: "Trần Văn Hải",
    status: "COMPLETED",
    notes: "Hủy rau xà lách bị hỏng, úng nước do lỗi tủ mát ca tối hôm qua.",
  },
  {
    id: "GI-20260604-001",
    timestamp: "2026-06-04T15:20:00",
    reason: "Bếp - Chế biến món ăn",
    receiverName: "Trần Quốc Bảo (Bếp trưởng)",
    items: [
      { code: "ING001", name: "Ba chỉ bò Mỹ", unit: "kg", quantity: 12.0 },
      { code: "ING004", name: "Mực ống", unit: "kg", quantity: 6.0 },
      { code: "ING007", name: "Nấm đùi gà", unit: "kg", quantity: 4.0 },
    ],
    createdBy: "Nguyễn Minh Nam",
    status: "COMPLETED",
    notes: "Xuất nguyên liệu lẩu nướng cho tiệc đặt bàn lớn ca tối.",
  },
  {
    id: "GI-20260605-001",
    timestamp: "2026-06-05T08:30:00",
    reason: "Xuất chuyển kho nội bộ",
    receiverName: "Phạm Văn Đức (Thủ kho chi nhánh Q3)",
    items: [
      { code: "ING002", name: "Nạc vai bò Mỹ", unit: "kg", quantity: 15.0 },
    ],
    createdBy: "Nguyễn Minh Nam",
    status: "COMPLETED",
    notes: "Chuyển kho hỗ trợ chi nhánh Quận 3 hết hàng đột xuất.",
  },
  {
    id: "GI-20260606-001",
    timestamp: "2026-06-06T10:00:00",
    reason: "Bếp - Chế biến món ăn",
    receiverName: "Nguyễn Văn Hùng (Bếp phụ)",
    items: [
      { code: "ING006", name: "Cà chua bi", unit: "kg", quantity: 5.0 },
      { code: "ING008", name: "Ớt chuông Đà Lạt", unit: "kg", quantity: 3.0 },
    ],
    createdBy: "Trần Văn Hải",
    status: "COMPLETED",
    notes: "Xuất rau củ làm món salad ăn kèm.",
  },
];

// State management
let issuePagination;
let filteredNotes = [...mockIssueNotes];
let selectedNote = null;

document.addEventListener("DOMContentLoaded", () => {
  // Initial render

  // Listeners for filters
  document
    .getElementById("ingr-issue-search")
    ?.addEventListener("input", handleFiltersChange);
  document
    .getElementById("ingr-issue-date-start")
    ?.addEventListener("change", handleFiltersChange);
  document
    .getElementById("ingr-issue-date-end")
    ?.addEventListener("change", handleFiltersChange);
  document
    .getElementById("ingr-issue-reason-filter")
    ?.addEventListener("change", handleFiltersChange);

  // Reset filter button
  document
    .getElementById("ingr-issue-filter-reset")
    ?.addEventListener("click", resetFilters);

  // Modal events
  document
    .getElementById("ingr-issue-detail-close")
    ?.addEventListener("click", closeDetailModal);
  document
    .getElementById("ingr-issue-detail-close-btn")
    ?.addEventListener("click", closeDetailModal);
  document
    .getElementById("ingr-issue-print-btn")
    ?.addEventListener("click", printIssueNote);
  document
    .getElementById("ingr-issue-pdf-btn")
    ?.addEventListener("click", exportPDFIssueNote);
});

function handleFiltersChange() {
  const query = document
    .getElementById("ingr-issue-search")
    .value.toLowerCase()
    .trim();
  const dateStart = document.getElementById("ingr-issue-date-start").value;
  const dateEnd = document.getElementById("ingr-issue-date-end").value;
  const reasonFilter = document.getElementById(
    "ingr-issue-reason-filter",
  ).value;

  filteredNotes = mockIssueNotes.filter((note) => {
    const reasonText = note.reason.toLowerCase();
    const receiverText = note.receiverName.toLowerCase();
    const noteId = note.id.toLowerCase();

    // Check search query
    const matchesQuery =
      !query ||
      noteId.includes(query) ||
      reasonText.includes(query) ||
      receiverText.includes(query);

    // Check dates
    const txDate = new Date(note.timestamp);
    const matchesStart =
      !dateStart || txDate >= new Date(dateStart + "T00:00:00");
    const matchesEnd = !dateEnd || txDate <= new Date(dateEnd + "T23:59:59");

    // Check reason dropdown
    const matchesReason =
      reasonFilter === "all" || note.reason === reasonFilter;

    return matchesQuery && matchesStart && matchesEnd && matchesReason;
  });

  refreshIssueTable();
}

function resetFilters() {
  document.getElementById("ingr-issue-search").value = "";
  document.getElementById("ingr-issue-date-start").value = "";
  document.getElementById("ingr-issue-date-end").value = "";
  document.getElementById("ingr-issue-reason-filter").value = "all";

  filteredNotes = [...mockIssueNotes];
  refreshIssueTable();

  if (typeof showToast === "function") {
    showToast("Bộ lọc", "Đã thiết lập lại các bộ lọc về mặc định", "info");
  }
}

function refreshIssueTable() {
  if (!issuePagination) {
    issuePagination = new Pagination({
      data: filteredNotes,
      itemsPerPage: 5,

      infoElementId: "ingr-ingredients-page-info",

      controlsElementId: "ingr-ingredients-page-controls",

      onRender: renderIssueNotes,
    });

    issuePagination.render();
  } else {
    issuePagination.setData(filteredNotes);
  }
}
window.initPage = function () {
  refreshIssueTable();
};
function renderIssueNotes(pageData) {
  const tbody = document.getElementById("ingr-issue-notes-tbody");
  if (!tbody) return;

  if (!pageData || pageData.length === 0) {
    tbody.innerHTML = `
    <tr>
      <td colspan="8">
        <div class="ingr-empty-state-card-wrapper">
          Không tìm thấy dữ liệu
        </div>
      </td>
    </tr>
  `;
    return;
  }
  const pageRecords = pageData;
  tbody.innerHTML = pageRecords
    .map((note) => {
      // Calculations
      const itemsCount = note.items.length;
      const totalQty = note.items.reduce((sum, item) => sum + item.quantity, 0);

      return `
      <tr style="cursor: pointer;" onclick="openIssueDetailModalByCode('${note.id}')">
        <td>
          <span style="font-size: 0.8rem; color: var(--ingr-text-muted);">
            ${new Date(note.timestamp).toLocaleDateString("vi-VN")}
          </span>
          <br>
          <span style="font-size: 0.75rem; color: var(--ingr-text-disabled);">
            ${new Date(note.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </td>
        <td>
          <strong class="ingr-highlight-code" style="color: var(--ingr-accent-amber);">
            ${note.id}
          </strong>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--ingr-text-bright);">${note.reason}</div>
          <span style="font-size: 0.75rem; color: var(--ingr-text-muted);">Người nhận: ${note.receiverName}</span>
        </td>
        <td style="text-align: center; font-weight: 700; color: var(--ingr-text-muted);">
          ${itemsCount} (${totalQty.toFixed(1)})
        </td>
        <td>
          <span style="font-size: 0.85rem; color: var(--ingr-text-normal);">${note.createdBy}</span>
        </td>
        <td>
          <span style="font-size: 0.8rem; color: var(--ingr-text-muted); display: block; max-width: 280px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${note.notes}">
            ${note.notes || "Không có ghi chú"}
          </span>
        </td>
        <td>
          <span class="ingr-ingredient-status-badge warning" style="color: var(--ingr-status-warning); background-color: var(--ingr-status-warning-bg);">
            <i class="fa-solid fa-circle-arrow-up" style="margin-right: 4px;"></i> Đã xuất kho
          </span>
        </td>
        <td style="text-align: center;" onclick="event.stopPropagation();">
          <button class="ingr-icon-action-btn" title="Xem chi tiết" onclick="openIssueDetailModalByCode('${note.id}')" style="background: none; border: none; color: var(--ingr-text-muted); cursor: pointer; padding: 5px; font-size: 1rem; margin-right: 8px;">
            <i class="fa-solid fa-eye" style="color: var(--ingr-accent-amber);"></i>
          </button>
          <button class="ingr-icon-action-btn" title="In phiếu" onclick="printIssueDirectly('${note.id}')" style="background: none; border: none; color: var(--ingr-text-muted); cursor: pointer; padding: 5px; font-size: 1rem; margin-right: 8px;">
            <i class="fa-solid fa-print"></i>
          </button>
          <button class="ingr-icon-action-btn" title="Xuất PDF" onclick="exportPDFIssueDirectly('${note.id}')" style="background: none; border: none; color: var(--ingr-text-muted); cursor: pointer; padding: 5px; font-size: 1rem;">
            <i class="fa-solid fa-file-pdf" style="color: var(--ingr-status-danger);"></i>
          </button>
        </td>
      </tr>
    `;
    })
    .join("");
}

// Open modal functions
window.openIssueDetailModalByCode = function (code) {
  const note = mockIssueNotes.find((n) => n.id === code);
  if (!note) return;

  selectedNote = note;
  renderDetailModalContent(note);

  const modal = document.getElementById("ingr-issue-detail-modal");
  modal?.classList.add("active");
};

function renderDetailModalContent(note) {
  const container = document.getElementById("ingr-issue-detail-body");
  if (!container) return;

  // Build items rows
  const itemsHTML = note.items
    .map(
      (item, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="font-family: monospace; font-weight: 700;">${item.code}</td>
      <td><strong>${item.name}</strong></td>
      <td>${item.unit}</td>
      <td style="text-align: right; font-weight: 700; color: var(--ingr-status-warning);">${item.quantity.toFixed(1)}</td>
    </tr>
  `,
    )
    .join("");

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
          <div class="ingr-slip-title" style="color: var(--ingr-status-warning);">PHIẾU XUẤT KHO NGUYÊN LIỆU</div>
          <div class="ingr-slip-code">Số phiếu: ${note.id}</div>
          <div class="ingr-slip-date">Thời gian: ${new Date(note.timestamp).toLocaleString("vi-VN")}</div>
        </div>
      </div>

      <!-- Split Detail Information -->
      <div class="ingr-slip-grid-details">
        <div class="ingr-slip-detail-block">
          <h5 class="ingr-slip-block-title">Thông tin giao nhận</h5>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Lý do xuất:</span>
            <span class="ingr-slip-detail-value" style="font-weight: 700;">${note.reason}</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Người nhận hàng:</span>
            <span class="ingr-slip-detail-value">${note.receiverName}</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Nơi nhận:</span>
            <span class="ingr-slip-detail-value">${note.reason.split(" - ").pop()}</span>
          </div>
        </div>

        <div class="ingr-slip-detail-block">
          <h5 class="ingr-slip-block-title">Thông tin chứng từ</h5>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Thực hiện bởi:</span>
            <span class="ingr-slip-detail-value">${note.createdBy}</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Kho xuất hàng:</span>
            <span class="ingr-slip-detail-value">Kho Nguyên liệu chính - Q1</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Trạng thái:</span>
            <span class="ingr-slip-detail-value" style="color: var(--ingr-status-warning); font-weight: 700;">ĐÃ XUẤT KHO</span>
          </div>
          <div class="ingr-slip-detail-item">
            <span class="ingr-slip-detail-label">Chi tiết ghi chú:</span>
            <span class="ingr-slip-detail-value" style="font-style: italic; font-weight: 500;">${note.notes || "Không có ghi chú"}</span>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <h5 class="ingr-slip-table-title"><i class="fa-solid fa-list-check"></i> Danh sách mặt hàng xuất kho</h5>
      <table class="ingr-slip-table">
        <thead>
          <tr>
            <th style="width: 50px; text-align: center;">STT</th>
            <th style="width: 120px;">Mã nguyên liệu</th>
            <th>Tên nguyên liệu</th>
            <th style="width: 100px;">Đơn vị</th>
            <th style="width: 150px; text-align: right;">S.Lượng thực xuất</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Signatures Block -->
      <div class="ingr-slip-signatures-container">
        <div class="ingr-signature-box">
          <div class="ingr-signature-title">Người lập phiếu</div>
          <div class="ingr-signature-subtitle">(Ký, họ tên)</div>
          <div class="ingr-signature-name">${note.createdBy}</div>
        </div>
        <div class="ingr-signature-box">
          <div class="ingr-signature-title">Người nhận hàng</div>
          <div class="ingr-signature-subtitle">(Ký, họ tên)</div>
          <div class="ingr-signature-name">${note.receiverName.split(" (").shift()}</div>
        </div>
        <div class="ingr-signature-box">
          <div class="ingr-signature-title">Thủ kho xuất hàng</div>
          <div class="ingr-signature-subtitle">(Ký, họ tên)</div>
          <div class="ingr-signature-name" style="color: var(--ingr-text-disabled);">Thủ kho Kurumi Q1</div>
        </div>
      </div>
    </div>
  `;
}

function closeDetailModal() {
  const modal = document.getElementById("ingr-issue-detail-modal");
  modal?.classList.remove("active");
  selectedNote = null;
}

// Export & Print actions
function printIssueNote() {
  window.print();
}

function exportPDFIssueNote() {
  if (!selectedNote) return;

  if (typeof showToast === "function") {
    showToast(
      "Đang kết xuất",
      "Đang chuyển đổi phiếu xuất sang định dạng PDF...",
      "info",
    );

    setTimeout(() => {
      showToast(
        "Xuất PDF thành công",
        `Đã lưu phiếu ${selectedNote.id}.pdf về máy của bạn.`,
        "success",
      );
    }, 1500);
  }
}

// Action button triggers directly from listing
window.printIssueDirectly = function (code) {
  const note = mockIssueNotes.find((n) => n.id === code);
  if (!note) return;

  selectedNote = note;
  renderDetailModalContent(note);
  setTimeout(() => {
    window.print();
  }, 100);
};

window.exportPDFIssueDirectly = function (code) {
  const note = mockIssueNotes.find((n) => n.id === code);
  if (!note) return;

  selectedNote = note;
  if (typeof showToast === "function") {
    showToast("Đang kết xuất", `Bắt đầu xuất PDF cho phiếu ${code}...`, "info");
    setTimeout(() => {
      showToast(
        "Xuất PDF thành công",
        `Tệp ${code}.pdf đã được tải xuống.`,
        "success",
      );
    }, 1200);
  }
};
