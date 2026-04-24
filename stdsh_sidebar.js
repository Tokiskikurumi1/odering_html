window.initSidebar = function() {
    const tabs = document.querySelectorAll('.stdsh-nav-item');
    const panes = document.querySelectorAll('.stdsh-tab-pane');
    const headerTitle = document.getElementById('stdsh-header-title');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // Update Header Title
            if (headerTitle) {
                headerTitle.textContent = tab.querySelector('span:not(.stdsh-badge)').textContent;
            }
        });
    });
};
