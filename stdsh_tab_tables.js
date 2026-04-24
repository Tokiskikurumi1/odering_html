window.initTablesTab = function() {
    const tableGrid = document.getElementById('stdsh-table-grid-container');
    const walkinTableSelect = document.getElementById('stdsh-walkin-table');
    const walkinForm = document.getElementById('stdsh-walkin-form');

    window.renderTables = function() {
        if (!tableGrid) return;
        tableGrid.innerHTML = '';
        window.stdshState.tables.forEach(table => {
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
    };

    window.cancelReservation = (tableId) => {
        const table = window.stdshState.tables.find(t => t.id === tableId);
        if (table) {
            table.status = 'empty';
            window.renderTables();
            window.updateEmptyTableSelect();
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

    // Initial render
    window.renderTables();
    window.updateEmptyTableSelect();
};
