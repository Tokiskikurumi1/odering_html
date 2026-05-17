/**
 * Overview Tab Module
 */
window.initOverviewTab = function () {
    console.log("Initializing Overview Tab...");

    // In a real application, you would fetch real data here
    const mockOverviewData = {
        revenue: "12.450.000đ",
        totalBills: 32,
        occupiedTables: 8,
        totalTables: 20,
        pendingRes: 3,
        supportMsgs: 2,
        capacity: 65,
        activities: [
            { id: 1, text: "<strong>Bàn 05</strong> vừa gọi thanh toán.", time: "2 phút trước", type: "active" },
            { id: 2, text: "<strong>Anh Kiên</strong> vừa đặt bàn cho 4 người (19:00).", time: "15 phút trước", type: "normal" },
            { id: 3, text: "Hệ thống vừa cập nhật menu: <strong>Sườn Non BBQ</strong>.", time: "45 phút trước", type: "normal" },
            { id: 4, text: "Cảnh báo: <strong>Kim Chi</strong> sắp hết hàng.", time: "1 giờ trước", type: "warning" },
            { id: 5, text: "<strong>Bàn 12</strong> đã hoàn tất thanh toán.", time: "1.5 giờ trước", type: "normal" },
            { id: 6, text: "Khách hàng mới đăng ký thành viên: <strong>Lê Hoa</strong>.", time: "2 giờ trước", type: "normal" }
        ]
    };

    updateOverviewUI(mockOverviewData);
    setupOverviewEventListeners(mockOverviewData);
};

function setupOverviewEventListeners(data) {
    const viewAllBtn = document.querySelector('.stdsh-ov-btn-text');
    const modal = document.getElementById('stdsh-ov-activity-modal');
    const closeModalBtn = document.getElementById('ov-close-modal');
    const modalList = document.getElementById('ov-modal-activity-list');

    if (viewAllBtn && modal && modalList) {
        viewAllBtn.addEventListener('click', () => {
            // Populate modal list with a title header
            modalList.innerHTML = `
                <div class="stdsh-ov-modal-section-header">-- Toàn bộ hoạt động</div>
                ${data.activities.map(act => `
                    <div class="stdsh-ov-activity-item modal-item">
                        <div class="stdsh-ov-activity-dot ${act.type}"></div>
                        <div class="stdsh-ov-activity-content">
                            <p>${act.text}</p>
                            <span>${act.time}</span>
                        </div>
                    </div>
                `).join('')}
            `;
            
            modal.classList.add('active');
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}

function updateOverviewUI(data) {
    // Update Stats
    const revenueEl = document.getElementById('ov-revenue');
    if (revenueEl) revenueEl.textContent = data.revenue;

    const billsEl = document.getElementById('ov-total-bills');
    if (billsEl) billsEl.textContent = data.totalBills;

    const tablesEl = document.getElementById('ov-occupied-tables');
    if (tablesEl) tablesEl.textContent = `${data.occupiedTables} / ${data.totalTables}`;

    const resEl = document.getElementById('ov-pending-res');
    if (resEl) resEl.textContent = data.pendingRes;

    const supportEl = document.getElementById('ov-support-msg');
    if (supportEl) supportEl.textContent = data.supportMsgs;

    // Update Activity List (Show only first 4)
    const activityList = document.getElementById('ov-activity-list');
    if (activityList && data.activities) {
        activityList.innerHTML = data.activities.slice(0, 4).map(act => `
            <div class="stdsh-ov-activity-item">
                <div class="stdsh-ov-activity-dot ${act.type}"></div>
                <div class="stdsh-ov-activity-content">
                    <p>${act.text}</p>
                    <span>${act.time}</span>
                </div>
            </div>
        `).join('');
    }
}
// You could also animate the progress bars or charts here if needed

