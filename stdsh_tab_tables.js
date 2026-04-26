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
                        <button class="stdsh-table-activate-btn" onclick="event.stopPropagation(); activateReservation('${table.id}')"><i class="fa-solid fa-check"></i> Kích hoạt</button>
                        <button class="stdsh-table-cancel-btn" onclick="event.stopPropagation(); cancelReservation('${table.id}')"><i class="fa-solid fa-xmark"></i> Hủy</button>
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
            window.renderTables();
            window.updateEmptyTableSelect();
            if (window.renderBillingTableList) window.renderBillingTableList();
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

    // Initial render
    window.renderTables();
    window.updateEmptyTableSelect();
};
