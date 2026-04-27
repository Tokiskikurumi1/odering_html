window.initKitchenOrdersTab = function () {
    const gridContainer = document.getElementById('kitchen-orders-grid-container');
    const filterBtns = document.querySelectorAll('.kitchen-filter-btn');
    const sortSelect = document.getElementById('kitchen-sort-select');

    let currentFilter = 'all';
    let currentSort = 'oldest';

    // Status mapping for UI
    const statusMap = {
        'pending': { label: 'Chờ xác nhận', class: 'pending' },
        'cooking': { label: 'Đang làm', class: 'cooking' },
        'done': { label: 'Hoàn thành', class: 'done' },
        'cancel': { label: 'Đã hủy', class: 'cancel' }
    };

    window.renderOrders = function () {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        // 1. Determine which tables should be visible based on the filter
        let tableIdsToShow = new Set();
        window.kitchenState.orders.forEach(o => {
            if (currentFilter === 'all' || o.status === currentFilter) {
                tableIdsToShow.add(o.tableId);
            }
        });

        // 2. Show all items for the visible tables
        let filteredOrders = window.kitchenState.orders.filter(o => tableIdsToShow.has(o.tableId));

        // Sort
        filteredOrders.sort((a, b) => {
            if (currentSort === 'oldest') return a.timestamp - b.timestamp;
            return b.timestamp - a.timestamp;
        });

        // Group by Table
        const grouped = {};
        filteredOrders.forEach(o => {
            if (!grouped[o.tableId]) {
                const tableInfo = window.kitchenState.tables.find(t => t.id === o.tableId);
                grouped[o.tableId] = {
                    tableName: tableInfo ? tableInfo.name : o.tableId,
                    items: []
                };
            }
            grouped[o.tableId].items.push(o);
        });

        // Render Groups
        Object.keys(grouped).forEach(tableId => {
            const group = grouped[tableId];

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

                // Check inventory warning
                let warningIconHtml = '';
                if (item.status === 'pending' || item.status === 'cooking') {
                    const ing = window.kitchenState.inventory.find(i => i.id === item.ingredientId);
                    if (ing && ing.stock <= 10 && ing.stock >= item.qty) {
                        warningIconHtml = `<i class="fa-solid fa-triangle-exclamation kitchen-low-stock-warning" title="Sắp hết nguyên liệu"></i>`;
                    } else if (ing && ing.stock < item.qty) {
                        warningIconHtml = `<i class="fa-solid fa-circle-exclamation" style="color: var(--ktch-status-cancel); margin-right: 5px;" title="Không đủ nguyên liệu"></i>`;
                    }
                }

                // Delete button and Cancel status
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
                if (hasPending) {
                    receiveBtnHtml = `<button class="kitchen-btn-action kitchen-btn-receive" onclick="window.updateTableStatus('${tableId}', 'pending', 'cooking')">Nhận đơn</button>`;
                } else if (hasCooking) {
                    receiveBtnHtml = `<button class="kitchen-btn-action kitchen-btn-complete" onclick="window.updateTableStatus('${tableId}', 'cooking', 'done')">Hoàn thành</button>`;
                }

                footerHtml = `
                    <div class="kitchen-table-footer">
                        ${receiveBtnHtml}
                        <button class="kitchen-btn-action kitchen-btn-cancel" onclick="window.openCancelModal('${tableId}', true)">Hủy đơn</button>
                    </div>
                `;
            }

            // Determine table overall status
            let tableStatusClass = '';
            let tableStatusLabel = '';
            if (hasCooking) {
                tableStatusClass = 'cooking';
                tableStatusLabel = 'Đang làm';
            } else if (hasPending) {
                tableStatusClass = 'pending';
                tableStatusLabel = 'Chờ xác nhận';
            } else if (hasDone) {
                tableStatusClass = 'done';
                tableStatusLabel = 'Hoàn thành';
            } else if (hasCancel) {
                tableStatusClass = 'cancel';
                tableStatusLabel = 'Đã hủy';
            }

            groupEl.innerHTML = `
                <div class="kitchen-table-header">
                    <span><i class="fa-solid fa-utensils"></i> Bàn: ${group.tableName}</span>
                    <span class="kitchen-status-badge ${tableStatusClass}">${tableStatusLabel}</span>
                </div>
                <div class="kitchen-table-items">
                    ${itemsHtml}
                </div>
                ${footerHtml}
            `;

            gridContainer.appendChild(groupEl);
        });

        // Remove new highlight after animation
        setTimeout(() => {
            window.kitchenState.orders.forEach(o => o.isNew = false);
        }, 2000);

        if (window.updateKitchenPendingBadge) window.updateKitchenPendingBadge();
    };

    // Filter & Sort Events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            window.renderOrders();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
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

    window.updateTableStatus = function (tableId, fromStatus, toStatus) {
        window.kitchenState.orders.forEach(o => {
            if (o.tableId === tableId && o.status === fromStatus) {
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
    let cancelTableId = null;

    window.openCancelModal = function (id, isTable = false) {
        if (isTable) {
            cancelOrderId = null;
            cancelTableId = id;
            if (cancelName) cancelName.textContent = `Toàn bộ đơn chờ/nấu của Bàn: ${id}`;
        } else {
            cancelOrderId = id;
            cancelTableId = null;
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
            } else if (cancelTableId !== null) {
                window.kitchenState.orders.forEach(o => {
                    if (o.tableId === cancelTableId && (o.status === 'pending' || o.status === 'cooking')) {
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
                document.querySelector('.kitchen-filter-btn[data-filter="pending"]').classList.add('active');
            }

            window.renderOrders();
        });
    }

    // Initial render
    window.renderOrders();
};
