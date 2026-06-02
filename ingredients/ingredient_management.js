/**
 * INGREDIENT MANAGEMENT MODULE - CORE JS
 * KURUMI BBQ ENTERPRISE POS/ERP SYSTEM
 * Vanilla JS implementation conforming to strict ingr- naming conventions.
 */

(function () {
  // Save original fetch
  window.originalFetch = window.fetch;

  // Default Seed Data
  const DEFAULT_CATEGORIES = [
    {
      id: "cat-1",
      name: "Thịt & Hải sản",
      color: "#e88735",
      description: "Các loại thịt nướng BBQ, tôm, cá, hải sản tươi sống",
    },
    {
      id: "cat-2",
      name: "Rau củ & Gia vị",
      color: "#10b981",
      description:
        "Rau xà lách ăn kèm, rau lẩu, nấm và các loại nước sốt tẩm ướp",
    },
    {
      id: "cat-3",
      name: "Đồ uống & Tráng miệng",
      color: "#3b82f6",
      description: "Bia, nước ngọt, kem, trái cây tráng miệng",
    },
    {
      id: "cat-4",
      name: "Nguyên liệu khô",
      color: "#8b5cf6",
      description: "Than nướng, giấy bạc, gia vị hạt nêm, gia vị khô đóng gói",
    },
  ];

  const DEFAULT_SUPPLIERS = [
    {
      id: "sup-1",
      name: "Thịt Sạch CP Group",
      email: "contact@cpmeat.com.vn",
      phone: "0283812456",
      address: "Khu công nghiệp Biên Hòa 2, Đồng Nai",
      volume: 152000000,
    },
    {
      id: "sup-2",
      name: "Hợp tác xã Rau củ Đà Lạt",
      email: "dalatfresh@veg.vn",
      phone: "0987654321",
      address: "42 Trần Hưng Đạo, TP. Đà Lạt",
      volume: 48900000,
    },
    {
      id: "sup-3",
      name: "Hải sản Đại Dương Xanh",
      email: "ocean.seafood@gmail.com",
      phone: "0901234567",
      address: "Cảng cá Quận 4, TP. Hồ Chí Minh",
      volume: 95400000,
    },
    {
      id: "sup-4",
      name: "Tổng đại lý Đồ uống Tân Hiệp Phát",
      email: "thp@beverages.vn",
      phone: "0274375512",
      address: "Đại lộ Bình Dương, Thuận An, Bình Dương",
      volume: 32000000,
    },
  ];

  const DEFAULT_INGREDIENTS = [
    {
      id: "NL001",
      code: "NL001",
      name: "Thịt ba chỉ bò Mỹ",
      categoryId: "cat-1",
      stock: 45.5,
      unit: "kg",
      minStock: 15.0,
      expiry: "2026-06-15",
      price: 220000,
    },
    {
      id: "NL002",
      code: "NL002",
      name: "Tôm sú tươi sống",
      categoryId: "cat-1",
      stock: 4.2,
      unit: "kg",
      minStock: 10.0,
      expiry: "2026-05-27",
      price: 380000,
    },
    {
      id: "NL003",
      code: "NL003",
      name: "Xà lách thủy canh",
      categoryId: "cat-2",
      stock: 12.0,
      unit: "kg",
      minStock: 5.0,
      expiry: "2026-05-24",
      price: 45000,
    }, // Expired (relative to May 25, 2026)
    {
      id: "NL004",
      code: "NL004",
      name: "Sốt BBQ đặc chế Kurumi",
      categoryId: "cat-2",
      stock: 35.0,
      unit: "lít",
      minStock: 10.0,
      expiry: "2026-09-30",
      price: 85000,
    },
    {
      id: "NL005",
      code: "NL005",
      name: "Than nướng không khói",
      categoryId: "cat-4",
      stock: 250.0,
      unit: "kg",
      minStock: 50.0,
      expiry: "2027-12-31",
      price: 18000,
    }, // Excess stock
    {
      id: "NL006",
      code: "NL006",
      name: "Bia Heineken đóng chai",
      categoryId: "cat-3",
      stock: 40.0,
      unit: "thùng",
      minStock: 12.0,
      expiry: "2027-04-10",
      price: 410000,
    },
    {
      id: "NL007",
      code: "NL007",
      name: "Thịt sườn Tomahawk Mỹ",
      categoryId: "cat-1",
      stock: 2.0,
      unit: "kg",
      minStock: 8.0,
      expiry: "2026-06-10",
      price: 1250000,
    }, // Critical Low
    {
      id: "NL008",
      code: "NL008",
      name: "Nấm kim châm Đà Lạt",
      categoryId: "cat-2",
      stock: 9.0,
      unit: "gói",
      minStock: 15.0,
      expiry: "2026-05-29",
      price: 12000,
    }, // Warning Low
  ];

  const DEFAULT_HISTORY = [
    {
      id: "TX-001",
      timestamp: "2026-05-25T08:30:00+07:00",
      type: "IMPORT",
      details: "Nhập hàng từ CP Group (Phiếu GR-20260525-001)",
      ingredientId: "NL001",
      qty: 20,
      user: "Nguyễn Minh Nam",
    },
    {
      id: "TX-002",
      timestamp: "2026-05-25T09:15:00+07:00",
      type: "EXPORT",
      details: "Xuất kho phục vụ Bếp chính nướng",
      ingredientId: "NL001",
      qty: -12.5,
      user: "Nguyễn Minh Nam",
    },
    {
      id: "TX-003",
      timestamp: "2026-05-24T16:00:00+07:00",
      type: "AUDIT",
      details: "Điều chỉnh chênh lệch kiểm kê định kỳ",
      ingredientId: "NL004",
      qty: 2.0,
      user: "Nguyễn Minh Nam",
    },
    {
      id: "TX-004",
      timestamp: "2026-05-24T17:45:00+07:00",
      type: "CRUD",
      details: "Khởi tạo thông tin nguyên liệu mới trong hệ thống",
      ingredientId: "NL007",
      qty: 2,
      user: "Nguyễn Minh Nam",
    },
  ];

  const DEFAULT_NOTIFICATIONS = [
    {
      id: "notif-1",
      type: "expired",
      title: "Nguyên liệu hết hạn sử dụng",
      message:
        "Nguyên liệu 'Xà lách thủy canh' (Mã NL003) đã quá hạn từ ngày 24/05/2026. Hãy tiêu hủy kho ngay lập tức.",
      time: "1 ngày trước",
      read: false,
    },
    {
      id: "notif-2",
      type: "critical",
      title: "Cảnh báo tồn kho cực thấp",
      message:
        "Sườn Tomahawk Mỹ (NL007) chỉ còn tồn 2.0 kg so với định mức an toàn 8.0 kg.",
      time: "4 giờ trước",
      read: false,
    },
    {
      id: "notif-3",
      type: "warning",
      title: "Nguyên liệu sắp hết",
      message:
        "Nấm kim châm Đà Lạt (NL008) chỉ còn tồn 9 gói. Nên lên kế hoạch nhập hàng.",
      time: "6 giờ trước",
      read: true,
    },
  ];

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

  // A. INGREDIENT CRUD
  const ingrModal = document.getElementById("ingr-ingredient-crud-modal");
  const ingrForm = document.getElementById("ingr-ingredient-form-element");

  document.getElementById("ingr-btn-add-ingredient").onclick = function () {
    document.getElementById("ingr-ingredient-modal-title").textContent =
      "Thêm Nguyên Liệu Mới";
    ingrForm.reset();
    document.getElementById("ingr-form-ingredient-id").value = "";
    document.getElementById("ingr-form-ingredient-code").readOnly = false;

    // Populate Category selects inside form
    const categorySelect = document.getElementById(
      "ingr-form-ingredient-category",
    );
    categorySelect.innerHTML =
      `<option value="">-- Chọn danh mục --</option>` +
      window.ingredientState.categories
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join("");

    ingrModal.classList.add("active");
  };

  window.editIngredient = function (id) {
    const ingr = window.ingredientState.ingredients.find((i) => i.id === id);
    if (!ingr) return;

    document.getElementById("ingr-ingredient-modal-title").textContent =
      "Cập nhật Nguyên Liệu";
    document.getElementById("ingr-form-ingredient-id").value = ingr.id;

    const codeInput = document.getElementById("ingr-form-ingredient-code");
    codeInput.value = ingr.code;
    codeInput.readOnly = true;

    document.getElementById("ingr-form-ingredient-name").value = ingr.name;
    document.getElementById("ingr-form-ingredient-unit").value = ingr.unit;
    document.getElementById("ingr-form-ingredient-stock").value = ingr.stock;
    document.getElementById("ingr-form-ingredient-min-stock").value =
      ingr.minStock;
    document.getElementById("ingr-form-ingredient-expiry").value = ingr.expiry;
    document.getElementById("ingr-form-ingredient-price").value = ingr.price;

    const categorySelect = document.getElementById(
      "ingr-form-ingredient-category",
    );
    categorySelect.innerHTML = window.ingredientState.categories
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join("");
    categorySelect.value = ingr.categoryId;

    ingrModal.classList.add("active");
  };

  // Close ingredient modal
  const closeIngrBtn = document.getElementById("ingr-ingredient-modal-close");
  const cancelIngrBtn = document.getElementById(
    "ingr-ingredient-modal-cancel-btn",
  );
  const dismissIngrModal = () => ingrModal.classList.remove("active");
  if (closeIngrBtn) closeIngrBtn.onclick = dismissIngrModal;
  if (cancelIngrBtn) cancelIngrBtn.onclick = dismissIngrModal;

  // Submit ingredient form
  ingrForm.onsubmit = async function (e) {
    e.preventDefault();

    const id = document.getElementById("ingr-form-ingredient-id").value;
    const code = document.getElementById("ingr-form-ingredient-code").value;
    const name = document.getElementById("ingr-form-ingredient-name").value;
    const categoryId = document.getElementById(
      "ingr-form-ingredient-category",
    ).value;
    const unit = document.getElementById("ingr-form-ingredient-unit").value;
    const stock =
      parseFloat(document.getElementById("ingr-form-ingredient-stock").value) ||
      0;
    const minStock =
      parseFloat(
        document.getElementById("ingr-form-ingredient-min-stock").value,
      ) || 0;
    const expiry = document.getElementById("ingr-form-ingredient-expiry").value;
    const price =
      parseFloat(document.getElementById("ingr-form-ingredient-price").value) ||
      0;

    // Perform validation checks
    if (!code || !name || !categoryId || !unit || !expiry) {
      window.showToast(
        "Cảnh báo form",
        "Vui lòng nhập đầy đủ các trường thông tin bắt buộc.",
        "warning",
      );
      return;
    }

    const isNew = !id;
    const submitBtn = document.getElementById(
      "ingr-ingredient-modal-submit-btn",
    );
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...`;

    try {
      await fetch("/api/ingredients", {
        method: "POST",
        body: JSON.stringify({
          id,
          code,
          name,
          categoryId,
          unit,
          stock,
          minStock,
          expiry,
          price,
        }),
      });

      // Log activity
      await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          type: "CRUD",
          details: isNew
            ? "Khởi tạo nguyên liệu mới"
            : "Cập nhật thông số kỹ thuật nguyên liệu",
          ingredientId: code,
          qty: 0,
          user: "Nguyễn Minh Nam",
        }),
      });

      window.showToast(
        isNew ? "Thành công" : "Cập nhật thành công",
        isNew
          ? `Nguyên liệu '${name}' đã được thêm thành công.`
          : `Thông số nguyên liệu '${name}' đã được đồng bộ.`,
        "success",
      );

      dismissIngrModal();
      renderIngredients();
      renderGlobalSidebarAlerts();
    } catch (err) {
      window.showToast(
        "Lỗi hệ thống",
        "Có lỗi xảy ra khi kết nối máy chủ.",
        "error",
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Lưu nguyên liệu";
    }
  };

  window.deleteIngredient = async function (id) {
    const ingr = window.ingredientState.ingredients.find((i) => i.id === id);
    if (!ingr) return;

    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa nguyên liệu '${ingr.name}' (${ingr.code}) khỏi kho hệ thống?`,
      )
    )
      return;

    try {
      await fetch(`/api/ingredients?id=${id}`, { method: "DELETE" });
      window.showToast(
        "Xóa thành công",
        `Đã loại bỏ nguyên liệu '${ingr.name}' ra khỏi cơ sở dữ liệu.`,
        "success",
      );
      renderIngredients();
      renderGlobalSidebarAlerts();
    } catch (err) {
      window.showToast(
        "Lỗi kết nối",
        "Không thể xóa nguyên liệu do lỗi mạng.",
        "error",
      );
    }
  };

  // B. CATEGORIES CRUD
  const catModal = document.getElementById("ingr-category-crud-modal");
  const catForm = document.getElementById("ingr-category-form-element");

  document.getElementById("ingr-btn-add-category").onclick = function () {
    document.getElementById("ingr-category-modal-title").textContent =
      "Thêm Danh Mục Mới";
    catForm.reset();
    document.getElementById("ingr-form-category-id").value = "";

    // Reset color indicator
    const nativePicker = document.getElementById(
      "ingr-form-category-color-picker",
    );
    nativePicker.value = "#e88735";
    document.querySelectorAll(".ingr-preset-color-circle").forEach((c) => {
      if (c.getAttribute("data-color") === "#e88735") c.classList.add("active");
      else c.classList.remove("active");
    });

    catModal.classList.add("active");
  };

  window.editCategory = function (id) {
    const cat = window.ingredientState.categories.find((c) => c.id === id);
    if (!cat) return;

    document.getElementById("ingr-category-modal-title").textContent =
      "Cập nhật Danh Mục";
    document.getElementById("ingr-form-category-id").value = cat.id;
    document.getElementById("ingr-form-category-name").value = cat.name;
    document.getElementById("ingr-form-category-description").value =
      cat.description || "";

    const nativePicker = document.getElementById(
      "ingr-form-category-color-picker",
    );
    nativePicker.value = cat.color;

    document.querySelectorAll(".ingr-preset-color-circle").forEach((c) => {
      if (c.getAttribute("data-color") === cat.color) c.classList.add("active");
      else c.classList.remove("active");
    });

    catModal.classList.add("active");
  };

  // Close Category Modal
  const closeCatBtn = document.getElementById("ingr-category-modal-close");
  const cancelCatBtn = document.getElementById(
    "ingr-category-modal-cancel-btn",
  );
  const dismissCatModal = () => catModal.classList.remove("active");
  if (closeCatBtn) closeCatBtn.onclick = dismissCatModal;
  if (cancelCatBtn) cancelCatBtn.onclick = dismissCatModal;

  // Presets color picking binder
  document.querySelectorAll(".ingr-preset-color-circle").forEach((circle) => {
    circle.onclick = function () {
      document
        .querySelectorAll(".ingr-preset-color-circle")
        .forEach((c) => c.classList.remove("active"));
      circle.classList.add("active");
      document.getElementById("ingr-form-category-color-picker").value =
        circle.getAttribute("data-color");
    };
  });

  catForm.onsubmit = async function (e) {
    e.preventDefault();
    const id = document.getElementById("ingr-form-category-id").value;
    const name = document.getElementById("ingr-form-category-name").value;
    const color = document.getElementById(
      "ingr-form-category-color-picker",
    ).value;
    const description = document.getElementById(
      "ingr-form-category-description",
    ).value;

    if (!name) return;

    const isNew = !id;

    try {
      await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ id, name, color, description }),
      });

      window.showToast(
        isNew ? "Thêm danh mục thành công" : "Cập nhật thành công",
        `Danh mục '${name}' đã được lưu trữ trong danh sách nhóm.`,
        "success",
      );
      dismissCatModal();
      renderCategories();
    } catch (err) {
      window.showToast("Lỗi lưu trữ", "Có lỗi xảy ra.", "error");
    }
  };

  window.deleteCategory = async function (id) {
    const cat = window.ingredientState.categories.find((c) => c.id === id);
    if (!cat) return;

    // Check if contains ingredients
    const hasIngr = window.ingredientState.ingredients.some(
      (i) => i.categoryId === id,
    );
    if (hasIngr) {
      window.showToast(
        "Không thể xóa",
        "Danh mục này hiện chứa nguyên liệu hoạt động. Hãy chuyển nhóm nguyên liệu trước khi thực hiện.",
        "error",
      );
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục '${cat.name}'?`)) return;

    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      window.showToast("Xóa thành công", "Danh mục đã được xóa.", "success");
      renderCategories();
    } catch (err) {
      window.showToast("Lỗi hệ thống", "Có lỗi xảy ra.", "error");
    }
  };

  // C. SUPPLIER CRUD
  const supModal = document.getElementById("ingr-supplier-crud-modal");
  const supForm = document.getElementById("ingr-supplier-form-element");

  document.getElementById("ingr-btn-add-supplier").onclick = function () {
    document.getElementById("ingr-supplier-modal-title").textContent =
      "Thêm Nhà Cung Cấp Mới";
    supForm.reset();
    document.getElementById("ingr-form-supplier-id").value = "";
    supModal.classList.add("active");
  };

  window.editSupplier = function (id) {
    const sup = window.ingredientState.suppliers.find((s) => s.id === id);
    if (!sup) return;

    document.getElementById("ingr-supplier-modal-title").textContent =
      "Cập nhật Nhà Cung Cấp";
    document.getElementById("ingr-form-supplier-id").value = sup.id;
    document.getElementById("ingr-form-supplier-name").value = sup.name;
    document.getElementById("ingr-form-supplier-email").value = sup.email;
    document.getElementById("ingr-form-supplier-phone").value = sup.phone;
    document.getElementById("ingr-form-supplier-address").value = sup.address;

    supModal.classList.add("active");
  };

  // Close Supplier Modal
  const closeSupBtn = document.getElementById("ingr-supplier-modal-close");
  const cancelSupBtn = document.getElementById(
    "ingr-supplier-modal-cancel-btn",
  );
  const dismissSupModal = () => supModal.classList.remove("active");
  if (closeSupBtn) closeSupBtn.onclick = dismissSupModal;
  if (cancelSupBtn) cancelSupBtn.onclick = dismissSupModal;

  supForm.onsubmit = async function (e) {
    e.preventDefault();
    const id = document.getElementById("ingr-form-supplier-id").value;
    const name = document.getElementById("ingr-form-supplier-name").value;
    const email = document.getElementById("ingr-form-supplier-email").value;
    const phone = document.getElementById("ingr-form-supplier-phone").value;
    const address = document.getElementById("ingr-form-supplier-address").value;

    if (!name || !email || !phone || !address) return;

    const isNew = !id;

    try {
      await fetch("/api/suppliers", {
        method: "POST",
        body: JSON.stringify({ id, name, email, phone, address }),
      });

      window.showToast(
        isNew ? "Thêm NCC thành công" : "Cập nhật thành công",
        `Thông tin nhà cung cấp '${name}' đã được lưu trữ.`,
        "success",
      );
      dismissSupModal();
      renderSuppliers();
    } catch (err) {
      window.showToast("Lỗi hệ thống", "Có lỗi xảy ra.", "error");
    }
  };

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
