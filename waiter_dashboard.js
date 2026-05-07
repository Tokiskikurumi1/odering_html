/**
 * MOCK DATA
 * Dữ liệu giả lập để kiểm thử giao diện
 */

let mockTables = [
  { id: "T01", tableNumber: 1, guestCount: 4, status: "ready_to_serve" },
  { id: "T02", tableNumber: 2, guestCount: 2, status: "waiting" },
  { id: "T03", tableNumber: 3, guestCount: 0, status: "empty" },
  { id: "T04", tableNumber: 4, guestCount: 6, status: "cooking" },
  { id: "T05", tableNumber: 5, guestCount: 3, status: "ready_to_serve" },
  { id: "T06", tableNumber: 6, guestCount: 4, status: "completed" },
  { id: "T07", tableNumber: 7, guestCount: 2, status: "waiting" },
  { id: "T08", tableNumber: 8, guestCount: 8, status: "empty" }
];

let mockOrderItems = [
  // Bàn 1
  { id: "IT1", tableId: "T01", name: "Phở Bò Đặc Biệt", qty: 2, status: "ready", notes: "Nhiều bánh phở", time: "10:15 AM" },
  { id: "IT2", tableId: "T01", name: "Cơm Tấm Sườn Bì", qty: 2, status: "cooking", notes: "", time: "10:12 AM" },
  { id: "IT3", tableId: "T01", name: "Trà Đá", qty: 4, status: "served", notes: "Ít đá", time: "10:05 AM" },
  
  // Bàn 2
  { id: "IT4", tableId: "T02", name: "Bún Chả Hà Nội", qty: 2, status: "waiting", notes: "", time: "10:20 AM" },
  { id: "IT5", tableId: "T02", name: "Nem Rán", qty: 1, status: "waiting", notes: "", time: "10:20 AM" },
  
  // Bàn 4
  { id: "IT6", tableId: "T04", name: "Lẩu Thái Hải Sản", qty: 1, status: "cooking", notes: "Cay vừa", time: "10:00 AM" },
  { id: "IT7", tableId: "T04", name: "Bia Heineken", qty: 6, status: "served", notes: "", time: "10:05 AM" },
  
  // Bàn 5
  { id: "IT8", tableId: "T05", name: "Gỏi Cuốn", qty: 3, status: "ready", notes: "Không lấy tương đen", time: "10:25 AM" },
  { id: "IT9", tableId: "T05", name: "Sinh Tố Bơ", qty: 3, status: "ready", notes: "", time: "10:26 AM" }
];

// Trạng thái hiển thị tiếng Việt
const statusTextMap = {
  "empty": "Trống",
  "waiting": "Đang chờ",
  "cooking": "Đang nấu",
  "ready_to_serve": "Sẵn sàng",
  "ready": "Sẵn sàng",
  "served": "Đã phục vụ",
  "completed": "Hoàn thành"
};

/**
 * STATE MANAGEMENT
 */
let currentFilter = "all";
let currentSearch = "";
let selectedTableId = null;

// DOM Elements
const gridEl = document.getElementById('wt-table-grid');
const filterListEl = document.getElementById('wt-filter-list');
const searchInput = document.getElementById('wt-search-input');

const panelEl = document.getElementById('wt-detail-panel');
const overlayEl = document.getElementById('wt-detail-overlay');
const btnClosePanel = document.getElementById('wt-btn-close');
const btnServeAll = document.getElementById('wt-btn-serve-all');
const itemListEl = document.getElementById('wt-item-list');

/**
 * LOGIC CẬP NHẬT GIAO DIỆN
 */

// Hàm tính toán lại trạng thái của bàn dựa trên các món ăn
function updateTableStatuses() {
  mockTables.forEach(table => {
    const tableItems = mockOrderItems.filter(item => item.tableId === table.id);
    
    if (tableItems.length === 0) {
      if (table.status !== 'empty' && table.status !== 'completed') {
        table.status = 'empty';
      }
      return;
    }

    const hasReady = tableItems.some(item => item.status === 'ready');
    const hasCooking = tableItems.some(item => item.status === 'cooking');
    const hasWaiting = tableItems.some(item => item.status === 'waiting');
    const allServed = tableItems.every(item => item.status === 'served');

    if (allServed) {
      table.status = 'completed';
    } else if (hasReady) {
      table.status = 'ready_to_serve';
    } else if (hasCooking) {
      table.status = 'cooking';
    } else if (hasWaiting) {
      table.status = 'waiting';
    }
  });
}

// Lấy số lượng món đang sẵn sàng của một bàn
function getReadyItemsCount(tableId) {
  return mockOrderItems.filter(item => item.tableId === tableId && item.status === 'ready').length;
}

// Cập nhật số lượng trên các badge lọc
function updateFilterBadges() {
  const counts = {
    all: mockTables.length,
    ready_to_serve: 0,
    waiting: 0,
    cooking: 0,
    completed: 0
  };

  mockTables.forEach(table => {
    if (counts[table.status] !== undefined) {
      counts[table.status]++;
    }
  });

  document.getElementById('badge-all').innerText = counts.all;
  document.getElementById('badge-ready').innerText = counts.ready_to_serve;
  document.getElementById('badge-waiting').innerText = counts.waiting;
  document.getElementById('badge-cooking').innerText = counts.cooking;
  document.getElementById('badge-completed').innerText = counts.completed;
}

// Render lưới bàn
function renderTableGrid() {
  updateTableStatuses();
  updateFilterBadges();

  gridEl.innerHTML = '';

  const filteredTables = mockTables.filter(table => {
    const matchesFilter = currentFilter === 'all' || table.status === currentFilter;
    const matchesSearch = table.tableNumber.toString().includes(currentSearch);
    return matchesFilter && matchesSearch;
  });

  // Sắp xếp: Ưu tiên bàn Ready_to_serve lên đầu
  filteredTables.sort((a, b) => {
    if (a.status === 'ready_to_serve' && b.status !== 'ready_to_serve') return -1;
    if (a.status !== 'ready_to_serve' && b.status === 'ready_to_serve') return 1;
    return a.tableNumber - b.tableNumber;
  });

  filteredTables.forEach(table => {
    const readyCount = getReadyItemsCount(table.id);
    
    let badgeHtml = '';
    if (table.status === 'ready_to_serve' && readyCount > 0) {
      badgeHtml = `<div class="wt-card-badge"><i class="fa-solid fa-bell"></i> ${readyCount} món sẵn sàng</div>`;
    }

    const card = document.createElement('div');
    card.className = 'wt-table-card';
    card.dataset.status = table.status;
    card.onclick = () => openTableDetail(table.id);

    card.innerHTML = `
      <div class="wt-card-header">
        <div class="wt-table-number">${table.tableNumber}</div>
        <div class="wt-guest-count"><i class="fa-solid fa-user-group"></i> ${table.guestCount}</div>
      </div>
      <div class="wt-card-status ${table.status}">${statusTextMap[table.status] || table.status}</div>
      ${badgeHtml}
    `;
    
    gridEl.appendChild(card);
  });
}

// Mở panel chi tiết bàn
function openTableDetail(tableId) {
  selectedTableId = tableId;
  const table = mockTables.find(t => t.id === tableId);
  
  if (!table) return;

  document.getElementById('wt-detail-table-number').innerText = `Bàn ${table.tableNumber}`;
  document.getElementById('wt-detail-info').innerText = `${table.guestCount} khách | ${statusTextMap[table.status]}`;
  
  renderOrderItems();

  panelEl.classList.add('show');
  overlayEl.classList.add('show');
}

// Đóng panel
function closeTableDetail() {
  selectedTableId = null;
  panelEl.classList.remove('show');
  overlayEl.classList.remove('show');
}

// Render danh sách món ăn trong panel (Ưu tiên món Ready lên đầu)
function renderOrderItems() {
  if (!selectedTableId) return;

  const items = mockOrderItems.filter(item => item.tableId === selectedTableId);
  
  // Sắp xếp: Ready -> Cooking -> Waiting -> Served
  const statusWeight = { "ready": 1, "cooking": 2, "waiting": 3, "served": 4 };
  items.sort((a, b) => statusWeight[a.status] - statusWeight[b.status]);

  itemListEl.innerHTML = '';
  
  let hasReadyItems = false;

  if (items.length === 0) {
    itemListEl.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--wt-text-muted);">Bàn chưa gọi món</div>';
    btnServeAll.disabled = true;
    return;
  }

  items.forEach(item => {
    if (item.status === 'ready') hasReadyItems = true;

    const isServed = item.status === 'served';
    
    let noteHtml = item.notes ? `<div class="wt-item-notes">${item.notes}</div>` : '';
    
    const card = document.createElement('div');
    card.className = 'wt-item-card';
    card.dataset.status = item.status;
    
    card.innerHTML = `
      <div class="wt-item-info">
        <div class="wt-item-name">
          <span class="wt-item-qty">x${item.qty}</span>
          ${item.name}
        </div>
        ${noteHtml}
        <div style="display:flex; justify-content:space-between; margin-top: 8px;">
          <span class="wt-item-status-text ${item.status}">${statusTextMap[item.status]}</span>
          <span class="wt-item-time"><i class="fa-regular fa-clock"></i> ${item.time}</span>
        </div>
      </div>
      <div class="wt-item-action">
        <button class="wt-btn-serve ${isServed ? 'served' : ''}" 
                onclick="markAsServed('${item.id}', event)" 
                ${isServed || item.status === 'waiting' || item.status === 'cooking' ? 'disabled' : ''}>
          ${isServed ? '<i class="fa-solid fa-check"></i> Đã phục vụ' : 'Phục vụ'}
        </button>
      </div>
    `;
    
    itemListEl.appendChild(card);
  });

  // Enable button Serve All chỉ khi có món sẵn sàng
  btnServeAll.disabled = !hasReadyItems;
}

// Hành động: Đánh dấu một món là đã phục vụ
function markAsServed(itemId, event) {
  if (event) event.stopPropagation(); // Tránh click xuyên qua

  const item = mockOrderItems.find(i => i.id === itemId);
  if (item && item.status === 'ready') {
    item.status = 'served';
    renderOrderItems(); // Cập nhật lại list
    renderTableGrid();  // Cập nhật lại grid
  }
}

// Hành động: Đánh dấu TẤT CẢ món đang sẵn sàng thành đã phục vụ
function markAllReadyAsServed() {
  if (!selectedTableId) return;

  const items = mockOrderItems.filter(item => item.tableId === selectedTableId && item.status === 'ready');
  items.forEach(item => item.status = 'served');
  
  renderOrderItems();
  renderTableGrid();
}

/**
 * EVENT LISTENERS
 */

// Filter clicks
filterListEl.addEventListener('click', (e) => {
  const filterItem = e.target.closest('.wt-filter-item');
  if (!filterItem) return;

  // Xóa active cũ
  document.querySelectorAll('.wt-filter-item').forEach(el => el.classList.remove('active'));
  filterItem.classList.add('active');

  currentFilter = filterItem.dataset.filter;
  renderTableGrid();
});

// Search input
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value.trim();
  renderTableGrid();
});

// Overlay and Close button
overlayEl.addEventListener('click', closeTableDetail);
btnClosePanel.addEventListener('click', closeTableDetail);

// Button Serve All
btnServeAll.addEventListener('click', markAllReadyAsServed);

// Mô phỏng tương tác từ bếp (Demo Notification & Real-time change)
document.getElementById('btn-simulate-kitchen').addEventListener('click', () => {
  // Giả sử món của bàn 2 đã nấu xong
  const waitingItem = mockOrderItems.find(item => item.tableId === "T02" && item.status === "waiting");
  
  if (waitingItem) {
    waitingItem.status = "ready";
    
    // Show notification
    const notif = document.getElementById('wt-notification');
    notif.innerHTML = `<i class="fa-solid fa-bell"></i> <span>Bàn 2: <b>${waitingItem.name}</b> đã sẵn sàng!</span>`;
    notif.classList.add('show');
    
    setTimeout(() => {
      notif.classList.remove('show');
    }, 4000);

    renderTableGrid();
    
    // Nếu đang mở panel của bàn 2, cập nhật luôn
    if (selectedTableId === "T02") {
      renderOrderItems();
    }
  } else {
    alert("Bàn 2 không còn món nào đang chờ để mô phỏng. F5 lại trang để thử lại.");
  }
});

// Init
window.addEventListener('DOMContentLoaded', () => {
  renderTableGrid();
});
