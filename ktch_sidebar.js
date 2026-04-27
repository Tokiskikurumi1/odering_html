window.initKitchenSidebar = function() {
    const tabs = document.querySelectorAll('.kitchen-nav-item');
    const panes = document.querySelectorAll('.kitchen-tab-pane');
    const headerTitle = document.getElementById('kitchen-header-title');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');

            // Update Header Title
            if (headerTitle) {
                headerTitle.textContent = tab.querySelector('span:not(.kitchen-badge)').textContent;
            }
        });
    });

    window.updateKitchenPendingBadge = function() {
        const badge = document.getElementById('kitchen-pending-count');
        if (badge) {
            const pendingCount = window.kitchenState.orders.filter(o => o.status === 'pending').length;
            badge.textContent = pendingCount;
            if (pendingCount > 0) {
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    };

    window.updateKitchenPendingBadge();
};
