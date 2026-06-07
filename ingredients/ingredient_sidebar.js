// ==========================================
// PAGE TITLE MAPPING
// ==========================================

const pageTitleMap = {
  "ingredient_dashboard.html": "Dashboard kho",
  "ingredient_ingredients.html": "Quản lý nguyên liệu",
  "ingredient_categories.html": "Danh mục nguyên liệu",
  "ingredient_receipt.html": "Nhập kho",
  "ingredient_receipt_notes.html": "Phiếu nhập kho",
  "ingredient_goods_issue.html": "Xuất kho",
  "ingredient_goods_issue_notes.html": "Phiếu xuất kho",
  "ingredient_inventory_audit.html": "Kiểm kê kho",
  "ingredient_warnings.html": "Cảnh báo tồn kho",
  "ingredient_transaction_history.html": "Lịch sử giao dịch kho",
  "ingredient_supplier.html": "Nhà cung cấp",
  "ingredient_report.html": "Báo cáo - thống kê kho"
};

// ==========================================
// UPDATE HEADER TITLE
// ==========================================

function updateHeaderTitle() {
  const currentPage = location.pathname.split("/").pop();
  const title = pageTitleMap[currentPage] || "Dashboard kho";
  
  const headerTitle = document.getElementById("ingr-header-tab-title");
  
  if (headerTitle) {
    headerTitle.textContent = title;
  }
}

// ==========================================
// MOBILE SIDEBAR OVERLAY & TOGGLE
// ==========================================

function createSidebarOverlay() {
  // Kiểm tra xem overlay đã tồn tại chưa
  let overlay = document.getElementById("ingr-sidebar-overlay");
  
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "ingr-sidebar-overlay";
    overlay.className = "ingr-sidebar-overlay";
    document.body.appendChild(overlay);
    
    // Click overlay để đóng sidebar
    overlay.addEventListener("click", closeMobileSidebar);
  }
  
  return overlay;
}

function openMobileSidebar() {
  const sidebar = document.getElementById("ingr-sidebar-element");
  const overlay = createSidebarOverlay();
  
  if (sidebar) {
    sidebar.classList.add("mobile-open");
  }
  
  overlay.classList.add("active");
  
  // Prevent body scroll
  document.body.classList.add("ingr-sidebar-open");
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("ingr-sidebar-element");
  const overlay = document.getElementById("ingr-sidebar-overlay");
  
  if (sidebar) {
    sidebar.classList.remove("mobile-open");
  }
  
  if (overlay) {
    overlay.classList.remove("active");
  }
  
  // Enable body scroll
  document.body.classList.remove("ingr-sidebar-open");
}

// ==========================================
// INIT SIDEBAR
// ==========================================

function initIngredientSidebar() {
  console.log("Sidebar Loaded");

  // Update header title based on current page
  updateHeaderTitle();

  const currentPage = location.pathname.split("/").pop();

  // Active menu theo trang hiện tại
  document.querySelectorAll(".ingr-sidebar-menu-item").forEach((link) => {
    const href = link.getAttribute("href");

    if (href && href.includes(currentPage)) {
      link.classList.add("active");

      const accordion = link.closest(".ingr-sidebar-accordion-group");

      if (accordion) {
        accordion
          .querySelector(".ingr-sidebar-accordion-content")
          ?.classList.add("open");

        accordion
          .querySelector(".ingr-sidebar-accordion-header")
          ?.classList.add("active");

        accordion
          .querySelector(".ingr-accordion-arrow")
          ?.classList.add("rotated");
      }
    }
  });

  // Accordion dropdown
  document
    .querySelectorAll(".ingr-sidebar-accordion-header")
    .forEach((header) => {
      header.addEventListener("click", () => {
        const group = header.closest(".ingr-sidebar-accordion-group");

        const content = group.querySelector(".ingr-sidebar-accordion-content");

        const arrow = group.querySelector(".ingr-accordion-arrow");

        header.classList.toggle("active");
        content.classList.toggle("open");
        arrow.classList.toggle("rotated");
      });
    });

  // Mobile toggle button
  const mobileToggle = document.getElementById("ingr-mobile-toggle-btn");
  
  if (mobileToggle) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      openMobileSidebar();
    });
  }

  // Đóng sidebar khi click vào menu item (mobile)
  document.querySelectorAll(".ingr-sidebar-menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      // Chỉ đóng sidebar nếu đang ở chế độ mobile
      if (window.innerWidth <= 900) {
        closeMobileSidebar();
      }
    });
  });

  // Tạo overlay ngay từ đầu
  createSidebarOverlay();
}
