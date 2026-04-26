window.initBillingTab = function() {
    const billingTableList = document.getElementById('stdsh-billing-table-list');
    const billEmptyState = document.getElementById('stdsh-bill-empty-state');
    const billContent = document.getElementById('stdsh-bill-content');
    
    let currentSelectedBillingTable = null;

    window.renderBillingTableList = function() {
        if (!billingTableList) return;
        billingTableList.innerHTML = '';
        const occupiedTables = window.stdshState.tables.filter(t => t.status === 'occupied');
        
        if (occupiedTables.length === 0) {
            billingTableList.innerHTML = '<p style="color:var(--stdsh-text-muted); text-align:center; padding: 20px;">Không có bàn nào đang phục vụ.</p>';
            return;
        }

        occupiedTables.forEach(t => {
            const card = document.createElement('div');
            card.className = 'stdsh-bill-table-card';
            card.setAttribute('data-table-id', t.id);
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
    };

    window.selectBillingTableById = function(tableId) {
        if (!billingTableList) return;
        const listItems = billingTableList.querySelectorAll('.stdsh-bill-table-card');
        const cardElement = Array.from(listItems).find(c => c.getAttribute('data-table-id') === tableId);
        if (cardElement) {
            selectBillingTable(tableId, cardElement);
        }
    };

    function selectBillingTable(tableId, cardElement) {
        document.querySelectorAll('.stdsh-bill-table-card').forEach(c => c.classList.remove('active'));
        cardElement.classList.add('active');
        currentSelectedBillingTable = window.stdshState.tables.find(t => t.id === tableId);

        billEmptyState.classList.add('hidden');
        billContent.classList.remove('hidden');

        document.getElementById('stdsh-bill-table-name').textContent = currentSelectedBillingTable.name;
        document.getElementById('stdsh-bill-customer-name').textContent = currentSelectedBillingTable.customerName;

        const itemsList = document.getElementById('stdsh-bill-items-list');
        itemsList.innerHTML = '';
        
        const itemsCount = Math.floor(Math.random() * 2) + 2;
        let subtotal = 0;
        
        for (let i = 0; i < itemsCount; i++) {
            const item = window.stdshState.mockBillItems[i % window.stdshState.mockBillItems.length];
            const li = document.createElement('li');
            li.className = 'stdsh-bill-item';
            li.innerHTML = `
                <span class="stdsh-bill-item-name">${item.name}</span>
                <span class="stdsh-bill-item-qty">x${item.qty}</span>
                <span class="stdsh-bill-item-price">${(item.price * item.qty).toLocaleString('vi-VN')}₫</span>
            `;
            itemsList.appendChild(li);
        }

        const total = currentSelectedBillingTable.billTotal;
        const vat = total * 0.1;
        subtotal = total - vat;

        document.getElementById('stdsh-bill-subtotal').textContent = `${subtotal.toLocaleString('vi-VN')}₫`;
        document.getElementById('stdsh-bill-vat').textContent = `${vat.toLocaleString('vi-VN')}₫`;
        document.getElementById('stdsh-bill-total').textContent = `${total.toLocaleString('vi-VN')}₫`;

        document.getElementById('stdsh-qr-amount').textContent = `${total.toLocaleString('vi-VN')} VNĐ`;
    }

    const modalQr = document.getElementById('stdsh-modal-qr');
    const modalInvoice = document.getElementById('stdsh-modal-invoice');

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.getAttribute('data-close'));
            if (target) target.classList.remove('active');
        });
    });

    const btnQr = document.getElementById('stdsh-btn-qr');
    if (btnQr) {
        btnQr.addEventListener('click', () => {
            modalQr.classList.add('active');
        });
    }

    const btnCash = document.getElementById('stdsh-btn-cash');
    if (btnCash) {
        btnCash.addEventListener('click', () => {
            processPaymentSuccess();
        });
    }

    const btnConfirmQr = document.getElementById('stdsh-btn-confirm-qr-paid');
    if (btnConfirmQr) {
        btnConfirmQr.addEventListener('click', () => {
            modalQr.classList.remove('active');
            processPaymentSuccess();
        });
    }

    function processPaymentSuccess() {
        if (modalInvoice) modalInvoice.classList.add('active');
        
        if (currentSelectedBillingTable) {
            currentSelectedBillingTable.status = 'empty';
            currentSelectedBillingTable.customerName = null;
            currentSelectedBillingTable.billTotal = 0;
            currentSelectedBillingTable = null;
        }

        if (billEmptyState) billEmptyState.classList.remove('hidden');
        if (billContent) billContent.classList.add('hidden');
        
        if (window.renderTables) window.renderTables();
        if (window.updateEmptyTableSelect) window.updateEmptyTableSelect();
        window.renderBillingTableList();
    }

    // Initial render
    window.renderBillingTableList();
};
