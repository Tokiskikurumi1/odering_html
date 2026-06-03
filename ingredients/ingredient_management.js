/**
 * INGREDIENT MANAGEMENT MODULE - CORE JS
 * KURUMI BBQ ENTERPRISE POS/ERP SYSTEM
 * Vanilla JS implementation conforming to strict ingr- naming conventions.
 */

(function () {
  // Save original fetch
  window.originalFetch = window.fetch;

  // Main App State Initialization
  window.ingredientState = {
    ingredients:
      JSON.parse(localStorage.getItem("ingr_data_ingredients")) ||
      DEFAULT_INGREDIENTS,
    categories:
      JSON.parse(localStorage.getItem("ingr_data_categories")) ||
      DEFAULT_CATEGORIES,
    suppliers:
      JSON.parse(localStorage.getItem("ingr_data_suppliers")) ||
      DEFAULT_SUPPLIERS,
    history:
      JSON.parse(localStorage.getItem("ingr_data_history")) || DEFAULT_HISTORY,
    notifications:
      JSON.parse(localStorage.getItem("ingr_data_notifications")) ||
      DEFAULT_NOTIFICATIONS,
    activeTab: "dashboard",
    activeFilters: { search: "", category: "all", status: "all" },
    pagination: { page: 1, limit: 10 },
  };

  function saveState() {
    localStorage.setItem(
      "ingr_data_ingredients",
      JSON.stringify(window.ingredientState.ingredients),
    );
    localStorage.setItem(
      "ingr_data_categories",
      JSON.stringify(window.ingredientState.categories),
    );
    localStorage.setItem(
      "ingr_data_suppliers",
      JSON.stringify(window.ingredientState.suppliers),
    );
    localStorage.setItem(
      "ingr_data_history",
      JSON.stringify(window.ingredientState.history),
    );
    localStorage.setItem(
      "ingr_data_notifications",
      JSON.stringify(window.ingredientState.notifications),
    );
  }

  // Helper functions to get status for an ingredient
  function getIngredientStatus(ingr) {
    const today = new Date("2026-05-25"); // Current app date simulation
    const expiryDate = new Date(ingr.expiry);

    if (expiryDate <= today) {
      return "expired";
    }

    if (ingr.stock <= 0 || ingr.stock <= ingr.minStock / 3) {
      return "critical";
    }

    if (ingr.stock <= ingr.minStock) {
      return "warning";
    }

    if (ingr.stock >= ingr.minStock * 4) {
      return "excess";
    }

    return "good";
  }

  // Dynamic stats calculations
  function calculateGlobalStats() {
    let total = window.ingredientState.ingredients.length;
    let low = 0;
    let expired = 0;
    let totalValue = 0;

    window.ingredientState.ingredients.forEach((ingr) => {
      const status = getIngredientStatus(ingr);
      if (status === "critical" || status === "warning") {
        low++;
      } else if (status === "expired") {
        expired++;
      }
      totalValue += ingr.stock * ingr.price;
    });

    return { total, low, expired, totalValue };
  }

  // ==========================================================================
  // INTERCEPT FETCH() CALLS (SIMULATES ENDPOINTS WITH NETWORK LATENCY & SKELETONS)
  // ==========================================================================
  window.fetch = async function (url, options) {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;

    // Simulate 400ms server network latency
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (path === "/api/ingredients") {
      if (options && options.method === "POST") {
        const body = JSON.parse(options.body);
        if (body.id) {
          // Update
          const idx = window.ingredientState.ingredients.findIndex(
            (i) => i.id === body.id,
          );
          if (idx !== -1) {
            window.ingredientState.ingredients[idx] = {
              ...window.ingredientState.ingredients[idx],
              ...body,
            };
          }
        } else {
          // Create
          body.id =
            body.code ||
            "NL" +
              String(window.ingredientState.ingredients.length + 1).padStart(
                3,
                "0",
              );
          window.ingredientState.ingredients.push(body);
        }
        saveState();
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, data: body }),
        };
      }
      if (options && options.method === "DELETE") {
        const id = parsedUrl.searchParams.get("id");
        window.ingredientState.ingredients =
          window.ingredientState.ingredients.filter((i) => i.id !== id);
        saveState();
        return { ok: true, status: 200, json: async () => ({ success: true }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => window.ingredientState.ingredients,
      };
    }

    if (path === "/api/categories") {
      if (options && options.method === "POST") {
        const body = JSON.parse(options.body);
        if (body.id) {
          const idx = window.ingredientState.categories.findIndex(
            (c) => c.id === body.id,
          );
          if (idx !== -1) {
            window.ingredientState.categories[idx] = {
              ...window.ingredientState.categories[idx],
              ...body,
            };
          }
        } else {
          body.id = "cat-" + (window.ingredientState.categories.length + 1);
          window.ingredientState.categories.push(body);
        }
        saveState();
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, data: body }),
        };
      }
      if (options && options.method === "DELETE") {
        const id = parsedUrl.searchParams.get("id");
        window.ingredientState.categories =
          window.ingredientState.categories.filter((c) => c.id !== id);
        saveState();
        return { ok: true, status: 200, json: async () => ({ success: true }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => window.ingredientState.categories,
      };
    }

    if (path === "/api/suppliers") {
      if (options && options.method === "POST") {
        const body = JSON.parse(options.body);
        if (body.id) {
          const idx = window.ingredientState.suppliers.findIndex(
            (s) => s.id === body.id,
          );
          if (idx !== -1) {
            window.ingredientState.suppliers[idx] = {
              ...window.ingredientState.suppliers[idx],
              ...body,
            };
          }
        } else {
          body.id = "sup-" + (window.ingredientState.suppliers.length + 1);
          body.volume = 0;
          window.ingredientState.suppliers.push(body);
        }
        saveState();
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, data: body }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => window.ingredientState.suppliers,
      };
    }

    if (path === "/api/transactions") {
      if (options && options.method === "POST") {
        const body = JSON.parse(options.body);
        body.id =
          "TX-" +
          String(window.ingredientState.history.length + 1).padStart(3, "0");
        body.timestamp = new Date().toISOString();
        window.ingredientState.history.unshift(body);

        // Adjust ingredient quantity physically
        const ingr = window.ingredientState.ingredients.find(
          (i) => i.id === body.ingredientId,
        );
        if (ingr) {
          ingr.stock += body.qty;
          if (ingr.stock < 0) ingr.stock = 0; // Negative limit control
        }

        // Trigger auto notifications if status becomes critical
        if (ingr) {
          const newStatus = getIngredientStatus(ingr);
          if (newStatus === "critical" || newStatus === "warning") {
            const newNotif = {
              id: "notif-" + (window.ingredientState.notifications.length + 1),
              type: newStatus,
              title: `Nguyên liệu ${newStatus === "critical" ? "chạm ngưỡng báo động" : "sắp hết"}`,
              message: `${ingr.name} (${ingr.code}) hiện còn ${ingr.stock} ${ingr.unit} (Định mức tối thiểu: ${ingr.minStock} ${ingr.unit}).`,
              time: "Vừa xong",
              read: false,
            };
            window.ingredientState.notifications.unshift(newNotif);
          }
        }

        saveState();
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, data: body }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => window.ingredientState.history,
      };
    }

    // Default routing fallback
    return window.originalFetch
      ? window.originalFetch(url, options)
      : { ok: false, status: 404 };
  };

  // ==========================================================================
  // TOAST NOTIFICATIONS SERVICE (ANT DESIGN / SHADCN UI DYNAMICS)
  // ==========================================================================
  window.showToast = function (title, message, type = "info") {
    const dock = document.getElementById("ingr-global-toast-container");
    if (!dock) return;

    const card = document.createElement("div");
    card.className = `ingr-toast-card-element ${type}`;

    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-circle-check";
    if (type === "warning") icon = "fa-triangle-exclamation";
    if (type === "error") icon = "fa-circle-xmark";

    card.innerHTML = `
            <i class="fa-solid ${icon} ingr-toast-icon"></i>
            <div class="ingr-toast-content">
                <span class="ingr-toast-title">${title}</span>
                <span class="ingr-toast-message">${message}</span>
            </div>
            <button class="ingr-toast-close-btn" title="Đóng"><i class="fa-solid fa-xmark"></i></button>
            <div class="ingr-toast-progress-bar-decay"></div>
        `;

    dock.appendChild(card);

    // Progress bar decay logic (visual timer)
    const progress = card.querySelector(".ingr-toast-progress-bar-decay");
    progress.style.transition = "width 4s linear";
    setTimeout(() => {
      progress.style.width = "0%";
    }, 50);

    // Close functions
    const closeBtn = card.querySelector(".ingr-toast-close-btn");
    const dismissToast = () => {
      if (card.classList.contains("hiding")) return;
      card.classList.add("hiding");
      card.addEventListener("animationend", () => card.remove());
    };

    closeBtn.onclick = dismissToast;

    // Auto destroy after 4 seconds
    const timeoutId = setTimeout(dismissToast, 4000);
    card.onmouseenter = () => {
      clearTimeout(timeoutId);
      progress.style.transition = "none";
      progress.style.width = "100%";
    };
  };

  // ==========================================================================
  // DYNAMIC VIEWS RENDER SYSTEM
  // ==========================================================================

  // Chart handlers references
  let dashboardChartInstance = null;
  let reportSpendChartInstance = null;
  let reportTopChartInstance = null;

  // SKELETON LOADER ANIMATOR
  function showSkeleton(elementId, heightClass = "") {
    const container = document.getElementById(elementId);
    if (!container) return;

    container.innerHTML = `
            <div class="ingr-skeleton-loading-panel ${heightClass}">
                <div class="ingr-skeleton-bar-placeholder header-title"></div>
                <div class="ingr-skeleton-bar-placeholder"></div>
                <div class="ingr-skeleton-bar-placeholder short"></div>
                <div class="ingr-skeleton-bar-placeholder"></div>
            </div>
        `;
  }

  // ==========================================================================
  // NOTIFICATION DROPDOWN POPULATER
  // ==========================================================================
  function renderGlobalHeaderNotifications() {
    const dropdown = document.getElementById(
      "ingr-notifications-dropdown-list",
    );
    const countSpan = document.getElementById("ingr-header-bell-count");
    if (!dropdown) return;

    const unreadList = window.ingredientState.notifications.filter(
      (n) => !n.read,
    );
    countSpan.textContent = unreadList.length;
    if (unreadList.length === 0) {
      countSpan.classList.add("hidden");
    } else {
      countSpan.classList.remove("hidden");
    }

    if (window.ingredientState.notifications.length === 0) {
      dropdown.innerHTML = `<div style="text-align: center; color: var(--ingr-text-disabled); padding: 30px; font-size: 0.8rem;">Chưa nhận được thông báo mới nào.</div>`;
      return;
    }

    dropdown.innerHTML = window.ingredientState.notifications
      .map((n) => {
        let icon = "fa-circle-info";
        if (n.type === "expired" || n.type === "critical")
          icon = "fa-triangle-exclamation";
        if (n.type === "warning") icon = "fa-circle-exclamation";
        if (n.type === "success") icon = "fa-circle-check";

        return `
                <div class="ingr-notification-list-item ${n.read ? "" : "unread"}" onclick="window.markNotificationRead('${n.id}')">
                    <div class="ingr-notification-item-icon ${n.type === "expired" || n.type === "critical" ? "critical" : n.type === "warning" ? "warning" : "success"}">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="ingr-notification-item-content">
                        <span class="ingr-notification-item-title">${n.title}</span>
                        <span class="ingr-notification-item-title" style="font-weight: 500; color: var(--ingr-text-muted); font-size: 0.72rem; margin-top: 2px;">${n.message}</span>
                        <span class="ingr-notification-item-time">${n.time}</span>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  window.markNotificationRead = function (id) {
    const notif = window.ingredientState.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      saveState();
      renderGlobalHeaderNotifications();
    }
  };

  const notifMarkAllBtn = document.getElementById(
    "ingr-notifications-clear-btn",
  );
  if (notifMarkAllBtn) {
    notifMarkAllBtn.onclick = function (e) {
      e.stopPropagation();
      window.ingredientState.notifications.forEach((n) => (n.read = true));
      saveState();
      renderGlobalHeaderNotifications();
      window.showToast(
        "Thông báo",
        "Đã đánh dấu đọc toàn bộ thông báo hệ thống.",
        "success",
      );
    };
  }

  // SIDEBAR BADGE ALERTS COUNTER
  function renderGlobalSidebarAlerts() {
    const badge = document.getElementById("ingr-badge-global-warnings");
    if (!badge) return;

    // Calculate count of warning stock items
    const warningsCount = window.ingredientState.ingredients.filter((ingr) => {
      const status = getIngredientStatus(ingr);
      return (
        status === "critical" || status === "warning" || status === "expired"
      );
    }).length;

    badge.textContent = warningsCount;
    if (warningsCount === 0) {
      badge.style.display = "none";
    } else {
      badge.style.display = "block";
    }
  }

  // ==========================================================================
  // CRUD OPERATIONS CORE HANDLERS
  // ==========================================================================

  // ==========================================================================
  // TRANSACTION PROCESSORS (SUBMIT GOODS RECEIPT / GOODS ISSUE)
  // ==========================================================================

  // A. SUBMIT GOODS RECEIPT
  const receiptForm = document.getElementById("ingr-receipt-creation-form");
  if (receiptForm) {
    receiptForm.onsubmit = async function (e) {
      e.preventDefault();

      const supplierSelect = document.getElementById("ingr-receipt-supplier");
      const supplierId = supplierSelect.value;
      const supplierName =
        supplierSelect.options[supplierSelect.selectedIndex].text;
      const rows = document.querySelectorAll("#ingr-receipt-items-tbody tr");

      if (!supplierId) {
        window.showToast(
          "Cảnh báo nhập kho",
          "Vui lòng lựa chọn nhà cung cấp trước khi ghi nhận.",
          "warning",
        );
        return;
      }

      const promises = [];
      rows.forEach((tr) => {
        const select = tr.querySelector("select");
        const qtyInput = tr.querySelector("input[type='number']");
        const priceInput = tr.querySelectorAll("input")[1];

        const ingrId = select.value;
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;

        if (ingrId && qty > 0) {
          promises.push(
            fetch("/api/transactions", {
              method: "POST",
              body: JSON.stringify({
                type: "IMPORT",
                details: `Nhập kho từ đối tác ${supplierName}`,
                ingredientId: ingrId,
                qty: qty,
                user: "Nguyễn Minh Nam",
              }),
            }),
          );
        }
      });

      if (promises.length === 0) {
        window.showToast(
          "Cảnh báo phiếu",
          "Vui lòng lựa chọn ít nhất một nguyên liệu với số lượng nhập khả dụng.",
          "warning",
        );
        return;
      }

      try {
        await Promise.all(promises);
        window.showToast(
          "Nhập kho thành công",
          "Phiếu nhập hàng đã được duyệt, số lượng tồn kho đã được cộng thêm.",
          "success",
        );

        // Clear simulated upload invoice attachment
        document
          .getElementById("ingr-receipt-file-badge")
          .classList.add("hidden");
        document.getElementById("ingr-receipt-file-input").value = "";

        // Reset Goods Receipt Form
        renderGoodsReceipt();
        renderGlobalSidebarAlerts();
      } catch (err) {
        window.showToast(
          "Lỗi nhập kho",
          "Có lỗi xảy ra trong quá trình cập nhật.",
          "error",
        );
      }
    };

    // Reset receipt form trigger
    document.getElementById("ingr-receipt-reset-form-btn").onclick =
      renderGoodsReceipt;
  }

  // DRAG AND DROP SIMULATION FOR RECEIPT INVOICE
  const uploadZone = document.getElementById("ingr-receipt-upload-zone");
  const fileInput = document.getElementById("ingr-receipt-file-input");
  const fileBadge = document.getElementById("ingr-receipt-file-badge");
  const filenameSpan = document.getElementById("ingr-receipt-filename");
  const removeFileBtn = document.getElementById("ingr-receipt-remove-file-btn");

  if (uploadZone) {
    uploadZone.onclick = () => fileInput.click();

    uploadZone.ondragover = function (e) {
      e.preventDefault();
      uploadZone.classList.add("dragover");
    };

    uploadZone.ondragleave = function () {
      uploadZone.classList.remove("dragover");
    };

    uploadZone.ondrop = function (e) {
      e.preventDefault();
      uploadZone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        handleUploadedFile(e.dataTransfer.files[0]);
      }
    };

    fileInput.onchange = function () {
      if (fileInput.files.length > 0) {
        handleUploadedFile(fileInput.files[0]);
      }
    };

    function handleUploadedFile(file) {
      filenameSpan.textContent = file.name;
      fileBadge.classList.remove("hidden");
      window.showToast(
        "Tải hóa đơn điện tử",
        `Đã đính kèm tệp '${file.name}' vào phiếu nhập hàng thành công.`,
        "success",
      );
    }

    if (removeFileBtn) {
      removeFileBtn.onclick = function (e) {
        e.stopPropagation();
        fileInput.value = "";
        fileBadge.classList.add("hidden");
        window.showToast(
          "Gỡ hóa đơn",
          "Đã gỡ hóa đơn điện tử khỏi phiếu nhập.",
          "info",
        );
      };
    }
  }

  // B. SUBMIT GOODS ISSUE
  const issueForm = document.getElementById("ingr-issue-creation-form");
  if (issueForm) {
    issueForm.onsubmit = async function (e) {
      e.preventDefault();

      const reasonSelect = document.getElementById("ingr-issue-reason");
      const reason = reasonSelect.value;
      const note = document.getElementById("ingr-issue-note").value;
      const rows = document.querySelectorAll("#ingr-issue-items-tbody tr");

      if (!reason) {
        window.showToast(
          "Cảnh báo xuất kho",
          "Vui lòng lựa chọn lý do/nơi nhận để hoàn tất xuất kho.",
          "warning",
        );
        return;
      }

      const promises = [];
      let quantityError = false;

      rows.forEach((tr) => {
        const select = tr.querySelector("select");
        const qtyInput = tr.querySelector("input[type='number']");

        const ingrId = select.value;
        const qty = parseFloat(qtyInput.value) || 0;

        if (ingrId && qty > 0) {
          // double check stock quantity
          const option = select.options[select.selectedIndex];
          const stock = parseFloat(option.getAttribute("data-stock"));

          if (qty > stock) {
            quantityError = true;
          } else {
            promises.push(
              fetch("/api/transactions", {
                method: "POST",
                body: JSON.stringify({
                  type: "EXPORT",
                  details: `Xuất kho: ${reason} (${note || "Xuất trực tiếp"})`,
                  ingredientId: ingrId,
                  qty: -qty,
                  user: "Nguyễn Minh Nam",
                }),
              }),
            );
          }
        }
      });

      if (quantityError) {
        window.showToast(
          "Lỗi định lượng",
          "Có dòng nguyên liệu vượt quá lượng tồn thực tế. Vui lòng kiểm tra lại.",
          "error",
        );
        return;
      }

      if (promises.length === 0) {
        window.showToast(
          "Cảnh báo phiếu",
          "Vui lòng chọn ít nhất một nguyên liệu hợp lệ.",
          "warning",
        );
        return;
      }

      try {
        await Promise.all(promises);
        window.showToast(
          "Xuất kho thành công",
          "Đã duyệt phiếu xuất kho. Tồn hệ thống đã được khấu trừ phù hợp.",
          "success",
        );

        // Clear & Reset Issue Form
        renderGoodsIssue();
        renderGlobalSidebarAlerts();
      } catch (err) {
        window.showToast(
          "Lỗi xuất kho",
          "Có lỗi xảy ra khi thực hiện.",
          "error",
        );
      }
    };

    // Reset issue trigger
    document.getElementById("ingr-issue-reset-btn").onclick = renderGoodsIssue;
  }

  // ==========================================================================
  // BIND EVENT LISTENERS & ROUTING INITIALIZATION
  // ==========================================================================

  // Mobile menu drawer overlay toggle
  const mobileToggle = document.getElementById("ingr-mobile-toggle-btn");
  if (mobileToggle) {
    mobileToggle.onclick = function (e) {
      e.stopPropagation();
      sidebar.classList.add("mobile-open");
    };
  }

  // Click outside mobile drawer closes it
  document.addEventListener("click", function (e) {
    if (
      !sidebar.contains(e.target) &&
      sidebar.classList.contains("mobile-open")
    ) {
      sidebar.classList.remove("mobile-open");
    }
  });

  // Header Notification panel toggle trigger
  const notifTrigger = document.getElementById(
    "ingr-notifications-dropdown-trigger",
  );
  const notifPanel = document.getElementById("ingr-notifications-panel");
  if (notifTrigger) {
    notifTrigger.onclick = function (e) {
      e.stopPropagation();
      notifPanel.classList.toggle("active");
    };

    document.addEventListener("click", function () {
      notifPanel.classList.remove("active");
    });
  }

  // MAIN ROUTING DOCK BINDER
  const menuItems = document.querySelectorAll(".ingr-sidebar-menu-item");
  menuItems.forEach((item) => {
    item.onclick = function (e) {
      e.preventDefault();

      const tab = item.getAttribute("data-tab");
      if (!tab) return;

      // Remove active tags on all menu options
      menuItems.forEach((mi) => mi.classList.remove("active"));
      item.classList.add("active");

      // Close mobile drawer on item click
      sidebar.classList.remove("mobile-open");

      // Setup Header Title
      const tabText = item.querySelector(".ingr-menu-text").textContent;
      document.getElementById("ingr-header-tab-title").textContent = tabText;

      // Render skeleton loading before launching tab
      const panes = document.querySelectorAll(".ingr-tab-panel");
      panes.forEach((pane) => pane.classList.remove("active"));

      const targetPane = document.getElementById(`ingr-panel-${tab}`);
      if (targetPane) {
        targetPane.classList.add("active");

        // Trigger simulated fetch loading animations
        const cacheOriginalContent = targetPane.innerHTML;
        showSkeleton(targetPane.id, tab === "dashboard" ? "short" : "");

        setTimeout(() => {
          targetPane.innerHTML = cacheOriginalContent;

          // Trigger actual render routine for specific panel
          if (tab === "dashboard") renderDashboard();
          if (tab === "ingredients") renderIngredients();
          if (tab === "categories") renderCategories();
          if (tab === "goods-receipt") renderGoodsReceipt();
          if (tab === "goods-issue") renderGoodsIssue();
          if (tab === "audit") renderAudit();
          if (tab === "warnings") renderWarnings();
          if (tab === "history") renderHistory();
          if (tab === "suppliers") renderSuppliers();
          if (tab === "reports") renderReports();
        }, 400); // Matches intercept server delay
      }
    };
  });

  // BIND INGREDIENT FILTER DYNAMIC TRIGGERS
  const searchIngrInput = document.getElementById(
    "ingr-search-ingredient-input",
  );
  const filterCatDropdown = document.getElementById(
    "ingr-filter-ingredient-category",
  );
  const filterStatDropdown = document.getElementById(
    "ingr-filter-ingredient-status",
  );

  if (searchIngrInput) {
    searchIngrInput.oninput = function () {
      window.ingredientState.activeFilters.search = searchIngrInput.value;
      window.ingredientState.pagination.page = 1;
      renderIngredients();
    };
  }
  if (filterCatDropdown) {
    filterCatDropdown.onchange = function () {
      window.ingredientState.activeFilters.category = filterCatDropdown.value;
      window.ingredientState.pagination.page = 1;
      renderIngredients();
    };
  }
  if (filterStatDropdown) {
    filterStatDropdown.onchange = function () {
      window.ingredientState.activeFilters.status = filterStatDropdown.value;
      window.ingredientState.pagination.page = 1;
      renderIngredients();
    };
  }

  // Global Search header input hook
  const globalSearch = document.getElementById("ingr-global-header-search");
  if (globalSearch) {
    globalSearch.oninput = function () {
      const q = globalSearch.value;
      window.ingredientState.activeFilters.search = q;

      // Redirect automatically to ingredients list if on other tab
      const ingrTabBtn = document.querySelector(`[data-tab="ingredients"]`);
      if (ingrTabBtn && !ingrTabBtn.classList.contains("active")) {
        ingrTabBtn.click();
      } else {
        renderIngredients();
      }
    };
  }

  // ==========================================================================
  // BOOTSTRAP INITIALIZATION ON LOAD
  // ==========================================================================
  window.onload = function () {
    // Load initial UI dropdown categories list
    const catFilter = document.getElementById(
      "ingr-filter-ingredient-category",
    );
    if (catFilter) {
      catFilter.innerHTML =
        `<option value="all">Tất cả danh mục</option>` +
        window.ingredientState.categories
          .map((c) => `<option value="${c.id}">${c.name}</option>`)
          .join("");
    }

    renderDashboard();
    renderGlobalHeaderNotifications();
    renderGlobalSidebarAlerts();

    window.showToast(
      "Chào mừng",
      "Hệ thống Quản lý kho Kurumi BBQ đã khởi động thành công.",
      "success",
    );
  };
})();
