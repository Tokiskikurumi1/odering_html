window.initReservationsTab = function() {
    window.renderReservations = function() {
        const resGrid = document.getElementById('stdsh-res-grid-container');
        const resCount = document.getElementById('stdsh-res-count');
        
        if (!resGrid || !resCount) return;

        resGrid.innerHTML = '';
        resCount.textContent = window.stdshState.reservations.length;
        
        if (window.stdshState.reservations.length === 0) {
            resCount.style.display = 'none';
            resGrid.innerHTML = '<p style="color:var(--stdsh-text-muted); grid-column:1/-1; text-align:center;">Không có yêu cầu đặt bàn nào.</p>';
            return;
        }

        resCount.style.display = 'inline-block';

        window.stdshState.reservations.forEach(res => {
            const card = document.createElement('div');
            card.className = 'stdsh-res-card';
            card.innerHTML = `
                <div class="stdsh-res-header">
                    <h3>${res.name}</h3>
                    <div class="stdsh-res-time">${res.time}</div>
                </div>
                <div class="stdsh-res-details">
                    <p><i class="fa-solid fa-users"></i> ${res.size} người</p>
                    <p><i class="fa-solid fa-phone"></i> ${res.phone}</p>
                </div>
                <div class="stdsh-res-actions">
                    <button class="stdsh-btn stdsh-btn-accept" onclick="acceptRes(${res.id})"><i class="fa-solid fa-check"></i> Chấp nhận</button>
                    <button class="stdsh-btn stdsh-btn-reject" onclick="rejectRes(${res.id})"><i class="fa-solid fa-xmark"></i> Từ chối</button>
                </div>
            `;
            resGrid.appendChild(card);
        });
    };

    window.acceptRes = (id) => {
        window.stdshState.reservations = window.stdshState.reservations.filter(r => r.id !== id);
        window.renderReservations();
        
        const emptyTable = window.stdshState.tables.find(t => t.status === 'empty');
        if (emptyTable) {
            emptyTable.status = 'reserved';
            if (window.renderTables) window.renderTables();
            if (window.updateEmptyTableSelect) window.updateEmptyTableSelect();
        }
    };

    window.rejectRes = (id) => {
        window.stdshState.reservations = window.stdshState.reservations.filter(r => r.id !== id);
        window.renderReservations();
    };

    // Initial render
    window.renderReservations();
};
