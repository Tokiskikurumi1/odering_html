document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // MOCK DATA
    // ==========================================================================
    
    // Reservations
    let reservations = [
        { id: 1, name: "Trần Trung Kiên", time: "18:00 - Hôm nay", size: 4, phone: "0901234567" },
        { id: 2, name: "Lê Thị Hoa", time: "19:30 - Hôm nay", size: 2, phone: "0987654321" },
        { id: 3, name: "Phạm Hùng", time: "20:00 - Hôm nay", size: 6, phone: "0912345678" }
    ];

    // Tables
    // Status: 'empty', 'occupied', 'reserved'
    let tables = Array.from({ length: 12 }, (_, i) => ({
        id: `T${i + 1}`,
        name: `Bàn ${i + 1}`,
        status: i === 2 || i === 5 ? 'occupied' : (i === 8 ? 'reserved' : 'empty'),
        customerName: i === 2 ? 'Nguyễn Văn A' : (i === 5 ? 'Lý Kim' : null),
        billTotal: i === 2 ? 850000 : (i === 5 ? 1200000 : 0)
    }));

    // Mock Bill Items
    const mockBillItems = [
        { name: "Combo Xèo Xèo", qty: 1, price: 419000 },
        { name: "Sườn Non Bò Mỹ", qty: 1, price: 415000 },
        { name: "Coca Cola", qty: 2, price: 30000 }
    ];

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const tabs = document.querySelectorAll('.stdsh-nav-item');
    const panes = document.querySelectorAll('.stdsh-tab-pane');
    const headerTitle = document.getElementById('stdsh-header-title');
    const timeDisplay = document.getElementById('stdsh-current-time');
    
    // Res Elements
    const resGrid = document.getElementById('stdsh-res-grid-container');
    const resCount = document.getElementById('stdsh-res-count');

    // Table Elements
    const tableGrid = document.getElementById('stdsh-table-grid-container');
    const walkinTableSelect = document.getElementById('stdsh-walkin-table');
    const walkinForm = document.getElementById('stdsh-walkin-form');

    // Billing Elements
    const billingTableList = document.getElementById('stdsh-billing-table-list');
    const billEmptyState = document.getElementById('stdsh-bill-empty-state');
    const billContent = document.getElementById('stdsh-bill-content');
    
    let currentSelectedBillingTable = null;

    // ==========================================================================
    // INIT & CLOCK
    // ==========================================================================
    function updateClock() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    function init() {
        renderReservations();
        renderTables();
        renderBillingTableList();
        updateEmptyTableSelect();
    }

    // ==========================================================================
    // TAB NAVIGATION
    // ==========================================================================
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // Update Header Title
            headerTitle.textContent = tab.querySelector('span:not(.stdsh-badge)').textContent;
        });
    });

    // ==========================================================================
    // TAB 1: RESERVATIONS
    // ==========================================================================
    function renderReservations() {
        resGrid.innerHTML = '';
        resCount.textContent = reservations.length;
        
        if (reservations.length === 0) {
            resCount.style.display = 'none';
            resGrid.innerHTML = '<p style="color:var(--stdsh-text-muted); grid-column:1/-1; text-align:center;">Không có yêu cầu đặt bàn nào.</p>';
            return;
        }

        resCount.style.display = 'inline-block';

        reservations.forEach(res => {
            const card = document.createElement('div');
            card.className = 'stdsh-res-card';
            card.innerHTML = `
                <div class="stdsh-res-header">
                    <h3>${res.name}</h3>
                    <div class="stdsh-res-time">${res.time}</div>
                </div>
                <div class="stdsh-res-details">
                    <p><i class="fa-solid fa-users"></i> ${res.size} người</p>
                    <p><i class="fa-solid fa-phone"></i> ${res.phone}</p>
                </div>
                <div class="stdsh-res-actions">
                    <button class="stdsh-btn stdsh-btn-accept" onclick="acceptRes(${res.id})"><i class="fa-solid fa-check"></i> Chấp nhận</button>
                    <button class="stdsh-btn stdsh-btn-reject" onclick="rejectRes(${res.id})"><i class="fa-solid fa-xmark"></i> Từ chối</button>
                </div>
            `;
            resGrid.appendChild(card);
        });
    }

    window.acceptRes = (id) => {
        reservations = reservations.filter(r => r.id !== id);
        renderReservations();
        // Giả lập: Chuyển 1 bàn trống thành đã đặt
        const emptyTable = tables.find(t => t.status === 'empty');
        if (emptyTable) {
            emptyTable.status = 'reserved';
            renderTables();
            updateEmptyTableSelect();
        }
    };

    window.rejectRes = (id) => {
        reservations = reservations.filter(r => r.id !== id);
        renderReservations();
    };

    // ==========================================================================
    // TAB 2: TABLES & WALKIN
    // ==========================================================================
    function renderTables() {
        tableGrid.innerHTML = '';
        tables.forEach(table => {
            const item = document.createElement('div');
            item.className = `stdsh-table-item stdsh-table-${table.status}`;
            
            let metaText = '';
            if (table.status === 'empty') metaText = 'Trống';
            else if (table.status === 'occupied') metaText = table.customerName;
            else if (table.status === 'reserved') metaText = 'Đã đặt';

            let cancelBtnHtml = '';
            if (table.status === 'reserved') {
                cancelBtnHtml = `<button class="stdsh-table-cancel-btn" onclick="event.stopPropagation(); cancelReservation('${table.id}')"><i class="fa-solid fa-xmark"></i> Hủy</button>`;
            }

            item.innerHTML = `
                ${cancelBtnHtml}
                ${table.name}
                <span class="stdsh-table-meta">${metaText}</span>
            `;
            tableGrid.appendChild(item);
        });
    }

    window.cancelReservation = (tableId) => {
        const table = tables.find(t => t.id === tableId);
        if (table) {
            table.status = 'empty';
            renderTables();
            updateEmptyTableSelect();
        }
    };

    function updateEmptyTableSelect() {
        walkinTableSelect.innerHTML = '<option value="" disabled selected>-- Chọn Bàn Trống --</option>';
        const emptyTables = tables.filter(t => t.status === 'empty');
        emptyTables.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            walkinTableSelect.appendChild(opt);
        });
    }

    walkinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('stdsh-walkin-name').value;
        const tableId = walkinTableSelect.value;

        if (!name || !tableId) return;

        // Cập nhật trạng thái bàn
        const table = tables.find(t => t.id === tableId);
        if (table) {
            table.status = 'occupied';
            table.customerName = name;
            table.billTotal = Math.floor(Math.random() * 500000) + 300000; // random bill
        }

        walkinForm.reset();
        renderTables();
        updateEmptyTableSelect();
        renderBillingTableList();
        
        // Chuyển sang visual feedback (flash bàn)
        // (optional enhancement)
    });

    // ==========================================================================
    // TAB 3: BILLING
    // ==========================================================================
    function renderBillingTableList() {
        billingTableList.innerHTML = '';
        const occupiedTables = tables.filter(t => t.status === 'occupied');
        
        if (occupiedTables.length === 0) {
            billingTableList.innerHTML = '<p style="color:var(--stdsh-text-muted); text-align:center; padding: 20px;">Không có bàn nào đang phục vụ.</p>';
            return;
        }

        occupiedTables.forEach(t => {
            const card = document.createElement('div');
            card.className = 'stdsh-bill-table-card';
            card.onclick = () => selectBillingTable(t.id, card);
            
            card.innerHTML = `
                <div class="stdsh-btc-info">
                    <h4>${t.name}</h4>
                    <p>${t.customerName}</p>
                </div>
                <div class="stdsh-btc-amount">
                    ${t.billTotal.toLocaleString('vi-VN')}₫
                </div>
            `;
            billingTableList.appendChild(card);
        });
    }

    function selectBillingTable(tableId, cardElement) {
        document.querySelectorAll('.stdsh-bill-table-card').forEach(c => c.classList.remove('active'));
        cardElement.classList.add('active');
        currentSelectedBillingTable = tables.find(t => t.id === tableId);

        billEmptyState.classList.add('hidden');
        billContent.classList.remove('hidden');

        document.getElementById('stdsh-bill-table-name').textContent = currentSelectedBillingTable.name;
        document.getElementById('stdsh-bill-customer-name').textContent = currentSelectedBillingTable.customerName;

        // Render mock items
        const itemsList = document.getElementById('stdsh-bill-items-list');
        itemsList.innerHTML = '';
        
        // Randomly slice the mock array to make it look different for tables
        const itemsCount = Math.floor(Math.random() * 2) + 2;
        let subtotal = 0;
        
        for (let i = 0; i < itemsCount; i++) {
            const item = mockBillItems[i % mockBillItems.length];
            const li = document.createElement('li');
            li.className = 'stdsh-bill-item';
            li.innerHTML = `
                <span class="stdsh-bill-item-name">${item.name}</span>
                <span class="stdsh-bill-item-qty">x${item.qty}</span>
                <span class="stdsh-bill-item-price">${(item.price * item.qty).toLocaleString('vi-VN')}₫</span>
            `;
            itemsList.appendChild(li);
        }

        // Just use the predefined billTotal from the table object
        const total = currentSelectedBillingTable.billTotal;
        const vat = total * 0.1;
        subtotal = total - vat;

        document.getElementById('stdsh-bill-subtotal').textContent = `${subtotal.toLocaleString('vi-VN')}₫`;
        document.getElementById('stdsh-bill-vat').textContent = `${vat.toLocaleString('vi-VN')}₫`;
        document.getElementById('stdsh-bill-total').textContent = `${total.toLocaleString('vi-VN')}₫`;

        // Update QR modal amount
        document.getElementById('stdsh-qr-amount').textContent = `${total.toLocaleString('vi-VN')} VNĐ`;
    }

    // ==========================================================================
    // MODALS & PAYMENT FLOW
    // ==========================================================================
    const modalQr = document.getElementById('stdsh-modal-qr');
    const modalInvoice = document.getElementById('stdsh-modal-invoice');

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.getAttribute('data-close'));
            target.classList.remove('active');
        });
    });

    document.getElementById('stdsh-btn-qr').addEventListener('click', () => {
        modalQr.classList.add('active');
    });

    document.getElementById('stdsh-btn-cash').addEventListener('click', () => {
        // Direct to invoice success
        processPaymentSuccess();
    });

    document.getElementById('stdsh-btn-confirm-qr-paid').addEventListener('click', () => {
        modalQr.classList.remove('active');
        processPaymentSuccess();
    });

    function processPaymentSuccess() {
        modalInvoice.classList.add('active');
        
        if (currentSelectedBillingTable) {
            currentSelectedBillingTable.status = 'empty';
            currentSelectedBillingTable.customerName = null;
            currentSelectedBillingTable.billTotal = 0;
            currentSelectedBillingTable = null;
        }

        // Reset Bill View
        billEmptyState.classList.remove('hidden');
        billContent.classList.add('hidden');
        
        // Re-render
        renderTables();
        updateEmptyTableSelect();
        renderBillingTableList();
    }

    // Initialize the app
    init();
});
