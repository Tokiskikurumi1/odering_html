window.initKitchenOrdersTab = function() {
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

    window.renderOrders = function() {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        // Filter
        let filteredOrders = window.kitchenState.orders;
        if (currentFilter !== 'all') {
            filteredOrders = filteredOrders.filter(o => o.status === currentFilter);
        }

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
            group.items.forEach(item => {
                const isNewClass = item.isNew ? 'new-item' : '';
                const sMap = statusMap[item.status];
                
                let actionsHtml = '';
                if (item.status === 'pending') {
                    actionsHtml = `
                        <div class="kitchen-order-actions">
                            <button class="kitchen-btn-action kitchen-btn-receive" onclick="window.updateOrderStatus(${item.id}, 'cooking')">
                                <i class="fa-solid fa-fire-burner"></i> Nhận món
                            </button>
                            <button class="kitchen-btn-action kitchen-btn-cancel" onclick="window.openCancelModal(${item.id})">
                                <i class="fa-solid fa-xmark"></i> Hủy
                            </button>
                        </div>
                    `;
                } else if (item.status === 'cooking') {
                    actionsHtml = `
                        <div class="kitchen-order-actions">
                            <button class="kitchen-btn-action kitchen-btn-complete" onclick="window.updateOrderStatus(${item.id}, 'done')">
                                <i class="fa-solid fa-check-double"></i> Hoàn thành
                            </button>
                            <button class="kitchen-btn-action kitchen-btn-cancel" onclick="window.openCancelModal(${item.id})">
                                <i class="fa-solid fa-xmark"></i> Hủy
                            </button>
                        </div>
                    `;
                }

                itemsHtml += `
                    <div class="kitchen-order-card ${isNewClass}">
                        <div class="kitchen-order-card-header">
                            <span class="kitchen-item-name">${item.itemName}</span>
                            <span class="kitchen-item-qty">x${item.qty}</span>
                        </div>
                        <div class="kitchen-item-meta">
                            <span><i class="fa-regular fa-clock"></i> ${window.formatTime(item.timestamp)}</span>
                            <span class="kitchen-status-badge ${sMap.class}">${sMap.label}</span>
                        </div>
                        ${actionsHtml}
                    </div>
                `;
            });

            groupEl.innerHTML = `
                <div class="kitchen-table-header">
                    <span><i class="fa-solid fa-utensils"></i> ${group.tableName}</span>
                    <span style="font-size: 0.9rem; font-weight: 500; color: var(--ktch-text-muted);">${group.items.length} món</span>
                </div>
                <div class="kitchen-table-items">
                    ${itemsHtml}
                </div>
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
    window.updateOrderStatus = function(orderId, newStatus) {
        const order = window.kitchenState.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            window.renderOrders();
        }
    };

    // Cancel Modal Logic
    const modalCancel = document.getElementById('kitchen-modal-cancel');
    const cancelForm = document.getElementById('kitchen-cancel-form');
    const cancelNote = document.getElementById('kitchen-cancel-note');
    const cancelName = document.getElementById('kitchen-cancel-item-name');
    let cancelOrderId = null;

    window.openCancelModal = function(orderId) {
        const order = window.kitchenState.orders.find(o => o.id === orderId);
        if (order && modalCancel) {
            cancelOrderId = orderId;
            cancelName.textContent = `${order.itemName} (x${order.qty}) - Bàn: ${order.tableId}`;
            modalCancel.classList.add('active');
            cancelForm.reset();
            cancelNote.classList.add('hidden');
        }
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
                modalCancel.classList.remove('active');
            }
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
