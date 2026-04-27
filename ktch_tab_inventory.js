window.initKitchenInventoryTab = function() {
    const gridContainer = document.getElementById('kitchen-inventory-grid-container');
    const alertBadge = document.getElementById('kitchen-alert-badge');

    window.renderInventory = function() {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        window.kitchenState.inventory.forEach(inv => {
            const isWarning = inv.stock <= 10;
            const warningClass = isWarning ? 'warning' : '';
            
            const card = document.createElement('div');
            card.className = `kitchen-inventory-item ${warningClass}`;
            
            card.innerHTML = `
                <i class="fa-solid ${inv.icon} kitchen-inventory-icon"></i>
                <div class="kitchen-inventory-info">
                    <div class="kitchen-inventory-name">${inv.name}</div>
                    <div class="kitchen-inventory-stock">${inv.stock}</div>
                </div>
            `;
            
            gridContainer.appendChild(card);
        });
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
            // Switch to inventory tab
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
