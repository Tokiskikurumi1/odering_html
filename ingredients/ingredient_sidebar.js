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

  // Collapse sidebar
  const sidebar = document.getElementById("ingr-sidebar-element");

  const collapseBtn = document.getElementById("ingr-sidebar-collapse-trigger");

  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
}
