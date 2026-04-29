window.initKitchenOrdersTab = function () {
    const gridContainer = document.getElementById('kitchen-orders-grid-container');
    const filterBtns = document.querySelectorAll('.kitchen-filter-btn');
    const sortSelect = document.getElementById('kitchen-sort-select');
    const paginationInfo = document.getElementById('ktch-orders-pagination-info');
    const paginationControls = document.getElementById('ktch-orders-pagination-controls');

    let currentFilter = 'all';
    let currentSort = 'oldest';
    let currentPage = 1;
    let itemsPerPage = 10;

    // Status mapping for UI
    const statusMap = {
        'pending': { label: 'Chờ xác nhận', class: 'pending' },
        'cooking': { label: 'Đang làm', class: 'cooking' },
        'done': { label: 'Hoàn thành', class: 'done' },
        'cancel': { label: 'Đã hủy', class: 'cancel' }
    };

    window.renderOrders = function () {
        if (!gridContainer) return;
        
        // 1. Xác định các lô đơn hàng (batch/table) cần hiển thị dựa trên bộ lọc
        let batchIdsToShow = new Set();
        window.kitchenState.orders.forEach(o => {
            if (currentFilter === 'all') {
                // Trang "Tất cả" CHỈ hiển thị đơn chưa hoàn thành và chưa hủy
                if (o.status !== 'done' && o.status !== 'cancel') {
                    batchIdsToShow.add(o.batchId || o.tableId);
                }
            } else if (o.status === currentFilter) {
                batchIdsToShow.add(o.batchId || o.tableId);
            }
        });

        // 2. Lấy tất cả items của các lô đơn hàng hợp lệ
        let filteredOrders = window.kitchenState.orders.filter(o => {
            const groupKey = o.batchId || o.tableId;
            return batchIdsToShow.has(groupKey);
        });

        // Sắp xếp
        filteredOrders.sort((a, b) => {
            if (currentSort === 'oldest') return a.timestamp - b.timestamp;
            return b.timestamp - a.timestamp;
        });

        // 3. Nhóm theo Batch/Bàn
        const grouped = {};
        filteredOrders.forEach(o => {
            const groupKey = o.batchId || o.tableId;
            if (!grouped[groupKey]) {
                const tableInfo = window.kitchenState.tables.find(t => t.id === o.tableId);
                grouped[groupKey] = {
                    batchId: groupKey,
                    tableId: o.tableId,
                    tableName: tableInfo ? tableInfo.name : o.tableId,
                    items: [],
                    timestamp: o.timestamp // Dùng để sắp xếp lô
                };
            }
            grouped[groupKey].items.push(o);
            // Luôn lấy timestamp cũ nhất/mới nhất tùy theo sort để định danh lô
            if (currentSort === 'oldest') {
                grouped[groupKey].timestamp = Math.min(grouped[groupKey].timestamp, o.timestamp);
            } else {
                grouped[groupKey].timestamp = Math.max(grouped[groupKey].timestamp, o.timestamp);
            }
        });

        // Chuyển đối tượng grouped sang mảng để dễ phân trang
        let batchArray = Object.values(grouped);
        batchArray.sort((a, b) => {
            if (currentSort === 'oldest') return a.timestamp - b.timestamp;
            return b.timestamp - a.timestamp;
        });

        // 4. Tính toán phân trang cho các Lô (Batch)
        const totalBatches = batchArray.length;
        const totalPages = Math.ceil(totalBatches / itemsPerPage);
        
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        else if (totalPages === 0) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedBatches = batchArray.slice(startIndex, startIndex + itemsPerPage);

        // 5. Render giao diện
        gridContainer.innerHTML = '';
        if (paginatedBatches.length === 0) {
            gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--ktch-text-muted);">Không có đơn hàng nào trong mục này.</div>';
            if (paginationInfo) paginationInfo.textContent = 'Hiển thị 0 trên 0 hóa đơn';
            if (paginationControls) paginationControls.innerHTML = '';
            return;
        }

        // Check global busy state
        const isKitchenBusy = window.kitchenState.orders.some(o => o.status === 'cooking');

        paginatedBatches.forEach(group => {
            const groupKey = group.batchId;
            const groupEl = document.createElement('div');
            groupEl.className = 'kitchen-table-group';

            let itemsHtml = '';
            let hasPending = false;
            let hasCooking = false;
            let hasDone = false;
            let hasCancel = false;

            group.items.forEach(item => {
                const isNewClass = item.isNew ? 'new-item' : '';
                const sMap = statusMap[item.status];

                if (item.status === 'pending') hasPending = true;
                if (item.status === 'cooking') hasCooking = true;
                if (item.status === 'done') hasDone = true;
                if (item.status === 'cancel') hasCancel = true;

                let warningIconHtml = '';
                if (item.status === 'pending' || item.status === 'cooking') {
                    const ing = window.kitchenState.inventory.find(i => i.id === item.ingredientId);
                    if (ing && ing.stock <= 10 && ing.stock >= item.qty) {
                        warningIconHtml = `<i class="fa-solid fa-triangle-exclamation kitchen-low-stock-warning" title="Sắp hết nguyên liệu"></i>`;
                    } else if (ing && ing.stock < item.qty) {
                        warningIconHtml = `<i class="fa-solid fa-circle-exclamation" style="color: var(--ktch-status-cancel); margin-right: 5px;" title="Không đủ nguyên liệu"></i>`;
                    }
                }

                let deleteBtnHtml = '';
                let statusCancelHtml = '';
                if (item.status === 'pending' || item.status === 'cooking') {
                    deleteBtnHtml = `<button class="kitchen-btn-row-cancel" onclick="window.openCancelModal(${item.id})" title="Hủy món này"><i class="fa-solid fa-xmark"></i></button>`;
                } else if (item.status === 'cancel') {
                    statusCancelHtml = `<span class="kitchen-status-badge cancel" style="font-size:0.75rem; padding: 2px 6px; margin-left: 10px;">Đã hủy</span>`;
                }

                const cancelledClass = item.status === 'cancel' ? 'kitchen-row-cancelled' : '';

                itemsHtml += `
                    <div class="kitchen-order-row ${isNewClass} ${cancelledClass}">
                        <div class="kitchen-row-name">${item.itemName}</div>
                        <div class="kitchen-row-right">
                            <div class="kitchen-row-qty">
                                ${warningIconHtml}
                                <span class="kitchen-item-qty">x${item.qty}</span>
                                ${statusCancelHtml}
                            </div>
                            <div class="kitchen-row-actions">
                                ${deleteBtnHtml}
                            </div>
                        </div>
                    </div>
                `;
            });

            let footerHtml = '';
            if (hasPending || hasCooking) {
                let receiveBtnHtml = '';
                if (hasCooking) {
                    receiveBtnHtml = `<button class="kitchen-btn-action kitchen-btn-complete" onclick="window.updateBatchStatus('${groupKey}', 'cooking', 'done')">Hoàn thành</button>`;
                } else if (hasPending) {
                    if (isKitchenBusy) {
                        receiveBtnHtml = `<button class="kitchen-btn-action kitchen-btn-receive" disabled style="opacity: 0.5; cursor: not-allowed; background: var(--ktch-border); color: var(--ktch-text-muted);" title="Vui lòng hoàn thành đơn đang nấu trước">Nhận đơn</button>`;
                    } else {
                        receiveBtnHtml = `<button class="kitchen-btn-action kitchen-btn-receive" onclick="window.updateBatchStatus('${groupKey}', 'pending', 'cooking')">Nhận đơn</button>`;
                    }
                }

                footerHtml = `
                    <div class="kitchen-table-footer">
                        ${receiveBtnHtml}
                        <button class="kitchen-btn-action kitchen-btn-cancel" onclick="window.openCancelModal('${groupKey}', true)">Hủy đơn</button>
                    </div>
                `;
            }

            let tableStatusClass = '';
            let tableStatusLabel = '';
            if (hasCooking) { tableStatusClass = 'cooking'; tableStatusLabel = 'Đang làm'; }
            else if (hasPending) { tableStatusClass = 'pending'; tableStatusLabel = 'Chờ xác nhận'; }
            else if (hasDone) { tableStatusClass = 'done'; tableStatusLabel = 'Hoàn thành'; }
            else if (hasCancel) { tableStatusClass = 'cancel'; tableStatusLabel = 'Đã hủy'; }

            groupEl.innerHTML = `
                <div class="kitchen-table-header">
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <span><i class="fa-solid fa-utensils"></i> Bàn: ${group.tableName}</span>
                        <span style="font-size: 0.9rem; font-weight: 500; color: var(--ktch-text-muted);">
                            <i class="fa-regular fa-clock"></i> Gọi lúc: ${window.formatTime(group.timestamp)}
                        </span>
                    </div>
                    <span class="kitchen-status-badge ${tableStatusClass}">${tableStatusLabel}</span>
                </div>
                <div class="kitchen-table-items">
                    ${itemsHtml}
                </div>
                ${footerHtml}
            `;
            gridContainer.appendChild(groupEl);
        });

        // 6. Cập nhật Pagination UI
        if (paginationInfo) {
            const endShow = Math.min(startIndex + itemsPerPage, totalBatches);
            paginationInfo.textContent = `Hiển thị ${totalBatches > 0 ? startIndex + 1 : 0}-${endShow} trên ${totalBatches} hóa đơn`;
        }
        renderPaginationControls(totalPages);

        // Remove new highlight after animation
        setTimeout(() => {
            window.kitchenState.orders.forEach(o => o.isNew = false);
        }, 2000);

        if (window.updateKitchenPendingBadge) window.updateKitchenPendingBadge();
    };

    function renderPaginationControls(totalPages) {
        if (!paginationControls) return;
        paginationControls.innerHTML = '';
        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'ktch-orders-page-btn';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => { currentPage--; window.renderOrders(); };
        paginationControls.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `ktch-orders-page-btn ${currentPage === i ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => { currentPage = i; window.renderOrders(); };
            paginationControls.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'ktch-orders-page-btn';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => { currentPage++; window.renderOrders(); };
        paginationControls.appendChild(nextBtn);
    }

    // Filter & Sort Events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            currentPage = 1; // Reset trang
            window.renderOrders();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentPage = 1; // Reset trang
            window.renderOrders();
        });
    }

    // Status Updates
    window.updateOrderStatus = function (orderId, newStatus) {
        const order = window.kitchenState.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            window.renderOrders();
        }
    };

    window.updateBatchStatus = function (batchId, fromStatus, toStatus) {
        window.kitchenState.orders.forEach(o => {
            const groupKey = o.batchId || o.tableId;
            if (groupKey === batchId && o.status === fromStatus) {
                o.status = toStatus;
            }
        });
        window.renderOrders();
    };

    // Cancel Modal Logic
    const modalCancel = document.getElementById('kitchen-modal-cancel');
    const cancelForm = document.getElementById('kitchen-cancel-form');
    const cancelNote = document.getElementById('kitchen-cancel-note');
    const cancelName = document.getElementById('kitchen-cancel-item-name');
    let cancelOrderId = null;
    let cancelBatchId = null;

    window.openCancelModal = function (id, isBatch = false) {
        if (isBatch) {
            cancelOrderId = null;
            cancelBatchId = id;
            const sample = window.kitchenState.orders.find(o => (o.batchId || o.tableId) === id);
            const tableName = sample ? sample.tableId : id;
            if (cancelName) cancelName.textContent = `Toàn bộ đơn chờ/nấu của Bàn: ${tableName}`;
        } else {
            cancelOrderId = id;
            cancelBatchId = null;
            const order = window.kitchenState.orders.find(o => o.id === id);
            if (order && cancelName) {
                cancelName.textContent = `${order.itemName} (x${order.qty}) - Bàn: ${order.tableId}`;
            }
        }
        if (modalCancel) modalCancel.classList.add('active');
        if (cancelForm) cancelForm.reset();
        if (cancelNote) cancelNote.classList.add('hidden');
    };

    const closeBtn = document.getElementById('kitchen-close-cancel-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => modalCancel.classList.remove('active'));

    const radioKhac = document.getElementById('kitchen-reason-4');
    document.getElementsByName('cancelReason').forEach(radio => {
        radio.addEventListener('change', () => {
            if (radioKhac && radioKhac.checked) {
                cancelNote.classList.remove('hidden');
                cancelNote.required = true;
            } else {
                cancelNote.classList.add('hidden');
                cancelNote.required = false;
            }
        });
    });

    if (cancelForm) {
        cancelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cancelOrderId !== null) {
                // Here we could save the cancel reason to the order object
                window.updateOrderStatus(cancelOrderId, 'cancel');
            } else if (cancelBatchId !== null) {
                window.kitchenState.orders.forEach(o => {
                    const groupKey = o.batchId || o.tableId;
                    if (groupKey === cancelBatchId && (o.status === 'pending' || o.status === 'cooking')) {
                        o.status = 'cancel';
                    }
                });
                window.renderOrders();
            }
            if (modalCancel) modalCancel.classList.remove('active');
        });
    }

    // Simulate New Order
    const simBtn = document.getElementById('kitchen-sim-order-btn');
    if (simBtn) {
        simBtn.addEventListener('click', () => {
            const tableIndex = Math.floor(Math.random() * window.kitchenState.tables.length);
            const invIndex = Math.floor(Math.random() * window.kitchenState.inventory.length);
            const table = window.kitchenState.tables[tableIndex];
            const inv = window.kitchenState.inventory[invIndex];

            const newOrder = {
                id: Date.now(),
                batchId: 'SIM_' + Date.now(),
                tableId: table.id,
                itemName: inv.name,
                qty: Math.floor(Math.random() * 3) + 1,
                status: 'pending',
                timestamp: Date.now(),
                isNew: true,
                ingredientId: inv.id
            };

            window.kitchenState.orders.push(newOrder);

            // Deduct ingredient
            const ing = window.kitchenState.inventory.find(i => i.id === inv.id);
            if (ing) {
                ing.stock -= newOrder.qty;
                if (window.renderInventory) window.renderInventory();
                if (window.checkInventoryAlerts) window.checkInventoryAlerts();
            }

            window.playNotificationSound();

            // Switch filter to all or pending to see it
            if (currentFilter !== 'all' && currentFilter !== 'pending') {
                currentFilter = 'pending';
                filterBtns.forEach(b => b.classList.remove('active'));
                const pendingBtn = document.querySelector('.kitchen-filter-btn[data-filter="pending"]');
                if (pendingBtn) pendingBtn.classList.add('active');
            }

            window.renderOrders();
            
            // Hiển thị Toast thông báo đơn mới
            if (window.showToast) {
                window.showToast(`Có đơn mới cho bàn số ${table.id}`);
            }
        });
    }

    // Initial render
    window.renderOrders();
};
