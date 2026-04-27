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
            { id: 'T3', name: 'Bàn 3' }
        ],
        inventory: [
            { id: 'ing_suonbo', name: 'Sườn Non Bò Mỹ', stock: 15, icon: 'fa-drumstick-bite' },
            { id: 'ing_nam', name: 'Nấm Tổng Hợp', stock: 8, icon: 'fa-carrot' }, // Initially <= 10 for warning demo
            { id: 'ing_combo', name: 'Combo Đặc Biệt', stock: 12, icon: 'fa-fire' },
            { id: 'ing_nuoc', name: 'Nước Lẩu Cà Chua', stock: 50, icon: 'fa-water' }
        ],
        orders: [
            // Bàn 1 (3 món)
            { id: 1, tableId: 'T1', itemName: 'Sườn Non Bò Mỹ', qty: 3, status: 'cooking', timestamp: Date.now() - 600000, isNew: false, ingredientId: 'ing_suonbo' },
            { id: 2, tableId: 'T1', itemName: 'Nấm Tổng Hợp', qty: 2, status: 'cooking', timestamp: Date.now() - 500000, isNew: false, ingredientId: 'ing_nam' },
            { id: 3, tableId: 'T1', itemName: 'Nước Lẩu Cà Chua', qty: 1, status: 'pending', timestamp: Date.now() - 400000, isNew: false, ingredientId: 'ing_nuoc' },
            // Bàn 2 (2 món)
            { id: 4, tableId: 'T2', itemName: 'Combo Đặc Biệt', qty: 1, status: 'pending', timestamp: Date.now() - 200000, isNew: false, ingredientId: 'ing_combo' },
            { id: 5, tableId: 'T2', itemName: 'Sườn Non Bò Mỹ', qty: 1, status: 'pending', timestamp: Date.now() - 120000, isNew: false, ingredientId: 'ing_suonbo' }
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
