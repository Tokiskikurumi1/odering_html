/**
 * TABLET ordering POS - JavaScript Controller
 * Built with strict isolated naming convention (prefixes everything with "tbl-")
 */

// --------------------------------------------------------------------------
// 1. GLOBAL STATE & MOCK DATA
// --------------------------------------------------------------------------

const DISHES_DATA = [
  // Món chính (main)
  {
    id: 'm1',
    name: 'Sườn Non Bò Mỹ Sốt Obathan',
    price: 415000,
    category: 'main',
    tag: 'bbq',
    image: 'images/1.PNG',
    isBest: true
  },
  {
    id: 'm2',
    name: 'Sườn Non Bò Mỹ LA Sốt Galbi 150g',
    price: 239000,
    category: 'main',
    tag: 'bbq',
    image: 'images/2.PNG',
    isSpicy: true
  },
  {
    id: 'm3',
    name: 'Dẻ Sườn Bò Mỹ Sốt Gogi (ALC)',
    price: 379000,
    category: 'main',
    tag: 'bbq',
    image: 'images/3.PNG'
  },
  {
    id: 'm4',
    name: 'Sườn Non Bò Mỹ Hảo Hạng Tươi 200g',
    price: 449000,
    category: 'main',
    tag: 'bbq',
    image: 'images/4.PNG',
    isBest: true
  },
  {
    id: 'm5',
    name: 'Bò Lúc Lắc Khoai Tây Chiên',
    price: 189000,
    category: 'main',
    tag: 'other',
    image: 'images/5.PNG'
  },
  {
    id: 'm6',
    name: 'Cơm Chiên Hải Sản Hoàng Bào',
    price: 125000,
    category: 'main',
    tag: 'other',
    image: 'images/6.PNG'
  },
  {
    id: 'm7',
    name: 'Lẩu Thái Hải Sản Chua Cay',
    price: 389000,
    category: 'main',
    tag: 'hotpot',
    image: 'images/1.PNG',
    isSpicy: true
  },
  {
    id: 'm8',
    name: 'Lẩu Nấm Thập Cẩm Đặc Biệt',
    price: 349000,
    category: 'main',
    tag: 'hotpot',
    image: 'images/2.PNG'
  },
  {
    id: 'm9',
    name: 'Lẩu Nấm Thập Cẩm Đặc Biệt',
    price: 349000,
    category: 'main',
    tag: 'hotpot',
    image: 'images/2.PNG'
  },{
    id: 'm10',
    name: 'Lẩu Nấm Thập Cẩm Đặc Biệt',
    price: 349000,
    category: 'main',
    tag: 'hotpot',
    image: 'images/2.PNG'
  },
  // Nước uống (drinks)
  {
    id: 'd1',
    name: 'Trà Sữa Trân Châu Đường Đen',
    price: 55000,
    category: 'drinks',
    tag: 'milk-tea',
    image: 'images/peanut.png',
    isBest: true
  },
  {
    id: 'd2',
    name: 'Trà Đào Cam Sả Mật Ong',
    price: 49000,
    category: 'drinks',
    tag: 'fruit-tea',
    image: 'images/choco-chips.png'
  },
  {
    id: 'd3',
    name: 'Trà Vải Nhãn Sen Vàng',
    price: 52000,
    category: 'drinks',
    tag: 'fruit-tea',
    image: 'images/oreo.webp'
  },
  {
    id: 'd4',
    name: 'Bia Heineken Silver Lon',
    price: 35000,
    category: 'drinks',
    tag: 'soft-drink',
    image: 'images/gem.png'
  },
  {
    id: 'd5',
    name: 'Bia Tiger Crystal Lon',
    price: 32000,
    category: 'drinks',
    tag: 'soft-drink',
    image: 'images/gem.png'
  },
  {
    id: 'd6',
    name: 'Coca Cola Không Đường',
    price: 22000,
    category: 'drinks',
    tag: 'soft-drink',
    image: 'images/gem.png'
  },
  
  // Tráng miệng (desserts)
  {
    id: 'de1',
    name: 'Kem Vani Sốt Dâu Tây',
    price: 45000,
    category: 'desserts',
    tag: 'ice-cream',
    image: 'images/cookie.webp',
    isBest: true
  },
  {
    id: 'de2',
    name: 'Bánh Mousse Matcha Tươi',
    price: 59000,
    category: 'desserts',
    tag: 'cake',
    image: 'images/frosted-sugar.webp'
  },
  {
    id: 'de3',
    name: 'Bánh Tiramisu Socola Ý',
    price: 65000,
    category: 'desserts',
    tag: 'cake',
    image: 'images/oreo.webp'
  },
  {
    id: 'de4',
    name: 'Chè Dưỡng Nhan Hạt Chia',
    price: 48000,
    category: 'desserts',
    tag: 'sweet-soup',
    image: 'images/peanut.png'
  }
];

// App State
const tblState = {
  cart: [],
  currentTab: 'main',
  searchQuery: { main: '', drinks: '', desserts: '' },
  activeTag: { main: 'all', drinks: 'all', desserts: 'all' },
  sortBy: { main: 'default', drinks: 'default', desserts: 'default' },
  currentPage: { main: 1, drinks: 1, desserts: 1 },
  itemsPerPage: 9,
  notifications: [],
  unreadNotifications: false
};

// --------------------------------------------------------------------------
// 2. PAGE INITIALIZATION
// --------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  loadAllComponents();
  startClock();
});

async function loadAllComponents() {
  try {
    // 1. Fetch Sidebar
    const sidebarResponse = await fetch('tbl_sidebar.html');
    if (sidebarResponse.ok) {
      document.getElementById('tbl-sidebar-left-placeholder').innerHTML = await sidebarResponse.text();
    }

    // 2. Fetch Cart
    const cartResponse = await fetch('tbl_cart.html');
    if (cartResponse.ok) {
      document.getElementById('tbl-sidebar-right-placeholder').innerHTML = await cartResponse.text();
    }

    // 3. Fetch Tab views
    const centerPlaceholder = document.getElementById('tbl-center-content-placeholder');
    if (centerPlaceholder) {
      const mainTabHTML = await (await fetch('tbl_tab_main.html')).text();
      const drinksTabHTML = await (await fetch('tbl_tab_drinks.html')).text();
      const dessertsTabHTML = await (await fetch('tbl_tab_desserts.html')).text();
      const notificationsTabHTML = await (await fetch('tbl_tab_notifications.html')).text();

      centerPlaceholder.innerHTML = `
        <div id="tbl-panel-main" class="tbl-tab-panel" style="display: block;">${mainTabHTML}</div>
        <div id="tbl-panel-drinks" class="tbl-tab-panel" style="display: none;">${drinksTabHTML}</div>
        <div id="tbl-panel-desserts" class="tbl-tab-panel" style="display: none;">${dessertsTabHTML}</div>
        <div id="tbl-panel-notifications" class="tbl-tab-panel" style="display: none;">${notificationsTabHTML}</div>
      `;
    }

    initAppLogic();
  } catch (error) {
    console.error("Error loading components:", error);
  }
}

function initAppLogic() {
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
  
  renderDishes('main');
  renderCart();
}

function updateItemsPerPage() {
  const width = window.innerWidth;
  if (width >= 768) {
    tblState.itemsPerPage = 9;
  } else {
    tblState.itemsPerPage = 8;
  }
  
  if (tblState.currentTab !== 'notifications') {
    renderDishes(tblState.currentTab);
  }
}

// --------------------------------------------------------------------------
// 3. HEADER UTILITIES
// --------------------------------------------------------------------------

function startClock() {
  const clockElement = document.getElementById('tbl-header-clock');
  function updateTime() {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// --------------------------------------------------------------------------
// 4. TAB SWITCHING
// --------------------------------------------------------------------------

window.switchCategoryTab = function(category) {
  tblState.currentTab = category;

  const buttons = document.querySelectorAll('.tbl-sidebar-menu-btn');
  buttons.forEach(btn => btn.classList.remove('tbl-sidebar-menu-btn-active'));
  
  const activeBtn = document.getElementById(`tbl-tab-btn-${category}`);
  if (activeBtn) activeBtn.classList.add('tbl-sidebar-menu-btn-active');

  const panels = ['main', 'drinks', 'desserts', 'notifications'];
  panels.forEach(p => {
    const panelDom = document.getElementById(`tbl-panel-${p}`);
    if (panelDom) {
      panelDom.style.display = (p === category) ? 'block' : 'none';
    }
  });

  if (category !== 'notifications') {
    renderDishes(category);
  }
};

// --------------------------------------------------------------------------
// 5. FILTERING & SORTING
// --------------------------------------------------------------------------

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str.toLowerCase().trim();
}

window.handleSearch = function(category) {
  const searchInput = document.getElementById(`tbl-search-${category}`);
  if (searchInput) {
    tblState.searchQuery[category] = searchInput.value;
    tblState.currentPage[category] = 1;
    renderDishes(category);
  }
};

window.handleFilterChange = function(category) {
  const filterSelect = document.getElementById(`tbl-filter-${category}`);
  if (filterSelect) {
    tblState.activeTag[category] = filterSelect.value;
    tblState.currentPage[category] = 1;
    renderDishes(category);
  }
};

window.handleSort = function(category) {
  const sortSelect = document.getElementById(`tbl-sort-${category}`);
  if (sortSelect) {
    tblState.sortBy[category] = sortSelect.value;
    tblState.currentPage[category] = 1;
    renderDishes(category);
  }
};

// --------------------------------------------------------------------------
// 6. RENDER DISHES WITH PAGINATION
// --------------------------------------------------------------------------

function renderDishes(category) {
  const gridContainer = document.getElementById(`tbl-grid-${category}`);
  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  // Filter items
  let items = DISHES_DATA.filter(dish => dish.category === category);

  const activeTag = tblState.activeTag[category];
  if (activeTag !== 'all') {
    items = items.filter(dish => dish.tag === activeTag);
  }

  const rawSearch = tblState.searchQuery[category];
  if (rawSearch && rawSearch.trim() !== '') {
    const cleanQuery = removeVietnameseTones(rawSearch);
    items = items.filter(dish => {
      const cleanName = removeVietnameseTones(dish.name);
      return cleanName.includes(cleanQuery);
    });
  }

  // Sort items
  const activeSort = tblState.sortBy[category];
  if (activeSort === 'price-asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-desc') {
    items.sort((a, b) => b.price - a.price);
  } else if (activeSort === 'name-asc') {
    items.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }

  // Pagination
  const totalItems = items.length;
  const itemsPerPage = tblState.itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = tblState.currentPage[category];
  
  if (currentPage > totalPages && totalPages > 0) {
    tblState.currentPage[category] = totalPages;
  }
  
  const startIndex = (tblState.currentPage[category] - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = items.slice(startIndex, endIndex);

  // Render
  if (pageItems.length === 0) {
    gridContainer.innerHTML = `
      <div class="tbl-grid-empty-message">
        <i class="fa-solid fa-cookie-bite"></i>
        <p>Không tìm thấy món phù hợp</p>
        <small>Thử thay đổi từ khóa tìm kiếm hoặc lọc danh mục khác.</small>
      </div>
    `;
    hidePagination(category);
    return;
  }

  pageItems.forEach(dish => {
    const card = document.createElement('div');
    card.className = 'tbl-dish-card';

    let badgeHtml = '';
    if (dish.isBest) {
      badgeHtml += `<span class="tbl-dish-badge tbl-dish-badge-best"><i class="fa-solid fa-star"></i> Bán chạy</span>`;
    }
    if (dish.isSpicy) {
      badgeHtml += `<span class="tbl-dish-badge tbl-dish-badge-spicy"><i class="fa-solid fa-pepper-hot"></i> Cay</span>`;
    }

    card.innerHTML = `
      <div class="tbl-dish-image-wrapper">
        <div class="tbl-dish-badge-container">
          ${badgeHtml}
        </div>
        <img class="tbl-dish-image" src="${dish.image}" alt="${dish.name}" onerror="this.src='images/1.PNG'">
      </div>
      <div class="tbl-dish-info">
        <h4 class="tbl-dish-name">${dish.name}</h4>
        <div class="tbl-dish-footer">
          <span class="tbl-dish-price">${formatVNCurrency(dish.price)}</span>
          <button type="button" class="tbl-dish-add-btn" onclick="addToCart('${dish.id}')" title="Thêm vào giỏ">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;

    gridContainer.appendChild(card);
  });

  if (totalPages > 1) {
    renderPagination(category, currentPage, totalPages);
  } else {
    hidePagination(category);
  }
}

function renderPagination(category, currentPage, totalPages) {
  const paginationWrapper = document.getElementById(`tbl-pagination-${category}`);
  const paginationInfo = document.getElementById(`tbl-pagination-info-${category}`);
  const paginationNumbers = document.getElementById(`tbl-pagination-numbers-${category}`);
  const prevBtn = document.getElementById(`tbl-pagination-prev-${category}`);
  const nextBtn = document.getElementById(`tbl-pagination-next-${category}`);

  if (!paginationWrapper) return;

  paginationWrapper.style.display = 'flex';
  paginationInfo.textContent = `Trang ${currentPage} / ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  paginationNumbers.innerHTML = '';
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tbl-pagination-btn' + (i === currentPage ? ' tbl-pagination-btn-active' : '');
      btn.textContent = i;
      btn.onclick = () => goToPage(category, i);
      paginationNumbers.appendChild(btn);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      const dots = document.createElement('span');
      dots.className = 'tbl-pagination-dots';
      dots.textContent = '...';
      paginationNumbers.appendChild(dots);
    }
  }
}

function hidePagination(category) {
  const paginationWrapper = document.getElementById(`tbl-pagination-${category}`);
  if (paginationWrapper) {
    paginationWrapper.style.display = 'none';
  }
}

window.changePage = function(category, delta) {
  const newPage = tblState.currentPage[category] + delta;
  const totalItems = DISHES_DATA.filter(dish => dish.category === category).length;
  const totalPages = Math.ceil(totalItems / tblState.itemsPerPage);
  
  if (newPage >= 1 && newPage <= totalPages) {
    tblState.currentPage[category] = newPage;
    renderDishes(category);
  }
};

function goToPage(category, pageNum) {
  tblState.currentPage[category] = pageNum;
  renderDishes(category);
}

function formatVNCurrency(price) {
  return price.toLocaleString('vi-VN') + '₫';
}

// --------------------------------------------------------------------------
// 7. CART MANAGEMENT
// --------------------------------------------------------------------------

window.addToCart = function(dishId) {
  const existingItem = tblState.cart.find(item => item.dishId === dishId);
  const dishInfo = DISHES_DATA.find(d => d.id === dishId);
  
  if (!dishInfo) return;

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    tblState.cart.push({ dishId: dishId, qty: 1 });
  }

  renderCart();
  showToast(`Đã thêm: ${dishInfo.name}`, "success");
  
  // Không tự động mở giỏ hàng nữa
  // if (window.innerWidth <= 1024) {
  //   setTimeout(() => openCart(), 300);
  // }
};

window.adjustCartQty = function(dishId, delta) {
  const cartItem = tblState.cart.find(item => item.dishId === dishId);
  if (!cartItem) return;

  cartItem.qty += delta;

  if (cartItem.qty <= 0) {
    tblState.cart = tblState.cart.filter(item => item.dishId !== dishId);
  }

  renderCart();
};

function renderCart() {
  const listContainer = document.getElementById('tbl-cart-items-list');
  const countBadge = document.getElementById('tbl-cart-count');
  const subtotalEl = document.getElementById('tbl-cart-subtotal');
  const taxEl = document.getElementById('tbl-cart-tax');
  const grandTotalEl = document.getElementById('tbl-cart-total-price');
  const sendBtn = document.getElementById('tbl-btn-submit-kitchen');
  const toggleCount = document.getElementById('tbl-cart-toggle-count');

  if (!listContainer) return;

  listContainer.innerHTML = '';

  if (tblState.cart.length === 0) {
    listContainer.innerHTML = `
      <div class="tbl-cart-empty-state">
        <i class="fa-solid fa-receipt"></i>
        <p>Chưa có món nào trong giỏ</p>
        <small>Vui lòng chọn món ngon từ thực đơn bên trái để thêm vào giỏ hàng.</small>
      </div>
    `;
    
    countBadge.textContent = '0 món';
    if (toggleCount) toggleCount.textContent = '0';
    subtotalEl.textContent = '0₫';
    taxEl.textContent = '0₫';
    grandTotalEl.textContent = '0₫';
    if (sendBtn) sendBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  let totalCount = 0;

  tblState.cart.forEach(item => {
    const dish = DISHES_DATA.find(d => d.id === item.dishId);
    if (!dish) return;

    subtotal += dish.price * item.qty;
    totalCount += item.qty;

    const itemCard = document.createElement('div');
    itemCard.className = 'tbl-cart-item-card';
    itemCard.innerHTML = `
      <div class="tbl-cart-item-info">
        <div class="tbl-cart-item-name">${dish.name}</div>
        <div class="tbl-cart-item-price">${formatVNCurrency(dish.price)}</div>
      </div>
      <div class="tbl-cart-item-actions">
        <button type="button" class="tbl-cart-btn-qty-adj" onclick="adjustCartQty('${dish.id}', -1)">
          <i class="fa-solid fa-minus"></i>
        </button>
        <span class="tbl-cart-item-qty-val">${item.qty}</span>
        <button type="button" class="tbl-cart-btn-qty-adj" onclick="adjustCartQty('${dish.id}', 1)">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    `;

    listContainer.appendChild(itemCard);
  });

  const tax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + tax;

  countBadge.textContent = `${totalCount} món`;
  if (toggleCount) toggleCount.textContent = totalCount;
  subtotalEl.textContent = formatVNCurrency(subtotal);
  taxEl.textContent = formatVNCurrency(tax);
  grandTotalEl.textContent = formatVNCurrency(grandTotal);
  if (sendBtn) sendBtn.disabled = false;
}

window.submitOrderToKitchen = function() {
  if (tblState.cart.length === 0) return;
  
  const timestamp = new Date();
  const timeString = timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Add all cart items into notifications as pending (chờ xác nhận)
  tblState.cart.forEach(item => {
    const dish = DISHES_DATA.find(d => d.id === item.dishId);
    if (dish) {
      const newNotif = {
        id: Date.now() + Math.random(),
        dishName: dish.name,
        qty: item.qty,
        status: 'pending', // Chờ xác nhận
        time: timeString
      };
      
      // Prepend to show newest first
      tblState.notifications.unshift(newNotif);
      
      // Simulate real-time progress update for this item
      simulateKitchenCookCycle(newNotif.id);
    }
  });

  // Clear cart and show toast
  tblState.cart = [];
  renderCart();
  showToast("Đơn hàng đã gửi, đang chờ bếp xác nhận!", "success");

  // Show a notification badge dot if user is not in the notification tab
  if (tblState.currentTab !== 'notifications') {
    tblState.unreadNotifications = true;
    const badge = document.getElementById('tbl-notif-badge-dot');
    if (badge) badge.style.display = 'block';
  } else {
    renderNotifications();
  }
};

window.requestCheckout = function() {
  // Clear notifications history when checkout
  tblState.notifications = [];
  
  // Clear unread badge
  tblState.unreadNotifications = false;
  const badge = document.getElementById('tbl-notif-badge-dot');
  if (badge) badge.style.display = 'none';
  
  // Re-render notifications if on that tab
  if (tblState.currentTab === 'notifications') {
    renderNotifications();
  }
  
  showToast("Đã gửi yêu cầu thanh toán tới quầy thu ngân!", "success");
};

// --------------------------------------------------------------------------
// 8. KITCHEN NOTIFICATIONS SIMULATION
// --------------------------------------------------------------------------

let activeNotificationFilter = 'all';

window.filterNotifications = function(status, buttonDom) {
  // Update button active state
  const siblingBtns = buttonDom.parentNode.querySelectorAll('.tbl-notif-filter-btn');
  siblingBtns.forEach(btn => btn.classList.remove('tbl-notif-filter-btn-active'));
  buttonDom.classList.add('tbl-notif-filter-btn-active');

  activeNotificationFilter = status;
  renderNotifications();
};

window.cancelDish = function(notifId) {
  const notif = tblState.notifications.find(n => n.id === notifId);
  if (!notif) return;
  
  notif.status = 'cancelled';
  renderNotifications();
  showToast(`Đã hủy món: ${notif.dishName}`, "info");
};

function renderNotifications() {
  const notifContainer = document.getElementById('tbl-notifications-list');
  if (!notifContainer) return;

  notifContainer.innerHTML = '';

  let filtered = tblState.notifications;
  if (activeNotificationFilter !== 'all') {
    filtered = tblState.notifications.filter(n => n.status === activeNotificationFilter);
  }

  if (filtered.length === 0) {
    notifContainer.innerHTML = `
      <div class="tbl-notif-empty-state">
        <i class="fa-solid fa-comment-slash"></i>
        <p>Không có thông báo phù hợp</p>
        <small>Lịch sử cập nhật món sẽ xuất hiện tại đây khi bếp hoạt động.</small>
      </div>
    `;
    return;
  }

  filtered.forEach(notif => {
    const card = document.createElement('div');
    card.className = `tbl-notif-card-item tbl-notif-status-${notif.status}`;

    let iconClass = 'fa-fire-burner';
    let statusText = 'Đang làm';
    let msgText = `Đang chế biến <strong>x${notif.qty} ${notif.dishName}</strong>`;
    let actionBtn = '';

    if (notif.status === 'pending') {
      iconClass = 'fa-clock';
      statusText = 'Chờ xác nhận';
      msgText = `Món <strong>x${notif.qty} ${notif.dishName}</strong> đang chờ bếp xác nhận`;
      actionBtn = `<button type="button" class="tbl-notif-cancel-btn" onclick="cancelDish(${notif.id})" title="Hủy món">
        <i class="fa-solid fa-xmark"></i>
      </button>`;
    } else if (notif.status === 'cooking') {
      iconClass = 'fa-fire-burner';
      statusText = 'Đang làm';
      msgText = `Đang chế biến <strong>x${notif.qty} ${notif.dishName}</strong>`;
    } else if (notif.status === 'ready') {
      iconClass = 'fa-bell';
      statusText = 'Chờ phục vụ';
      msgText = `Món <strong>x${notif.qty} ${notif.dishName}</strong> đã hoàn thành, đang chờ giao!`;
    } else if (notif.status === 'served') {
      iconClass = 'fa-circle-check';
      statusText = 'Đã giao';
      msgText = `Đã giao xong món <strong>x${notif.qty} ${notif.dishName}</strong> tại bàn. Chúc ngon miệng!`;
    } else if (notif.status === 'cancelled') {
      iconClass = 'fa-ban';
      statusText = 'Đã hủy';
      msgText = `Món <strong>x${notif.qty} ${notif.dishName}</strong> đã bị hủy`;
    }

    card.innerHTML = `
      <div class="tbl-notif-icon-badge tbl-notif-icon-${notif.status}">
        <i class="fa-solid ${iconClass}"></i>
      </div>
      <div class="tbl-notif-card-body">
        <h4 class="tbl-notif-card-title">${statusText}</h4>
        <div class="tbl-notif-card-msg">${msgText}</div>
        <div class="tbl-notif-card-meta">
          <span class="tbl-notif-card-time"><i class="fa-regular fa-clock"></i> ${notif.time}</span>
          <span class="tbl-notif-status-tag tbl-tag-${notif.status}">${statusText}</span>
        </div>
      </div>
      ${actionBtn}
    `;

    notifContainer.appendChild(card);
  });
}

/**
 * Simulate food preparation and delivery times
 */
function simulateKitchenCookCycle(notifId) {
  // Phase 0: Pending -> Cooking (takes 10 seconds - bếp xác nhận)
  setTimeout(() => {
    const notif = tblState.notifications.find(n => n.id === notifId);
    if (!notif || notif.status === 'cancelled') return;

    notif.status = 'cooking';
    showToast(`Bếp đã xác nhận món: ${notif.dishName}`, "info");
    
    if (tblState.currentTab === 'notifications') {
      renderNotifications();
    }

    // Phase 1: Cooking -> Ready (takes 12-15 seconds)
    setTimeout(() => {
      const cookingNotif = tblState.notifications.find(n => n.id === notifId);
      if (!cookingNotif || cookingNotif.status === 'cancelled') return;

      cookingNotif.status = 'ready';
      showToast(`Món: ${cookingNotif.dishName} đã xong!`, "info");
      
      // Highlight sidebar badge dot
      if (tblState.currentTab !== 'notifications') {
        tblState.unreadNotifications = true;
        const badge = document.getElementById('tbl-notif-badge-dot');
        if (badge) badge.style.display = 'block';
      } else {
        renderNotifications();
      }

      // Phase 2: Ready -> Served (takes another 10 seconds)
      setTimeout(() => {
        const servedNotif = tblState.notifications.find(n => n.id === notifId);
        if (!servedNotif || servedNotif.status === 'cancelled') return;

        servedNotif.status = 'served';
        if (tblState.currentTab === 'notifications') {
          renderNotifications();
        }
      }, 10000);

    }, 14000);

  }, 10000);
}

// --------------------------------------------------------------------------
// 9. CART TOGGLE (MOBILE/TABLET)
// --------------------------------------------------------------------------

window.toggleCart = function() {
  const cartContainer = document.getElementById('tbl-sidebar-right-placeholder');
  const overlay = document.getElementById('tbl-cart-overlay');
  
  if (!cartContainer || !overlay) return;
  
  const isOpen = cartContainer.classList.contains('tbl-cart-open');
  
  if (isOpen) {
    closeCart();
  } else {
    openCart();
  }
};

function openCart() {
  const cartContainer = document.getElementById('tbl-sidebar-right-placeholder');
  const overlay = document.getElementById('tbl-cart-overlay');
  
  if (!cartContainer || !overlay) return;
  
  cartContainer.classList.add('tbl-cart-open');
  overlay.classList.add('tbl-cart-overlay-active');
}

window.closeCart = function() {
  const cartContainer = document.getElementById('tbl-sidebar-right-placeholder');
  const overlay = document.getElementById('tbl-cart-overlay');
  
  if (!cartContainer || !overlay) return;
  
  cartContainer.classList.remove('tbl-cart-open');
  overlay.classList.remove('tbl-cart-overlay-active');
};

// --------------------------------------------------------------------------
// 9. TOAST NOTIFICATIONS
// --------------------------------------------------------------------------

function showToast(message, type = "info") {
  const toastContainer = document.getElementById('tbl-toast-container');
  if (!toastContainer) return;

  const activeToasts = toastContainer.querySelectorAll('.tbl-toast:not(.tbl-toast-hiding)');
  
  if (activeToasts.length >= 3) {
    const oldestToast = activeToasts[0];
    oldestToast.classList.add('tbl-toast-hiding');
    setTimeout(() => oldestToast.remove(), 300);
  }

  const toast = document.createElement('div');
  toast.className = 'tbl-toast';

  const iconClass = type === "success" ? "fa-circle-check tbl-toast-icon-success" : "fa-circle-info tbl-toast-icon-info";
  
  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('tbl-toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 300);
    }
  }, 3200);
}
