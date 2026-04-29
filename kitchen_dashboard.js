document.addEventListener("DOMContentLoaded", async () => {
    // ==========================================================================
    // LOAD COMPONENTS
    // ==========================================================================
    const components = [
        { id: "kitchen-sidebar-placeholder", url: "ktch_sidebar.html" },
        { id: "kitchen-tab-orders-placeholder", url: "ktch_tab_orders.html" },
        { id: "kitchen-tab-inventory-placeholder", url: "ktch_tab_inventory.html" }
    ];

    for (const comp of components) {
        try {
            const response = await fetch(comp.url);
            if (response.ok) {
                const html = await response.text();
                const placeholder = document.getElementById(comp.id);
                if (placeholder) placeholder.outerHTML = html;
            }
        } catch (e) {
            console.error("Error loading " + comp.url, e);
        }
    }

    initKitchenDashboard();
});

function initKitchenDashboard() {
    // ==========================================================================
    // GLOBAL STATE & MOCK DATA
    // ==========================================================================
    window.kitchenState = {
        tables: [
            { id: 'T1', name: 'Bàn 1' },
            { id: 'T2', name: 'Bàn 2' },
            { id: 'T3', name: 'Bàn 3' },
            { id: 'T4', name: 'Bàn 4' }
        ],
        inventory: [
            { id: 'ing_suonbo', name: 'Sườn Non Bò Mỹ', stock: 15, icon: 'fa-drumstick-bite', unit: 'kg' },
            { id: 'ing_nam', name: 'Nấm Tổng Hợp', stock: 8, icon: 'fa-carrot', unit: 'kg' },
            { id: 'ing_combo', name: 'Combo Đặc Biệt', stock: 12, icon: 'fa-fire', unit: 'g' },
            { id: 'ing_nuoc', name: 'Nước Lẩu Cà Chua', stock: 50, icon: 'fa-water', unit: 'chai' },
            { id: 'ing_bia', name: 'Bia Heineken', stock: 100, icon: 'fa-beer-mug-empty', unit: 'lon' },
            { id: 'ing_rau_muong', name: 'Rau Muống', stock: 20, icon: 'fa-leaf', unit: 'kg' },
            { id: 'ing_tom', name: 'Tôm Sú', stock: 5, icon: 'fa-shrimp', unit: 'kg' },
            { id: 'ing_muc', name: 'Mực Trứng', stock: 3, icon: 'fa-fish', unit: 'kg' },
            { id: 'ing_dau_hu', name: 'Đậu Hũ Tươi', stock: 30, icon: 'fa-cube', unit: 'kg' },
            { id: 'ing_mi', name: 'Mì Trứng', stock: 45, icon: 'fa-bowl-rice', unit: 'g' },
            { id: 'ing_trung', name: 'Trứng Gà', stock: 60, icon: 'fa-egg', unit: 'g' },
            { id: 'ing_sa_te', name: 'Sa Tế', stock: 10, icon: 'fa-pepper-hot', unit: 'g' },
            { id: 'ing_chanh', name: 'Chanh Tươi', stock: 15, icon: 'fa-lemon', unit: 'kg' },
            { id: 'ing_ot', name: 'Ớt Hiểm', stock: 2, icon: 'fa-pepper-hot', unit: 'kg' },
            { id: 'ing_toi', name: 'Tỏi Lý Sơn', stock: 7, icon: 'fa-clove', unit: 'kg' }
        ],
        orders: [
            // Bàn 1 (3 món) - Batch 1
            { id: 1, batchId: 'b1', tableId: 'T1', itemName: 'Sườn Non Bò Mỹ', qty: 3, status: 'cooking', timestamp: Date.now() - 600000, isNew: false, ingredientId: 'ing_suonbo' },
            { id: 2, batchId: 'b1', tableId: 'T1', itemName: 'Nấm Tổng Hợp', qty: 2, status: 'cooking', timestamp: Date.now() - 500000, isNew: false, ingredientId: 'ing_nam' },
            { id: 3, batchId: 'b1', tableId: 'T1', itemName: 'Nước Lẩu Cà Chua', qty: 1, status: 'pending', timestamp: Date.now() - 400000, isNew: false, ingredientId: 'ing_nuoc' },
            // Bàn 2 (2 món) - Batch 2
            { id: 4, batchId: 'b2', tableId: 'T2', itemName: 'Combo Đặc Biệt', qty: 1, status: 'pending', timestamp: Date.now() - 200000, isNew: false, ingredientId: 'ing_combo' },
            { id: 5, batchId: 'b2', tableId: 'T2', itemName: 'Sườn Non Bò Mỹ', qty: 1, status: 'pending', timestamp: Date.now() - 120000, isNew: false, ingredientId: 'ing_suonbo' },
            // Bàn 3 (3 món) - Batch 3 (Lần 1)
            { id: 6, batchId: 'b3', tableId: 'T3', itemName: 'Sườn Non Bò Mỹ', qty: 2, status: 'cooking', timestamp: Date.now() - 1500000, isNew: false, ingredientId: 'ing_suonbo' },
            { id: 7, batchId: 'b3', tableId: 'T3', itemName: 'Nấm Tổng Hợp', qty: 1, status: 'cooking', timestamp: Date.now() - 1500000, isNew: false, ingredientId: 'ing_nam' },
            { id: 8, batchId: 'b3', tableId: 'T3', itemName: 'Nước Lẩu Cà Chua', qty: 1, status: 'cooking', timestamp: Date.now() - 1500000, isNew: false, ingredientId: 'ing_nuoc' },
            // Bàn 3 (1 món) - Batch 4 (Lần 2)
            { id: 9, batchId: 'b4', tableId: 'T3', itemName: 'Combo Đặc Biệt', qty: 1, status: 'pending', timestamp: Date.now() - 100000, isNew: false, ingredientId: 'ing_combo' },
            // Bàn 4 (5 món) - Batch 5 (Đơn dài để test thanh cuộn)
            { id: 10, batchId: 'b5', tableId: 'T4', itemName: 'Sườn Non Bò Mỹ', qty: 1, status: 'pending', timestamp: Date.now() - 50000, isNew: false, ingredientId: 'ing_suonbo' },
            { id: 11, batchId: 'b5', tableId: 'T4', itemName: 'Nấm Tổng Hợp', qty: 1, status: 'pending', timestamp: Date.now() - 50000, isNew: false, ingredientId: 'ing_nam' },
            { id: 12, batchId: 'b5', tableId: 'T4', itemName: 'Nước Lẩu Cà Chua', qty: 1, status: 'pending', timestamp: Date.now() - 50000, isNew: false, ingredientId: 'ing_nuoc' },
            { id: 13, batchId: 'b5', tableId: 'T4', itemName: 'Combo Đặc Biệt', qty: 1, status: 'pending', timestamp: Date.now() - 50000, isNew: false, ingredientId: 'ing_combo' },
            { id: 14, batchId: 'b5', tableId: 'T4', itemName: 'Sườn Non Bò Mỹ (Thêm)', qty: 1, status: 'pending', timestamp: Date.now() - 50000, isNew: false, ingredientId: 'ing_suonbo' }
        ]
    };

    // ==========================================================================
    // GLOBAL UTILS
    // ==========================================================================
    window.playNotificationSound = function () {
        const audio = document.getElementById('kitchen-notification-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Trình duyệt chặn autoplay âm thanh", e));
        }
    };

    window.formatTime = function (ms) {
        const date = new Date(ms);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    // Clock
    const timeDisplay = document.getElementById('kitchen-current-time');
    function updateClock() {
        const now = new Date();
        if (timeDisplay) {
            timeDisplay.textContent = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ==========================================================================
    // INITIALIZE SUB-MODULES
    // ==========================================================================
    if (typeof window.initKitchenSidebar === 'function') window.initKitchenSidebar();
    if (typeof window.initKitchenOrdersTab === 'function') window.initKitchenOrdersTab();
    if (typeof window.initKitchenInventoryTab === 'function') window.initKitchenInventoryTab();
}
