document.addEventListener('DOMContentLoaded', () => {
    
    // Toggle Sidebar
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    toggleBtn.addEventListener('click', () => {
        // Toggle mobile vs desktop behavior
        if(window.innerWidth <= 768) {
            sidebar.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
        }
    });

    // Render Table Grid
    const tableGrid = document.getElementById('table-grid');
    const tableCount = 13;
    
    // SVG markup matching the screenshot's top-down table + two chairs look.
    const tableSvgIcon = `
        <svg width="100%" height="100%" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <g class="svg-chair">
                <!-- Top Chair -->
                <path d="M15 15 C15 10, 20 8, 30 8 C40 8, 45 10, 45 15" />
                <!-- Bottom Chair -->
                <path d="M15 45 C15 50, 20 52, 30 52 C40 52, 45 50, 45 45" />
                <!-- Table Itself -->
                <rect x="15" y="20" width="30" height="20" rx="2" />
                <!-- Center "X" Design commonly seen on table icons -->
                <line x1="20" y1="20" x2="25" y2="25" />
                <line x1="40" y1="20" x2="35" y2="25" />
                <line x1="20" y1="40" x2="25" y2="35" />
                <line x1="40" y1="40" x2="35" y2="35" />
                <!-- Connect "X" to center line -->
                <line x1="25" y1="25" x2="25" y2="35" />
                <line x1="35" y1="25" x2="35" y2="35" />
                <line x1="25" y1="30" x2="35" y2="30" />
            </g>
        </svg>
    `;

    // Render loop
    for (let i = 1; i <= tableCount; i++) {
        const tableItem = document.createElement('div');
        tableItem.className = 'table-item';
        
        tableItem.innerHTML = `
            <div class="table-name">Bàn Số ${i}</div>
            <div class="table-icon">
                ${tableSvgIcon}
            </div>
            <div class="table-status">Bàn Trống</div>
        `;
        
        tableGrid.appendChild(tableItem);
    }
});
