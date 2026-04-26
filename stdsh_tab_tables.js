window.initTablesTab = function() {
    const tableGrid = document.getElementById('stdsh-table-grid-container');
    const walkinTableSelect = document.getElementById('stdsh-walkin-table');
    const walkinForm = document.getElementById('stdsh-walkin-form');

    let currentTableFilter = 'all';

    window.renderTables = function() {
        if (!tableGrid) return;
        tableGrid.innerHTML = '';
        
        let filteredTables = window.stdshState.tables;
        if (currentTableFilter !== 'all') {
            filteredTables = window.stdshState.tables.filter(t => t.type === currentTableFilter);
        }

        filteredTables.forEach(table => {
            const item = document.createElement('div');
            item.className = `stdsh-table-item stdsh-table-${table.status}`;
            if (table.type === 'large') {
                item.classList.add('stdsh-table-type-large');
            }
            
            let metaText = '';
            if (table.status === 'empty') metaText = 'Trống';
            else if (table.status === 'occupied') metaText = table.customerName;
            else if (table.status === 'reserved') metaText = 'Đã đặt';

            let actionBtnsHtml = '';
            if (table.status === 'reserved') {
                actionBtnsHtml = `
                    <div class="stdsh-table-actions">
                        <button class="stdsh-table-info-btn" onclick="event.stopPropagation(); viewTableDetails('${table.id}')"><i class="fa-solid fa-circle-info"></i> Chi tiết</button>
                        <button class="stdsh-table-activate-btn" onclick="event.stopPropagation(); activateReservation('${table.id}')"><i class="fa-solid fa-check"></i> Kích hoạt</button>
                        <button class="stdsh-table-cancel-btn" onclick="event.stopPropagation(); cancelReservation('${table.id}')"><i class="fa-solid fa-xmark"></i> Hủy</button>
                    </div>
                `;
            } else if (table.status === 'occupied') {
                actionBtnsHtml = `
                    <div class="stdsh-table-actions">
                        <button class="stdsh-table-info-btn" onclick="event.stopPropagation(); viewTableDetails('${table.id}')"><i class="fa-solid fa-circle-info"></i> Chi tiết</button>
                        <button class="stdsh-table-pay-btn" onclick="event.stopPropagation(); checkoutTable('${table.id}')"><i class="fa-solid fa-credit-card"></i> Thanh toán</button>
                    </div>
                `;
            }

            item.innerHTML = `
                ${actionBtnsHtml}
                ${table.name}
                <span class="stdsh-table-meta">${metaText}</span>
            `;
            tableGrid.appendChild(item);
        });
    };

    window.cancelReservation = (tableId) => {
        const table = window.stdshState.tables.find(t => t.id === tableId);
        if (table) {
            table.status = 'empty';
            window.renderTables();
            window.updateEmptyTableSelect();
        }
    };

    window.activateReservation = (tableId) => {
        const table = window.stdshState.tables.find(t => t.id === tableId);
        if (table) {
            table.status = 'occupied';
            if (!table.customerName) table.customerName = 'Khách đặt trước';
            table.billTotal = Math.floor(Math.random() * 500000) + 300000;
            const now = new Date();
            if (!table.time) table.time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - Hôm nay`;
            window.renderTables();
            window.updateEmptyTableSelect();
            if (window.renderBillingTableList) window.renderBillingTableList();
        }
    };

    window.viewTableDetails = (tableId) => {
        const table = window.stdshState.tables.find(t => t.id === tableId);
        if (table) {
            document.getElementById('stdsh-detail-modal-table').textContent = table.name;
            document.getElementById('stdsh-detail-modal-name').textContent = table.customerName || 'Khách vãng lai';
            document.getElementById('stdsh-detail-modal-phone').textContent = table.phone || 'Không cung cấp';
            document.getElementById('stdsh-detail-modal-size').textContent = table.size ? `${table.size} người` : 'Không xác định';
            
            const now = new Date();
            const timeStr = table.time || `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - Hôm nay`;
            document.getElementById('stdsh-detail-modal-time').textContent = timeStr;

            document.getElementById('stdsh-modal-table-details').classList.add('active');
        }
    };

    window.checkoutTable = (tableId) => {
        // Đóng modal chi tiết nếu đang mở
        document.getElementById('stdsh-modal-table-details').classList.remove('active');
        
        // Chuyển sang tab thanh toán
        const billingTab = document.querySelector('.stdsh-nav-item[data-tab="stdsh-tab-billing"]');
        if (billingTab) billingTab.click();
        
        // Chọn đúng bàn đó bên tab thanh toán
        if (typeof window.selectBillingTableById === 'function') {
            window.selectBillingTableById(tableId);
        }
    };

    window.updateEmptyTableSelect = function() {
        if (!walkinTableSelect) return;
        walkinTableSelect.innerHTML = '<option value="" disabled selected>-- Chọn Bàn Trống --</option>';
        const emptyTables = window.stdshState.tables.filter(t => t.status === 'empty');
        emptyTables.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            walkinTableSelect.appendChild(opt);
        });
    };

    if (walkinForm) {
        walkinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('stdsh-walkin-name').value;
            const tableId = walkinTableSelect.value;

            if (!name || !tableId) return;

            const table = window.stdshState.tables.find(t => t.id === tableId);
            if (table) {
                table.status = 'occupied';
                table.customerName = name;
                table.size = document.getElementById('stdsh-walkin-guests').value;
                const now = new Date();
                table.time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - Hôm nay`;
                table.billTotal = Math.floor(Math.random() * 500000) + 300000;
            }

            walkinForm.reset();
            window.renderTables();
            window.updateEmptyTableSelect();
            if (window.renderBillingTableList) window.renderBillingTableList();
        });
    }

    const navBtns = document.querySelectorAll('.stdsh-nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            navBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTableFilter = e.target.getAttribute('data-filter');
            window.renderTables();
        });
    });

    // Close details modal logic
    document.querySelectorAll('[data-close="stdsh-modal-table-details"]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('stdsh-modal-table-details').classList.remove('active');
        });
    });

    // Initial render
    window.renderTables();
    window.updateEmptyTableSelect();
};
