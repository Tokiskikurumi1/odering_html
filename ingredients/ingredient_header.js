// ==========================================
// NOTIFICATION DATA
// ==========================================

const ingredientNotifications = [
  {
    id: "1",
    title: "Nguyên liệu sắp hết",
    message: "Ba chỉ bò Mỹ chỉ còn 5kg.",
    type: "warning",
    time: "5 phút trước",
    read: false,
  },
  {
    id: "2",
    title: "Phiếu nhập kho",
    message: "Đã tạo phiếu nhập kho PN001.",
    type: "success",
    time: "15 phút trước",
    read: false,
  },
  {
    id: "3",
    title: "Nguyên liệu hết hạn",
    message: "Xà lách thủy canh đã hết hạn.",
    type: "critical",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: "4",
    title: "Phiếu nhập kho",
    message: "Đã tạo phiếu nhập kho PN001.",
    type: "success",
    time: "15 phút trước",
    read: false,
  },
  {
    id: "5",
    title: "Nguyên liệu hết hạn",
    message: "Xà lách thủy canh đã hết hạn.",
    type: "critical",
    time: "1 giờ trước",
    read: false,
  },
];

// ==========================================
// INIT HEADER
// ==========================================

function initIngredientHeader() {
  console.log("Header Loaded");

  initHeaderSearch();
  initNotificationDropdown();

  renderGlobalHeaderNotifications();
}

// ==========================================
// SEARCH
// ==========================================

function initHeaderSearch() {
  const searchInput = document.getElementById("ingr-global-header-search");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.trim();

    console.log("Search:", keyword);

    // TODO:
    // gọi filter dữ liệu ở đây nếu cần
  });
}

// ==========================================
// NOTIFICATION DROPDOWN
// ==========================================

function initNotificationDropdown() {
  const trigger = document.getElementById(
    "ingr-notifications-dropdown-trigger",
  );

  const panel = document.getElementById("ingr-notifications-panel");

  if (!trigger || !panel) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    panel.classList.toggle("active");
  });

  panel.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    panel.classList.remove("active");
  });

  const clearBtn = document.getElementById("ingr-notifications-clear-btn");

  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      ingredientNotifications.forEach((n) => {
        n.read = true;
      });

      renderGlobalHeaderNotifications();

      if (typeof showToast === "function") {
        showToast("Thông báo", "Đã đánh dấu đọc tất cả thông báo.", "success");
      }
    });
  }
}

// ==========================================
// RENDER NOTIFICATIONS
// ==========================================

function renderGlobalHeaderNotifications() {
  const dropdown = document.getElementById("ingr-notifications-dropdown-list");

  const badge = document.getElementById("ingr-header-bell-count");

  if (!dropdown || !badge) return;

  const unreadCount = ingredientNotifications.filter((n) => !n.read).length;

  badge.textContent = unreadCount;

  if (unreadCount === 0) {
    badge.classList.add("hidden");
  } else {
    badge.classList.remove("hidden");
  }

  if (ingredientNotifications.length === 0) {
    dropdown.innerHTML = `
      <div
        style="
          text-align:center;
          padding:20px;
          color:#999;
        "
      >
        Chưa có thông báo nào
      </div>
    `;

    return;
  }

  dropdown.innerHTML = ingredientNotifications
    .map((n) => {
      let icon = "fa-circle-info";

      if (n.type === "critical" || n.type === "expired") {
        icon = "fa-triangle-exclamation";
      } else if (n.type === "warning") {
        icon = "fa-circle-exclamation";
      } else if (n.type === "success") {
        icon = "fa-circle-check";
      }

      return `
        <div
          class="ingr-notification-list-item ${n.read ? "" : "unread"}"
          data-id="${n.id}"
        >
          <div class="ingr-notification-item-icon ${n.type === "expired" || n.type === "critical" ? "critical" : n.type === "warning" ? "warning" : "success"}">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="ingr-notification-item-content">

            <span class="ingr-notification-item-title">
              ${n.title}
            </span>

            <span
              class="ingr-notification-item-title"
              style="
                font-size:12px;
                color:#94a3b8;
                margin-top:2px;
              "
            >
              ${n.message}
            </span>

            <span class="ingr-notification-item-time">
              ${n.time}
            </span>

          </div>

          
        </div>
      `;
    })
    .join("");

  bindNotificationEvents();
}

// ==========================================
// NOTIFICATION CLICK
// ==========================================

function bindNotificationEvents() {
  document.querySelectorAll(".ingr-notification-list-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;

      markNotificationRead(id);
    });
  });
}

function markNotificationRead(id) {
  const notification = ingredientNotifications.find((n) => n.id === id);

  if (!notification) return;

  notification.read = true;

  renderGlobalHeaderNotifications();
}
