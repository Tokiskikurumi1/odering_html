window.initKitchenInventoryTab = function() {
    const tableBody = document.getElementById('kitchen-inventory-table-body');
    const alertBadge = document.getElementById('kitchen-alert-badge');
    const searchInput = document.getElementById('ktch-inv-search-input');
    const unitFilter = document.getElementById('ktch-inv-unit-filter');
    const statusSelect = document.getElementById('ktch-inv-status-select');
    const resetBtn = document.getElementById('ktch-inv-reset-btn');
    const paginationInfo = document.getElementById('ktch-inv-pagination-info');
    const paginationControls = document.getElementById('ktch-inv-pagination-controls');

    let currentFilters = {
        search: '',
        unit: '',
        status: 'all',
        page: 1,
        itemsPerPage: 10
    };

    window.renderInventory = function() {
        if (!tableBody) return;
        
        // 1. Lọc dữ liệu gốc
        const allFilteredData = window.kitchenState.inventory.filter(inv => {
            const matchesSearch = inv.name.toLowerCase().includes(currentFilters.search.toLowerCase());
            const unit = inv.unit || 'kg';
            const matchesUnit = !currentFilters.unit || unit === currentFilters.unit;
            
            let status = 'good';
            if (inv.stock <= 5) status = 'critical';
            else if (inv.stock <= 15) status = 'warning';
            
            const matchesStatus = currentFilters.status === 'all' || status === currentFilters.status;

            return matchesSearch && matchesUnit && matchesStatus;
        });

        // 2. Tính toán phân trang
        const totalItems = allFilteredData.length;
        const totalPages = Math.ceil(totalItems / currentFilters.itemsPerPage);
        
        // Đảm bảo page hiện tại không vượt quá tổng số trang mới sau khi lọc
        if (currentFilters.page > totalPages && totalPages > 0) {
            currentFilters.page = totalPages;
        } else if (totalPages === 0) {
            currentFilters.page = 1;
        }

        const startIndex = (currentFilters.page - 1) * currentFilters.itemsPerPage;
        const paginatedData = allFilteredData.slice(startIndex, startIndex + currentFilters.itemsPerPage);

        // 3. Render bảng
        tableBody.innerHTML = '';
        if (paginatedData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--ktch-text-muted);">Không tìm thấy nguyên liệu phù hợp.</td></tr>';
            paginationInfo.textContent = 'Hiển thị 0 trên 0 nguyên liệu';
            paginationControls.innerHTML = '';
            return;
        }

        paginatedData.forEach(inv => {
            let statusClass = 'status-good';
            let statusText = 'Ổn định';
            if (inv.stock <= 5) {
                statusClass = 'status-critical';
                statusText = 'Cần nhập gấp';
            } else if (inv.stock <= 15) {
                statusClass = 'status-warning';
                statusText = 'Sắp hết';
            }
            
            const unit = inv.unit || 'kg';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="inventory-name-cell">
                        <div class="inventory-item-icon">
                            <i class="fa-solid ${inv.icon}"></i>
                        </div>
                        <span style="font-weight: 600;">${inv.name}</span>
                    </div>
                </td>
                <td>
                    <span class="stock-badge ${statusClass}">
                        <i class="fa-solid ${statusClass === 'status-good' ? 'fa-check-circle' : 'fa-triangle-exclamation'}"></i>
                        ${statusText}
                    </span>
                </td>
                <td class="inventory-stock-cell">${inv.stock}</td>
                <td><span class="unit-text">${unit}</span></td>
                <td>
                    <button class="btn-notify-warehouse" onclick="notifyWarehouse('${inv.id}', '${inv.name}')" title="Thông báo cho kho">
                        <i class="fa-solid fa-bell"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // 4. Cập nhật thông tin phân trang
        const endShow = Math.min(startIndex + currentFilters.itemsPerPage, totalItems);
        paginationInfo.textContent = `Hiển thị ${totalItems > 0 ? startIndex + 1 : 0}-${endShow} trên ${totalItems} nguyên liệu`;
        
        renderPaginationControls(totalPages);
    };

    function renderPaginationControls(totalPages) {
        if (!paginationControls) return;
        paginationControls.innerHTML = '';

        if (totalPages <= 1) return;

        // Nút Trước
        const prevBtn = document.createElement('button');
        prevBtn.className = 'ktch-inv-page-btn';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.disabled = currentFilters.page === 1;
        prevBtn.onclick = () => {
            currentFilters.page--;
            window.renderInventory();
        };
        paginationControls.appendChild(prevBtn);

        // Các số trang
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `ktch-inv-page-btn ${currentFilters.page === i ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                currentFilters.page = i;
                window.renderInventory();
            };
            paginationControls.appendChild(pageBtn);
        }

        // Nút Sau
        const nextBtn = document.createElement('button');
        nextBtn.className = 'ktch-inv-page-btn';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.disabled = currentFilters.page === totalPages;
        nextBtn.onclick = () => {
            currentFilters.page++;
            window.renderInventory();
        };
        paginationControls.appendChild(nextBtn);
    }

    // --- EVENT LISTENERS ---

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            currentFilters.page = 1; // Reset về trang 1 khi lọc
            window.renderInventory();
        });
    }

    if (unitFilter) {
        unitFilter.addEventListener('change', (e) => {
            currentFilters.unit = e.target.value;
            currentFilters.page = 1;
            window.renderInventory();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentFilters.page = 1;
            window.renderInventory();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters.search = '';
            currentFilters.unit = '';
            currentFilters.status = 'all';
            currentFilters.page = 1;

            if (searchInput) searchInput.value = '';
            if (unitFilter) unitFilter.value = '';
            if (statusSelect) statusSelect.value = 'all';

            window.renderInventory();
        });
    }

    window.notifyWarehouse = function(id, name) {
        const btn = event.currentTarget;
        if (btn.classList.contains('notified')) return;

        btn.classList.add('notified');
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        console.log(`Đã gửi yêu cầu nhập hàng cho: ${name} (ID: ${id})`);
        
        setTimeout(() => {
            btn.classList.remove('notified');
            btn.innerHTML = '<i class="fa-solid fa-bell"></i>';
        }, 5000);
    };

    window.checkInventoryAlerts = function() {
        if (!alertBadge) return;
        const hasWarning = window.kitchenState.inventory.some(inv => inv.stock <= 10);
        if (hasWarning) {
            alertBadge.classList.remove('hidden');
        } else {
            alertBadge.classList.add('hidden');
        }
    };

    if (alertBadge) {
        alertBadge.addEventListener('click', () => {
            const invTabBtn = document.querySelector('.kitchen-nav-item[data-tab="kitchen-tab-inventory"]');
            if (invTabBtn) {
                invTabBtn.click();
            }
        });
    }

    // Initial render and check
    window.renderInventory();
    window.checkInventoryAlerts();
};
