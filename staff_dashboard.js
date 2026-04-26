document.addEventListener("DOMContentLoaded", async () => {
    // ==========================================================================
    // LOAD COMPONENTS
    // ==========================================================================
    const components = [
        { id: "stdsh-sidebar-placeholder", url: "stdsh_sidebar.html" },
        { id: "stdsh-tab-reservations-placeholder", url: "stdsh_tab_reservations.html" },
        { id: "stdsh-tab-tables-placeholder", url: "stdsh_tab_tables.html" },
        { id: "stdsh-tab-billing-placeholder", url: "stdsh_tab_billing.html" }
    ];

    for (const comp of components) {
        try {
            const response = await fetch(comp.url);
            if (response.ok) {
                const html = await response.text();
                document.getElementById(comp.id).outerHTML = html;
            }
        } catch (e) {
            console.error("Error loading " + comp.url, e);
        }
    }

    initStaffDashboard();
});

function initStaffDashboard() {
    // ==========================================================================
    // GLOBAL STATE & MOCK DATA
    // ==========================================================================
    window.stdshState = {
        reservations: [
            { id: 1, name: "Trần Trung Kiên", time: "18:00 - Hôm nay", size: 4, phone: "0901234567" },
            { id: 2, name: "Lê Thị Hoa", time: "19:30 - Hôm nay", size: 2, phone: "0987654321" },
            { id: 3, name: "Phạm Hùng", time: "20:00 - Hôm nay", size: 6, phone: "0912345678" }
        ],
        tables: [
            // Bàn nhỏ (12 bàn)
            ...Array.from({ length: 12 }, (_, i) => ({
                id: `TS${i + 1}`,
                name: `Bàn ${i + 1}`,
                type: 'small',
                status: i === 2 || i === 5 ? 'occupied' : (i === 8 ? 'reserved' : 'empty'),
                customerName: i === 2 ? 'Nguyễn Văn A' : (i === 5 ? 'Lý Kim' : null),
                phone: i === 2 ? '0981234567' : (i === 5 ? '0912233445' : null),
                billTotal: i === 2 ? 850000 : (i === 5 ? 1200000 : 0)
            })),
            // Bàn lớn (8 bàn)
            ...Array.from({ length: 8 }, (_, i) => ({
                id: `TL${i + 1}`,
                name: `Bàn VIP ${i + 1}`,
                type: 'large',
                status: i === 1 ? 'occupied' : (i === 4 ? 'reserved' : 'empty'),
                customerName: i === 1 ? 'Trần Văn B' : null,
                phone: i === 1 ? '0909988776' : null,
                billTotal: i === 1 ? 2500000 : 0
            }))
        ],
        mockBillItems: [
            { name: "Combo Xèo Xèo", qty: 1, price: 419000 },
            { name: "Sườn Non Bò Mỹ", qty: 1, price: 415000 },
            { name: "Coca Cola", qty: 2, price: 30000 }
        ]
    };

    // ==========================================================================
    // CLOCK
    // ==========================================================================
    const timeDisplay = document.getElementById('stdsh-current-time');
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
    if (typeof window.initSidebar === 'function') window.initSidebar();
    if (typeof window.initReservationsTab === 'function') window.initReservationsTab();
    if (typeof window.initTablesTab === 'function') window.initTablesTab();
    if (typeof window.initBillingTab === 'function') window.initBillingTab();
}
