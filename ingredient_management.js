/**
 * INGREDIENT MANAGEMENT MODULE - CORE JS
 * KURUMI BBQ ENTERPRISE POS/ERP SYSTEM
 * Vanilla JS implementation conforming to strict ingr- naming conventions.
 */

(function () {
    // Save original fetch
    window.originalFetch = window.fetch;

    // Default Seed Data
    const DEFAULT_CATEGORIES = [
        { id: "cat-1", name: "Thịt & Hải sản", color: "#e88735", description: "Các loại thịt nướng BBQ, tôm, cá, hải sản tươi sống" },
        { id: "cat-2", name: "Rau củ & Gia vị", color: "#10b981", description: "Rau xà lách ăn kèm, rau lẩu, nấm và các loại nước sốt tẩm ướp" },
        { id: "cat-3", name: "Đồ uống & Tráng miệng", color: "#3b82f6", description: "Bia, nước ngọt, kem, trái cây tráng miệng" },
        { id: "cat-4", name: "Nguyên liệu khô", color: "#8b5cf6", description: "Than nướng, giấy bạc, gia vị hạt nêm, gia vị khô đóng gói" }
    ];

    const DEFAULT_SUPPLIERS = [
        { id: "sup-1", name: "Thịt Sạch CP Group", email: "contact@cpmeat.com.vn", phone: "0283812456", address: "Khu công nghiệp Biên Hòa 2, Đồng Nai", volume: 152000000 },
        { id: "sup-2", name: "Hợp tác xã Rau củ Đà Lạt", email: "dalatfresh@veg.vn", phone: "0987654321", address: "42 Trần Hưng Đạo, TP. Đà Lạt", volume: 48900000 },
        { id: "sup-3", name: "Hải sản Đại Dương Xanh", email: "ocean.seafood@gmail.com", phone: "0901234567", address: "Cảng cá Quận 4, TP. Hồ Chí Minh", volume: 95400000 },
        { id: "sup-4", name: "Tổng đại lý Đồ uống Tân Hiệp Phát", email: "thp@beverages.vn", phone: "0274375512", address: "Đại lộ Bình Dương, Thuận An, Bình Dương", volume: 32000000 }
    ];

    const DEFAULT_INGREDIENTS = [
        { id: "NL001", code: "NL001", name: "Thịt ba chỉ bò Mỹ", categoryId: "cat-1", stock: 45.5, unit: "kg", minStock: 15.0, expiry: "2026-06-15", price: 220000 },
        { id: "NL002", code: "NL002", name: "Tôm sú tươi sống", categoryId: "cat-1", stock: 4.2, unit: "kg", minStock: 10.0, expiry: "2026-05-27", price: 380000 },
        { id: "NL003", code: "NL003", name: "Xà lách thủy canh", categoryId: "cat-2", stock: 12.0, unit: "kg", minStock: 5.0, expiry: "2026-05-24", price: 45000 }, // Expired (relative to May 25, 2026)
        { id: "NL004", code: "NL004", name: "Sốt BBQ đặc chế Kurumi", categoryId: "cat-2", stock: 35.0, unit: "lít", minStock: 10.0, expiry: "2026-09-30", price: 85000 },
        { id: "NL005", code: "NL005", name: "Than nướng không khói", categoryId: "cat-4", stock: 250.0, unit: "kg", minStock: 50.0, expiry: "2027-12-31", price: 18000 }, // Excess stock
        { id: "NL006", code: "NL006", name: "Bia Heineken đóng chai", categoryId: "cat-3", stock: 40.0, unit: "thùng", minStock: 12.0, expiry: "2027-04-10", price: 410000 },
        { id: "NL007", code: "NL007", name: "Thịt sườn Tomahawk Mỹ", categoryId: "cat-1", stock: 2.0, unit: "kg", minStock: 8.0, expiry: "2026-06-10", price: 1250000 }, // Critical Low
        { id: "NL008", code: "NL008", name: "Nấm kim châm Đà Lạt", categoryId: "cat-2", stock: 9.0, unit: "gói", minStock: 15.0, expiry: "2026-05-29", price: 12000 } // Warning Low
    ];

    const DEFAULT_HISTORY = [
        { id: "TX-001", timestamp: "2026-05-25T08:30:00+07:00", type: "IMPORT", details: "Nhập hàng từ CP Group (Phiếu GR-20260525-001)", ingredientId: "NL001", qty: 20, user: "Nguyễn Minh Nam" },
        { id: "TX-002", timestamp: "2026-05-25T09:15:00+07:00", type: "EXPORT", details: "Xuất kho phục vụ Bếp chính nướng", ingredientId: "NL001", qty: -12.5, user: "Nguyễn Minh Nam" },
        { id: "TX-003", timestamp: "2026-05-24T16:00:00+07:00", type: "AUDIT", details: "Điều chỉnh chênh lệch kiểm kê định kỳ", ingredientId: "NL004", qty: 2.0, user: "Nguyễn Minh Nam" },
        { id: "TX-004", timestamp: "2026-05-24T17:45:00+07:00", type: "CRUD", details: "Khởi tạo thông tin nguyên liệu mới trong hệ thống", ingredientId: "NL007", qty: 2, user: "Nguyễn Minh Nam" }
    ];

    const DEFAULT_NOTIFICATIONS = [
        { id: "notif-1", type: "expired", title: "Nguyên liệu hết hạn sử dụng", message: "Nguyên liệu 'Xà lách thủy canh' (Mã NL003) đã quá hạn từ ngày 24/05/2026. Hãy tiêu hủy kho ngay lập tức.", time: "1 ngày trước", read: false },
        { id: "notif-2", type: "critical", title: "Cảnh báo tồn kho cực thấp", message: "Sườn Tomahawk Mỹ (NL007) chỉ còn tồn 2.0 kg so với định mức an toàn 8.0 kg.", time: "4 giờ trước", read: false },
        { id: "notif-3", type: "warning", title: "Nguyên liệu sắp hết", message: "Nấm kim châm Đà Lạt (NL008) chỉ còn tồn 9 gói. Nên lên kế hoạch nhập hàng.", time: "6 giờ trước", read: true }
    ];

    // Main App State Initialization
    window.ingredientState = {
        ingredients: JSON.parse(localStorage.getItem("ingr_data_ingredients")) || DEFAULT_INGREDIENTS,
        categories: JSON.parse(localStorage.getItem("ingr_data_categories")) || DEFAULT_CATEGORIES,
        suppliers: JSON.parse(localStorage.getItem("ingr_data_suppliers")) || DEFAULT_SUPPLIERS,
        history: JSON.parse(localStorage.getItem("ingr_data_history")) || DEFAULT_HISTORY,
        notifications: JSON.parse(localStorage.getItem("ingr_data_notifications")) || DEFAULT_NOTIFICATIONS,
        activeTab: "dashboard",
        activeFilters: { search: "", category: "all", status: "all" },
        pagination: { page: 1, limit: 10 }
    };

    function saveState() {
        localStorage.setItem("ingr_data_ingredients", JSON.stringify(window.ingredientState.ingredients));
        localStorage.setItem("ingr_data_categories", JSON.stringify(window.ingredientState.categories));
        localStorage.setItem("ingr_data_suppliers", JSON.stringify(window.ingredientState.suppliers));
        localStorage.setItem("ingr_data_history", JSON.stringify(window.ingredientState.history));
        localStorage.setItem("ingr_data_notifications", JSON.stringify(window.ingredientState.notifications));
    }

    // Helper functions to get status for an ingredient
    function getIngredientStatus(ingr) {
        const today = new Date("2026-05-25"); // Current app date simulation
        const expiryDate = new Date(ingr.expiry);
        
        if (expiryDate <= today) {
            return "expired";
        }
        
        if (ingr.stock <= 0 || ingr.stock <= (ingr.minStock / 3)) {
            return "critical";
        }
        
        if (ingr.stock <= ingr.minStock) {
            return "warning";
        }

        if (ingr.stock >= ingr.minStock * 4) {
            return "excess";
        }
        
        return "good";
    }

    // Dynamic stats calculations
    function calculateGlobalStats() {
        let total = window.ingredientState.ingredients.length;
        let low = 0;
        let expired = 0;
        let totalValue = 0;

        window.ingredientState.ingredients.forEach(ingr => {
            const status = getIngredientStatus(ingr);
            if (status === "critical" || status === "warning") {
                low++;
            } else if (status === "expired") {
                expired++;
            }
            totalValue += ingr.stock * ingr.price;
        });

        return { total, low, expired, totalValue };
    }

    // ==========================================================================
    // INTERCEPT FETCH() CALLS (SIMULATES ENDPOINTS WITH NETWORK LATENCY & SKELETONS)
    // ==========================================================================
    window.fetch = async function (url, options) {
        const parsedUrl = new URL(url, window.location.origin);
        const path = parsedUrl.pathname;

        // Simulate 400ms server network latency
        await new Promise(resolve => setTimeout(resolve, 400));

        if (path === "/api/ingredients") {
            if (options && options.method === "POST") {
                const body = JSON.parse(options.body);
                if (body.id) {
                    // Update
                    const idx = window.ingredientState.ingredients.findIndex(i => i.id === body.id);
                    if (idx !== -1) {
                        window.ingredientState.ingredients[idx] = { ...window.ingredientState.ingredients[idx], ...body };
                    }
                } else {
                    // Create
                    body.id = body.code || "NL" + String(window.ingredientState.ingredients.length + 1).padStart(3, "0");
                    window.ingredientState.ingredients.push(body);
                }
                saveState();
                return { ok: true, status: 200, json: async () => ({ success: true, data: body }) };
            }
            if (options && options.method === "DELETE") {
                const id = parsedUrl.searchParams.get("id");
                window.ingredientState.ingredients = window.ingredientState.ingredients.filter(i => i.id !== id);
                saveState();
                return { ok: true, status: 200, json: async () => ({ success: true }) };
            }
            return { ok: true, status: 200, json: async () => window.ingredientState.ingredients };
        }

        if (path === "/api/categories") {
            if (options && options.method === "POST") {
                const body = JSON.parse(options.body);
                if (body.id) {
                    const idx = window.ingredientState.categories.findIndex(c => c.id === body.id);
                    if (idx !== -1) {
                        window.ingredientState.categories[idx] = { ...window.ingredientState.categories[idx], ...body };
                    }
                } else {
                    body.id = "cat-" + (window.ingredientState.categories.length + 1);
                    window.ingredientState.categories.push(body);
                }
                saveState();
                return { ok: true, status: 200, json: async () => ({ success: true, data: body }) };
            }
            if (options && options.method === "DELETE") {
                const id = parsedUrl.searchParams.get("id");
                window.ingredientState.categories = window.ingredientState.categories.filter(c => c.id !== id);
                saveState();
                return { ok: true, status: 200, json: async () => ({ success: true }) };
            }
            return { ok: true, status: 200, json: async () => window.ingredientState.categories };
        }

        if (path === "/api/suppliers") {
            if (options && options.method === "POST") {
                const body = JSON.parse(options.body);
                if (body.id) {
                    const idx = window.ingredientState.suppliers.findIndex(s => s.id === body.id);
                    if (idx !== -1) {
                        window.ingredientState.suppliers[idx] = { ...window.ingredientState.suppliers[idx], ...body };
                    }
                } else {
                    body.id = "sup-" + (window.ingredientState.suppliers.length + 1);
                    body.volume = 0;
                    window.ingredientState.suppliers.push(body);
                }
                saveState();
                return { ok: true, status: 200, json: async () => ({ success: true, data: body }) };
            }
            return { ok: true, status: 200, json: async () => window.ingredientState.suppliers };
        }

        if (path === "/api/transactions") {
            if (options && options.method === "POST") {
                const body = JSON.parse(options.body);
                body.id = "TX-" + String(window.ingredientState.history.length + 1).padStart(3, "0");
                body.timestamp = new Date().toISOString();
                window.ingredientState.history.unshift(body);
                
                // Adjust ingredient quantity physically
                const ingr = window.ingredientState.ingredients.find(i => i.id === body.ingredientId);
                if (ingr) {
                    ingr.stock += body.qty;
                    if (ingr.stock < 0) ingr.stock = 0; // Negative limit control
                }
                
                // Trigger auto notifications if status becomes critical
                if (ingr) {
                    const newStatus = getIngredientStatus(ingr);
                    if (newStatus === "critical" || newStatus === "warning") {
                        const newNotif = {
                            id: "notif-" + (window.ingredientState.notifications.length + 1),
                            type: newStatus,
                            title: `Nguyên liệu ${newStatus === 'critical' ? 'chạm ngưỡng báo động' : 'sắp hết'}`,
                            message: `${ingr.name} (${ingr.code}) hiện còn ${ingr.stock} ${ingr.unit} (Định mức tối thiểu: ${ingr.minStock} ${ingr.unit}).`,
                            time: "Vừa xong",
                            read: false
                        };
                        window.ingredientState.notifications.unshift(newNotif);
                    }
                }

                saveState();
                return { ok: true, status: 200, json: async () => ({ success: true, data: body }) };
            }
            return { ok: true, status: 200, json: async () => window.ingredientState.history };
        }

        // Default routing fallback
        return window.originalFetch ? window.originalFetch(url, options) : { ok: false, status: 404 };
    };

    // ==========================================================================
    // TOAST NOTIFICATIONS SERVICE (ANT DESIGN / SHADCN UI DYNAMICS)
    // ==========================================================================
    window.showToast = function (title, message, type = "info") {
        const dock = document.getElementById("ingr-global-toast-container");
        if (!dock) return;

        const card = document.createElement("div");
        card.className = `ingr-toast-card-element ${type}`;

        let icon = "fa-info-circle";
        if (type === "success") icon = "fa-circle-check";
        if (type === "warning") icon = "fa-triangle-exclamation";
        if (type === "error") icon = "fa-circle-xmark";

        card.innerHTML = `
            <i class="fa-solid ${icon} ingr-toast-icon"></i>
            <div class="ingr-toast-content">
                <span class="ingr-toast-title">${title}</span>
                <span class="ingr-toast-message">${message}</span>
            </div>
            <button class="ingr-toast-close-btn" title="Đóng"><i class="fa-solid fa-xmark"></i></button>
            <div class="ingr-toast-progress-bar-decay"></div>
        `;

        dock.appendChild(card);

        // Progress bar decay logic (visual timer)
        const progress = card.querySelector(".ingr-toast-progress-bar-decay");
        progress.style.transition = "width 4s linear";
        setTimeout(() => {
            progress.style.width = "0%";
        }, 50);

        // Close functions
        const closeBtn = card.querySelector(".ingr-toast-close-btn");
        const dismissToast = () => {
            if (card.classList.contains("hiding")) return;
            card.classList.add("hiding");
            card.addEventListener("animationend", () => card.remove());
        };

        closeBtn.onclick = dismissToast;

        // Auto destroy after 4 seconds
        const timeoutId = setTimeout(dismissToast, 4000);
        card.onmouseenter = () => {
            clearTimeout(timeoutId);
            progress.style.transition = "none";
            progress.style.width = "100%";
        };
    };

    // ==========================================================================
    // DYNAMIC VIEWS RENDER SYSTEM
    // ==========================================================================

    // Chart handlers references
    let dashboardChartInstance = null;
    let reportSpendChartInstance = null;
    let reportTopChartInstance = null;

    // SKELETON LOADER ANIMATOR
    function showSkeleton(elementId, heightClass = "") {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.innerHTML = `
            <div class="ingr-skeleton-loading-panel ${heightClass}">
                <div class="ingr-skeleton-bar-placeholder header-title"></div>
                <div class="ingr-skeleton-bar-placeholder"></div>
                <div class="ingr-skeleton-bar-placeholder short"></div>
                <div class="ingr-skeleton-bar-placeholder"></div>
            </div>
        `;
    }

    // 1. RENDER DASHBOARD
    function renderDashboard() {
        const stats = calculateGlobalStats();

        // Update cards texts
        document.getElementById("ingr-dashboard-stat-total").textContent = stats.total;
        document.getElementById("ingr-dashboard-stat-low").textContent = stats.low;
        document.getElementById("ingr-dashboard-stat-expired").textContent = stats.expired;
        document.getElementById("ingr-dashboard-stat-value").textContent = stats.totalValue.toLocaleString("vi-VN") + " đ";

        // Badges alerts
        const lowTrend = document.getElementById("ingr-dashboard-stat-low-trend");
        if (stats.low > 0) {
            lowTrend.className = "ingr-summary-card-trend danger";
            lowTrend.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Cần nhập gấp`;
        } else {
            lowTrend.className = "ingr-summary-card-trend positive";
            lowTrend.innerHTML = `<i class="fa-solid fa-circle-check"></i> An toàn`;
        }

        const expTrend = document.getElementById("ingr-dashboard-stat-expired-trend");
        if (stats.expired > 0) {
            expTrend.className = "ingr-summary-card-trend danger";
            expTrend.innerHTML = `<i class="fa-solid fa-skull-crossbones"></i> Hủy kho ngay`;
        } else {
            expTrend.className = "ingr-summary-card-trend positive";
            expTrend.innerHTML = `<i class="fa-solid fa-circle-check"></i> Ổn định`;
        }

        // RENDER URGENT REPLENISH LIST
        const urgentContainer = document.getElementById("ingr-dashboard-urgent-list");
        if (urgentContainer) {
            const urgentItems = window.ingredientState.ingredients.filter(ingr => {
                const status = getIngredientStatus(ingr);
                return status === "critical" || status === "warning" || status === "expired";
            }).sort((a, b) => {
                const statA = getIngredientStatus(a);
                const statB = getIngredientStatus(b);
                const weight = { expired: 3, critical: 2, warning: 1 };
                return weight[statB] - weight[statA];
            });

            if (urgentItems.length === 0) {
                urgentContainer.innerHTML = `
                    <div class="ingr-empty-state-card-wrapper">
                        <i class="fa-regular fa-face-smile ingr-empty-state-illustrated-icon"></i>
                        <p class="ingr-empty-state-headline">Không có nguyên liệu khẩn cấp</p>
                        <p class="ingr-empty-state-guidance">Tất cả hàng tồn kho đều đạt định mức ổn định cao.</p>
                    </div>
                `;
            } else {
                urgentContainer.innerHTML = urgentItems.map(ingr => {
                    const status = getIngredientStatus(ingr);
                    let badgeClass = "warning";
                    let label = "Sắp hết";
                    if (status === "critical") { badgeClass = "danger"; label = "Nhập gấp"; }
                    if (status === "expired") { badgeClass = "expired"; label = "Hết hạn"; }

                    return `
                        <div class="ingr-urgent-replenish-item">
                            <div class="ingr-urgent-item-info">
                                <span class="ingr-urgent-item-name">${ingr.name}</span>
                                <span class="ingr-urgent-item-details">Tồn: ${ingr.stock} ${ingr.unit} / Định mức: ${ingr.minStock} ${ingr.unit}</span>
                            </div>
                            <span class="ingr-urgent-item-badge ${badgeClass}">${label}</span>
                        </div>
                    `;
                }).join("");
            }
        }

        // RENDER RECENT ACTIVITIES
        const activityContainer = document.getElementById("ingr-dashboard-activities");
        if (activityContainer) {
            const recent = window.ingredientState.history.slice(0, 5);
            if (recent.length === 0) {
                activityContainer.innerHTML = `<p style="text-align: center; color: var(--ingr-text-disabled); font-size: 0.8rem; margin: 20px 0;">Chưa có hoạt động nào được ghi nhận.</p>`;
            } else {
                activityContainer.innerHTML = recent.map(tx => {
                    let typeClass = "import";
                    let sign = "+";
                    let iconColor = "#10b981";
                    if (tx.type === "EXPORT") { typeClass = "export"; sign = ""; iconColor = "#e88735"; }
                    if (tx.type === "AUDIT") { typeClass = "audit"; sign = "±"; iconColor = "#f59e0b"; }
                    if (tx.type === "CRUD") { typeClass = "crud"; sign = ""; iconColor = "#8b5cf6"; }

                    const ingr = window.ingredientState.ingredients.find(i => i.id === tx.ingredientId);
                    const name = ingr ? ingr.name : "Nguyên liệu";
                    const unit = ingr ? ingr.unit : "";

                    const timeFormatted = new Date(tx.timestamp).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) + " " + new Date(tx.timestamp).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });

                    return `
                        <div class="ingr-timeline-activity-item ${typeClass}">
                            <div class="ingr-activity-item-dot"></div>
                            <div class="ingr-activity-item-content">
                                <span class="ingr-activity-item-desc">${tx.details}: <strong>${name}</strong> (${sign}${tx.qty} ${unit})</span>
                                <span class="ingr-activity-item-time">${timeFormatted} - ${tx.user}</span>
                            </div>
                        </div>
                    `;
                }).join("");
            }
        }

        // DOCK DASHBOARD DOUGHNUT CHART
        const ctx = document.getElementById("ingr-dashboard-pie-chart");
        if (ctx) {
            if (dashboardChartInstance) dashboardChartInstance.destroy();

            // Calculate stock valuation sums per category
            const catMap = {};
            window.ingredientState.categories.forEach(c => {
                catMap[c.id] = { name: c.name, color: c.color, value: 0 };
            });

            window.ingredientState.ingredients.forEach(i => {
                if (catMap[i.categoryId]) {
                    catMap[i.categoryId].value += i.stock * i.price;
                }
            });

            const labels = Object.values(catMap).map(c => c.name);
            const data = Object.values(catMap).map(c => c.value);
            const colors = Object.values(catMap).map(c => c.color);

            dashboardChartInstance = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderColor: "#13151b",
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                color: "#e2e8f0",
                                font: { family: "Montserrat", size: 10 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return ` ${context.label}: ${context.raw.toLocaleString("vi-VN")} đ`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // 2. RENDER INGREDIENTS LIST
    function renderIngredients() {
        const tbody = document.getElementById("ingr-ingredients-table-body");
        if (!tbody) return;

        // Apply filters
        const q = window.ingredientState.activeFilters.search.toLowerCase();
        const cat = window.ingredientState.activeFilters.category;
        const stat = window.ingredientState.activeFilters.status;

        const filtered = window.ingredientState.ingredients.filter(ingr => {
            const matchesSearch = ingr.name.toLowerCase().includes(q) || ingr.code.toLowerCase().includes(q);
            const matchesCategory = (cat === "all") || (ingr.categoryId === cat);
            
            const ingrStatus = getIngredientStatus(ingr);
            const matchesStatus = (stat === "all") || (ingrStatus === stat);

            return matchesSearch && matchesCategory && matchesStatus;
        });

        // Pagination calculations
        const pag = window.ingredientState.pagination;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / pag.limit) || 1;
        if (pag.page > totalPages) pag.page = totalPages;

        const startIndex = (pag.page - 1) * pag.limit;
        const paginatedData = filtered.slice(startIndex, startIndex + pag.limit);

        // Populate table rows
        if (paginatedData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="ingr-empty-state-card-wrapper">
                            <i class="fa-solid fa-cookie-bite ingr-empty-state-illustrated-icon"></i>
                            <p class="ingr-empty-state-headline">Không tìm thấy nguyên liệu nào</p>
                            <p class="ingr-empty-state-guidance">Vui lòng điều chỉnh bộ lọc hoặc thêm mới nguyên liệu vào hệ thống.</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = paginatedData.map(ingr => {
                const category = window.ingredientState.categories.find(c => c.id === ingr.categoryId);
                const catName = category ? category.name : "Không xác định";
                const catColor = category ? category.color : "#64748b";
                
                const status = getIngredientStatus(ingr);
                let statusLabel = "Tồn kho tốt";
                if (status === "critical") statusLabel = "Nhập gấp";
                if (status === "warning") statusLabel = "Sắp hết";
                if (status === "expired") statusLabel = "Hết hạn";
                if (status === "excess") statusLabel = "Tồn nhiều";

                const dateFormatted = new Date(ingr.expiry).toLocaleDateString("vi-VN");

                return `
                    <tr>
                        <td><strong style="color: var(--ingr-accent-amber); font-weight: 700;">${ingr.code}</strong></td>
                        <td><span style="font-weight: 600; color: #fff;">${ingr.name}</span></td>
                        <td>
                            <span style="display: inline-flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.8rem;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${catColor}; display: inline-block;"></span>
                                ${catName}
                            </span>
                        </td>
                        <td style="text-align: right; font-weight: 700; font-size: 0.9rem; color: ${status === 'critical' ? 'var(--ingr-status-danger)' : '#fff'};">${ingr.stock.toFixed(1)}</td>
                        <td><span style="color: var(--ingr-text-muted); font-weight: 600;">${ingr.unit}</span></td>
                        <td><span style="font-weight: 500;">${dateFormatted}</span></td>
                        <td>
                            <span class="ingr-ingredient-status-badge ${status}">
                                <i class="fa-solid ${status === 'good' || status === 'excess' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
                                ${statusLabel}
                            </span>
                        </td>
                        <td style="text-align: center; white-space: nowrap;">
                            <button class="ingr-ingredient-action-btn-circle" onclick="window.editIngredient('${ingr.id}')" title="Sửa nguyên liệu"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="ingr-ingredient-action-btn-circle delete" onclick="window.deleteIngredient('${ingr.id}')" title="Xóa nguyên liệu"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                    </tr>
                `;
            }).join("");
        }

        // Pagination Info Render
        const startNum = totalItems > 0 ? startIndex + 1 : 0;
        const endNum = Math.min(startIndex + pag.limit, totalItems);
        document.getElementById("ingr-ingredients-page-info").textContent = `Hiển thị ${startNum}-${endNum} trên ${totalItems} nguyên liệu`;

        // Render Pagination Controls
        const controls = document.getElementById("ingr-ingredients-page-controls");
        if (controls) {
            controls.innerHTML = `
                <button class="ingr-pagination-number-btn" ${pag.page === 1 ? 'disabled' : ''} onclick="window.setIngredientsPage(${pag.page - 1})" title="Trang trước">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                ${Array.from({ length: totalPages }).map((_, idx) => `
                    <button class="ingr-pagination-number-btn ${pag.page === idx + 1 ? 'active' : ''}" onclick="window.setIngredientsPage(${idx + 1})">
                        ${idx + 1}
                    </button>
                `).join("")}
                <button class="ingr-pagination-number-btn" ${pag.page === totalPages ? 'disabled' : ''} onclick="window.setIngredientsPage(${pag.page + 1})" title="Trang sau">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            `;
        }
    }

    // Set page handler
    window.setIngredientsPage = function(pageNum) {
        window.ingredientState.pagination.page = pageNum;
        renderIngredients();
    };

    // 3. RENDER CATEGORIES
    function renderCategories() {
        const grid = document.getElementById("ingr-categories-grid-container");
        if (!grid) return;

        grid.innerHTML = window.ingredientState.categories.map(cat => {
            // Count ingredients in this category
            const count = window.ingredientState.ingredients.filter(i => i.categoryId === cat.id).length;

            return `
                <div class="ingr-category-card-element">
                    <div class="ingr-category-card-color-strip" style="background-color: ${cat.color};"></div>
                    <div class="ingr-category-card-header">
                        <h4 class="ingr-category-card-title">${cat.name}</h4>
                        <span class="ingr-category-card-badge-count">${count} nguyên liệu</span>
                    </div>
                    <div class="ingr-category-card-body">
                        <p class="ingr-category-card-desc">${cat.description || "Chưa có mô tả chi tiết cho nhóm danh mục này."}</p>
                    </div>
                    <div class="ingr-category-card-actions">
                        <button class="ingr-ingredient-action-btn-circle" onclick="window.editCategory('${cat.id}')" title="Sửa danh mục"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="ingr-ingredient-action-btn-circle delete" onclick="window.deleteCategory('${cat.id}')" title="Xóa danh mục"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
        }).join("");
    }

    // 4. RENDER GOODS RECEIPT FORM
    let receiptRowCounter = 0;
    function renderGoodsReceipt() {
        // Reset code automatically based on timestamp
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        document.getElementById("ingr-receipt-code").value = `GR-${todayStr}-${String(window.ingredientState.history.filter(h => h.type === "IMPORT").length + 1).padStart(3, "0")}`;

        // Populate supplier options
        const supplierSelect = document.getElementById("ingr-receipt-supplier");
        if (supplierSelect) {
            supplierSelect.innerHTML = `<option value="">-- Chọn nhà cung cấp --</option>` +
                window.ingredientState.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
        }

        // Clear existing input table
        const tbody = document.getElementById("ingr-receipt-items-tbody");
        if (tbody) tbody.innerHTML = "";
        
        receiptRowCounter = 0;
        addReceiptItemRow(); // Prepopulate first row
        updateReceiptTotals();
    }

    window.addReceiptItemRow = function() {
        const tbody = document.getElementById("ingr-receipt-items-tbody");
        if (!tbody) return;

        receiptRowCounter++;
        const rowId = `ingr-receipt-row-${receiptRowCounter}`;
        const tr = document.createElement("tr");
        tr.id = rowId;

        // Create ingredient options
        const optionsHtml = window.ingredientState.ingredients.map(i => `<option value="${i.id}" data-stock="${i.stock}" data-unit="${i.unit}" data-price="${i.price}">${i.name} (${i.code})</option>`).join("");

        tr.innerHTML = `
            <td>
                <select class="ingr-form-dropdown-select" onchange="window.handleReceiptIngredientChange('${rowId}', this)" required>
                    <option value="">-- Chọn nguyên liệu --</option>
                    ${optionsHtml}
                </select>
            </td>
            <td><strong id="${rowId}-stock" class="ingr-receipt-stock-indicator">-</strong> <span id="${rowId}-unit-lbl"></span></td>
            <td>
                <input type="number" class="ingr-receipt-qty-input" placeholder="0" min="0.1" step="any" oninput="window.calculateReceiptRowTotal('${rowId}')" required>
            </td>
            <td>
                <input type="number" class="ingr-receipt-qty-input" placeholder="Giá nhập" min="0" oninput="window.calculateReceiptRowTotal('${rowId}')" required>
            </td>
            <td><strong id="${rowId}-total" style="color: var(--ingr-accent-amber);">0 đ</strong></td>
            <td style="text-align: center;">
                <button type="button" class="ingr-receipt-delete-row-btn" onclick="window.deleteReceiptItemRow('${rowId}')" title="Xóa dòng"><i class="fa-solid fa-circle-minus"></i></button>
            </td>
        `;

        tbody.appendChild(tr);
        updateReceiptTotals();
    };

    window.handleReceiptIngredientChange = function(rowId, selectElem) {
        const option = selectElem.options[selectElem.selectedIndex];
        const stockIndicator = document.getElementById(`${rowId}-stock`);
        const unitLabel = document.getElementById(`${rowId}-unit-lbl`);
        const qtyInputs = document.querySelectorAll(`#${rowId} input`);

        if (selectElem.value) {
            const stock = parseFloat(option.getAttribute("data-stock"));
            const unit = option.getAttribute("data-unit");
            const defaultPrice = option.getAttribute("data-price");

            stockIndicator.textContent = stock.toFixed(1);
            unitLabel.textContent = unit;
            qtyInputs[1].value = defaultPrice; // Autofill historical pricing
        } else {
            stockIndicator.textContent = "-";
            unitLabel.textContent = "";
            qtyInputs[1].value = "";
        }
        window.calculateReceiptRowTotal(rowId);
    };

    window.calculateReceiptRowTotal = function(rowId) {
        const row = document.getElementById(rowId);
        if (!row) return;

        const inputs = row.querySelectorAll("input");
        const qty = parseFloat(inputs[0].value) || 0;
        const price = parseFloat(inputs[1].value) || 0;

        const totalCell = document.getElementById(`${rowId}-total`);
        const total = qty * price;
        totalCell.textContent = total.toLocaleString("vi-VN") + " đ";
        totalCell.setAttribute("data-raw-value", total);

        updateReceiptTotals();
    };

    window.deleteReceiptItemRow = function(rowId) {
        const tbody = document.getElementById("ingr-receipt-items-tbody");
        if (tbody.children.length <= 1) {
            window.showToast("Cảnh báo form", "Phiếu nhập kho phải chứa tối thiểu một nguyên liệu.", "warning");
            return;
        }
        const row = document.getElementById(rowId);
        if (row) row.remove();
        updateReceiptTotals();
    };

    function updateReceiptTotals() {
        const tbody = document.getElementById("ingr-receipt-items-tbody");
        if (!tbody) return;

        let itemsCount = 0;
        let grandTotal = 0;

        tbody.querySelectorAll("tr").forEach(tr => {
            const select = tr.querySelector("select");
            if (select && select.value) {
                const totalCell = document.getElementById(`${tr.id}-total`);
                const rawVal = parseFloat(totalCell.getAttribute("data-raw-value")) || 0;
                if (rawVal > 0) {
                    itemsCount++;
                    grandTotal += rawVal;
                }
            }
        });

        document.getElementById("ingr-receipt-summary-item-count").textContent = itemsCount;
        document.getElementById("ingr-receipt-summary-grand-total").textContent = grandTotal.toLocaleString("vi-VN") + " đ";
    }

    // 5. RENDER GOODS ISSUE FORM
    let issueRowCounter = 0;
    function renderGoodsIssue() {
        const tbody = document.getElementById("ingr-issue-items-tbody");
        if (tbody) tbody.innerHTML = "";

        issueRowCounter = 0;
        addIssueItemRow(); // Prepopulate first row
    }

    window.addIssueItemRow = function() {
        const tbody = document.getElementById("ingr-issue-items-tbody");
        if (!tbody) return;

        issueRowCounter++;
        const rowId = `ingr-issue-row-${issueRowCounter}`;
        const tr = document.createElement("tr");
        tr.id = rowId;

        const optionsHtml = window.ingredientState.ingredients.map(i => `<option value="${i.id}" data-stock="${i.stock}" data-unit="${i.unit}">${i.name} (${i.code})</option>`).join("");

        tr.innerHTML = `
            <td>
                <select class="ingr-form-dropdown-select" onchange="window.handleIssueIngredientChange('${rowId}', this)" required>
                    <option value="">-- Chọn nguyên liệu --</option>
                    ${optionsHtml}
                </select>
            </td>
            <td><strong id="${rowId}-stock" class="ingr-issue-stock-indicator">-</strong> <span id="${rowId}-unit-lbl"></span></td>
            <td>
                <input type="number" class="ingr-receipt-qty-input" placeholder="0" min="0.1" step="any" oninput="window.validateIssueQuantity('${rowId}')" required>
            </td>
            <td><span id="${rowId}-unit-lbl2" style="font-weight: 600; color: var(--ingr-text-muted);">-</span></td>
            <td style="text-align: center;">
                <button type="button" class="ingr-receipt-delete-row-btn" onclick="window.deleteIssueItemRow('${rowId}')" title="Xóa dòng"><i class="fa-solid fa-circle-minus"></i></button>
            </td>
        `;

        tbody.appendChild(tr);
    };

    window.handleIssueIngredientChange = function(rowId, selectElem) {
        const option = selectElem.options[selectElem.selectedIndex];
        const stockIndicator = document.getElementById(`${rowId}-stock`);
        const unitLabel = document.getElementById(`${rowId}-unit-lbl`);
        const unitLabel2 = document.getElementById(`${rowId}-unit-lbl2`);

        if (selectElem.value) {
            const stock = parseFloat(option.getAttribute("data-stock"));
            const unit = option.getAttribute("data-unit");

            stockIndicator.textContent = stock.toFixed(1);
            unitLabel.textContent = unit;
            unitLabel2.textContent = unit;
        } else {
            stockIndicator.textContent = "-";
            unitLabel.textContent = "";
            unitLabel2.textContent = "-";
        }
        window.validateIssueQuantity(rowId);
    };

    window.validateIssueQuantity = function(rowId) {
        const row = document.getElementById(rowId);
        if (!row) return;

        const select = row.querySelector("select");
        const input = row.querySelector("input[type='number']");
        const qty = parseFloat(input.value) || 0;

        if (select.value) {
            const option = select.options[select.selectedIndex];
            const stock = parseFloat(option.getAttribute("data-stock"));

            if (qty > stock) {
                input.style.borderColor = "var(--ingr-status-danger)";
                input.setCustomValidity("Số lượng xuất vượt quá tồn kho khả dụng!");
            } else {
                input.style.borderColor = "";
                input.setCustomValidity("");
            }
        }
    };

    window.deleteIssueItemRow = function(rowId) {
        const tbody = document.getElementById("ingr-issue-items-tbody");
        if (tbody.children.length <= 1) {
            window.showToast("Cảnh báo form", "Phiếu xuất kho phải chứa tối thiểu một dòng nguyên liệu.", "warning");
            return;
        }
        const row = document.getElementById(rowId);
        if (row) row.remove();
    };

    // 6. RENDER INVENTORY AUDIT SHEET
    function renderAudit() {
        const tbody = document.getElementById("ingr-audit-table-body");
        if (!tbody) return;

        if (window.ingredientState.ingredients.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="ingr-empty-state-card-wrapper">
                            <i class="fa-solid fa-clipboard-question ingr-empty-state-illustrated-icon"></i>
                            <p class="ingr-empty-state-headline">Chưa có nguyên liệu để kiểm kê</p>
                            <p class="ingr-empty-state-guidance">Vui lòng khởi tạo các nguyên liệu trong hệ thống trước.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = window.ingredientState.ingredients.map(ingr => {
            return `
                <tr id="ingr-audit-row-${ingr.id}">
                    <td><strong style="color: var(--ingr-accent-amber); font-weight: 700;">${ingr.code}</strong></td>
                    <td><span style="font-weight: 600; color: #fff;">${ingr.name}</span></td>
                    <td style="text-align: right; font-weight: 600;" id="ingr-audit-sys-${ingr.id}">${ingr.stock.toFixed(1)} ${ingr.unit}</td>
                    <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <input type="number" class="ingr-audit-qty-input" placeholder="Nhập thực tế" min="0" step="any" oninput="window.calculateAuditDiscrepancy('${ingr.id}', ${ingr.stock})" required>
                            <span style="font-weight: 600; color: var(--ingr-text-muted); width: 25px; text-align: left;">${ingr.unit}</span>
                        </div>
                    </td>
                    <td style="text-align: right;">
                        <span id="ingr-audit-diff-${ingr.id}" class="ingr-audit-discrepancy-text neutral">0.0</span>
                    </td>
                    <td style="text-align: center;">
                        <span id="ingr-audit-badge-${ingr.id}" class="ingr-ingredient-status-badge good">
                            <i class="fa-solid fa-circle-check"></i> Khớp
                        </span>
                    </td>
                    <td>
                        <input type="text" class="ingr-form-text-input" placeholder="Lý do chênh lệch (nếu có)..." style="padding: 6px 12px; font-size: 0.8rem;">
                    </td>
                </tr>
            `;
        }).join("");
    }

    window.calculateAuditDiscrepancy = function(ingrId, sysStock) {
        const row = document.getElementById(`ingr-audit-row-${ingrId}`);
        if (!row) return;

        const input = row.querySelector("input[type='number']");
        const diffSpan = document.getElementById(`ingr-audit-diff-${ingrId}`);
        const badge = document.getElementById(`ingr-audit-badge-${ingrId}`);

        if (input.value === "") {
            diffSpan.textContent = "0.0";
            diffSpan.className = "ingr-audit-discrepancy-text neutral";
            badge.textContent = "Khớp";
            badge.className = "ingr-ingredient-status-badge good";
            badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Khớp`;
            return;
        }

        const realStock = parseFloat(input.value) || 0;
        const diff = realStock - sysStock;

        // Round to 2 decimal places to avoid standard JS float point quirks
        const roundedDiff = Math.round(diff * 100) / 100;

        diffSpan.textContent = (roundedDiff > 0 ? "+" : "") + roundedDiff.toFixed(1);

        if (roundedDiff === 0) {
            diffSpan.className = "ingr-audit-discrepancy-text neutral";
            badge.className = "ingr-ingredient-status-badge good";
            badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Khớp`;
        } else if (roundedDiff > 0) {
            diffSpan.className = "ingr-audit-discrepancy-text positive";
            badge.className = "ingr-ingredient-status-badge warning";
            badge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Thừa / Dư`;
        } else {
            diffSpan.className = "ingr-audit-discrepancy-text negative";
            badge.className = "ingr-ingredient-status-badge critical";
            badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Thiếu hụt`;
        }
    };

    // Load all ingredients dynamically helper for audit
    const loadAllAuditBtn = document.getElementById("ingr-btn-audit-load-all");
    if (loadAllAuditBtn) {
        loadAllAuditBtn.onclick = function() {
            window.ingredientState.ingredients.forEach(ingr => {
                const row = document.getElementById(`ingr-audit-row-${ingr.id}`);
                if (row) {
                    const input = row.querySelector("input[type='number']");
                    input.value = ingr.stock.toFixed(1);
                    window.calculateAuditDiscrepancy(ingr.id, ingr.stock);
                }
            });
            window.showToast("Kiểm kê kho", "Đã đồng bộ nhanh toàn bộ tồn hệ thống sang cột thực tế.", "success");
        };
    }

    // Save audit sheet
    const saveAuditBtn = document.getElementById("ingr-btn-save-audit");
    if (saveAuditBtn) {
        saveAuditBtn.onclick = async function() {
            const rows = document.querySelectorAll("#ingr-audit-table-body tr");
            let hasChanges = false;
            let promises = [];

            // Display loading
            saveAuditBtn.disabled = true;
            saveAuditBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang cân bằng...`;

            for (let tr of rows) {
                const ingrId = tr.id.replace("ingr-audit-row-", "");
                const input = tr.querySelector("input[type='number']");
                const reasonInput = tr.querySelector("input[type='text']");
                
                if (input.value !== "") {
                    const sysStockVal = parseFloat(document.getElementById(`ingr-audit-sys-${ingrId}`).textContent);
                    const realStockVal = parseFloat(input.value) || 0;
                    const discrepancy = realStockVal - sysStockVal;

                    if (discrepancy !== 0) {
                        hasChanges = true;
                        
                        // Push transaction
                        promises.push(
                            fetch("/api/transactions", {
                                method: "POST",
                                body: JSON.stringify({
                                    type: "AUDIT",
                                    details: `Cân bằng kho kiểm kê (${reasonInput.value || "Lý do hệ thống"})`,
                                    ingredientId: ingrId,
                                    qty: discrepancy,
                                    user: "Nguyễn Minh Nam"
                                })
                            })
                        );
                    }
                }
            }

            if (!hasChanges) {
                window.showToast("Cảnh báo kiểm kê", "Không phát hiện thay đổi hoặc bạn chưa nhập bất kỳ tồn thực tế nào.", "warning");
                saveAuditBtn.disabled = false;
                saveAuditBtn.innerHTML = `<i class="fa-solid fa-square-check"></i> Hoàn Tất & Cân Bằng Kho`;
                return;
            }

            try {
                await Promise.all(promises);
                window.showToast("Kiểm kê thành công", "Đã cân bằng số lượng tồn kho hệ thống khớp theo số liệu kiểm đếm thực tế.", "success");
                
                // Reload audit tab
                renderAudit();
                renderGlobalSidebarAlerts();
            } catch (err) {
                window.showToast("Lỗi kiểm kê", "Có lỗi xảy ra trong quá trình cập nhật.", "error");
            } finally {
                saveAuditBtn.disabled = false;
                saveAuditBtn.innerHTML = `<i class="fa-solid fa-square-check"></i> Hoàn Tất & Cân Bằng Kho`;
            }
        };
    }

    // 7. RENDER WARNINGS DOCK
    let activeWarningTypeFilter = "all";
    function renderWarnings() {
        const tbody = document.getElementById("ingr-warnings-table-body");
        if (!tbody) return;

        const warningIngredients = window.ingredientState.ingredients.filter(ingr => {
            const status = getIngredientStatus(ingr);
            if (activeWarningTypeFilter === "all") {
                return status === "critical" || status === "warning" || status === "expired" || status === "excess";
            }
            return status === activeWarningTypeFilter;
        });

        if (warningIngredients.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9">
                        <div class="ingr-empty-state-card-wrapper">
                            <i class="fa-solid fa-circle-check ingr-empty-state-illustrated-icon" style="color: var(--ingr-status-success);"></i>
                            <p class="ingr-empty-state-headline">Kho hàng tuyệt đối an toàn</p>
                            <p class="ingr-empty-state-guidance">Không ghi nhận bất cứ cảnh báo rủi ro tồn kho nào theo tiêu chí đã chọn.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = warningIngredients.map(ingr => {
            const status = getIngredientStatus(ingr);
            let riskLabel = "";
            let riskClass = "";
            let badgeClass = "";
            let urgency = "";

            if (status === "expired") {
                riskLabel = "Hết hạn sử dụng";
                riskClass = "expired";
                badgeClass = "expired";
                urgency = `<span style="color: var(--ingr-status-expired); font-weight: 800;"><i class="fa-solid fa-skull-crossbones"></i> HỦY GẤP</span>`;
            } else if (status === "critical") {
                riskLabel = "Tồn kho cực thấp";
                riskClass = "critical";
                badgeClass = "danger";
                urgency = `<span style="color: var(--ingr-status-danger); font-weight: 800;"><i class="fa-solid fa-angles-up"></i> KHẨN CẤP</span>`;
            } else if (status === "warning") {
                riskLabel = "Dưới định mức tối thiểu";
                riskClass = "warning";
                badgeClass = "warning";
                urgency = `<span style="color: var(--ingr-status-warning); font-weight: 700;"><i class="fa-solid fa-bell"></i> TRUNG BÌNH</span>`;
            } else if (status === "excess") {
                riskLabel = "Tồn kho quá mức (Đọng vốn)";
                riskClass = "excess";
                badgeClass = "good";
                urgency = `<span style="color: var(--ingr-status-success); font-weight: 600;"><i class="fa-solid fa-circle-info"></i> THẤP</span>`;
            }

            const expiryDate = new Date(ingr.expiry).toLocaleDateString("vi-VN");

            return `
                <tr>
                    <td><strong style="color: var(--ingr-accent-amber); font-weight: 700;">${ingr.code}</strong></td>
                    <td><span style="font-weight: 600; color: #fff;">${ingr.name}</span></td>
                    <td><span style="font-weight: 600; color: var(--ingr-text-muted);">${riskLabel}</span></td>
                    <td style="text-align: right; font-weight: 700; font-size: 0.95rem;">${ingr.stock.toFixed(1)}</td>
                    <td><span style="color: var(--ingr-text-muted);">${ingr.unit}</span></td>
                    <td style="font-weight: 500;">${ingr.minStock} ${ingr.unit}</td>
                    <td><span style="font-weight: 500; color: ${status === 'expired' ? 'var(--ingr-status-danger)' : 'inherit'};">${expiryDate}</span></td>
                    <td style="text-align: center;">${urgency}</td>
                    <td style="text-align: center;">
                        ${status === 'expired' ? 
                            `<button class="ingr-primary-btn-action danger" style="padding: 6px 12px; font-size: 0.75rem;" onclick="window.quickDisposeExpired('${ingr.id}', ${ingr.stock})"><i class="fa-solid fa-dumpster"></i> Tiêu hủy</button>` :
                            `<button class="ingr-primary-btn-action" style="padding: 6px 12px; font-size: 0.75rem;" onclick="window.quickOrderReplenish('${ingr.id}')"><i class="fa-solid fa-cart-shopping"></i> Nhập hàng</button>`
                        }
                    </td>
                </tr>
            `;
        }).join("");
    }

    // Quick handlers inside warnings
    window.quickOrderReplenish = function(ingrId) {
        // Redirect to goods receipt tab
        const tabBtn = document.querySelector(`[data-tab="goods-receipt"]`);
        if (tabBtn) {
            tabBtn.click();
            // Prepopulate goods receipt Row
            setTimeout(() => {
                const row = document.querySelector("#ingr-receipt-items-tbody tr:last-child select");
                if (row) {
                    row.value = ingrId;
                    window.handleReceiptIngredientChange(row.closest("tr").id, row);
                }
            }, 100);
        }
    };

    window.quickDisposeExpired = async function(ingrId, currentStock) {
        if (!confirm("Bạn có chắc chắn muốn xuất hủy tiêu hủy toàn bộ số lượng của nguyên liệu đã hết hạn này?")) return;

        try {
            await fetch("/api/transactions", {
                method: "POST",
                body: JSON.stringify({
                    type: "EXPORT",
                    details: "Tiêu hủy nguyên liệu hết hạn (Nghiệp vụ nhanh)",
                    ingredientId: ingrId,
                    qty: -currentStock,
                    user: "Nguyễn Minh Nam"
                })
            });

            // Set stock to 0 directly
            const ingr = window.ingredientState.ingredients.find(i => i.id === ingrId);
            if (ingr) ingr.stock = 0;
            saveState();

            window.showToast("Hủy kho thành công", "Đã tiêu hủy toàn bộ lô hàng hết hạn.", "success");
            renderWarnings();
            renderGlobalSidebarAlerts();
        } catch (err) {
            window.showToast("Lỗi tiêu hủy", "Có lỗi xảy ra khi xử lý.", "error");
        }
    };

    // Set warnings filter click event
    const warningPillFilters = document.querySelectorAll(".ingr-warning-pill-filter");
    warningPillFilters.forEach(pill => {
        pill.onclick = function() {
            warningPillFilters.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeWarningTypeFilter = pill.getAttribute("data-type");
            renderWarnings();
        };
    });

    // 8. RENDER LEDGER TRANSACTION HISTORY
    function renderHistory() {
        const tbody = document.getElementById("ingr-history-table-body");
        if (!tbody) return;

        const dateStartVal = document.getElementById("ingr-history-date-start").value;
        const dateEndVal = document.getElementById("ingr-history-date-end").value;
        const typeFilterVal = document.getElementById("ingr-history-type-filter").value;

        const filtered = window.ingredientState.history.filter(tx => {
            const txDate = new Date(tx.timestamp);
            txDate.setHours(0, 0, 0, 0);

            let matchesStart = true;
            if (dateStartVal) {
                const startDate = new Date(dateStartVal);
                startDate.setHours(0, 0, 0, 0);
                matchesStart = txDate >= startDate;
            }

            let matchesEnd = true;
            if (dateEndVal) {
                const endDate = new Date(dateEndVal);
                endDate.setHours(0, 0, 0, 0);
                matchesEnd = txDate <= endDate;
            }

            let matchesType = (typeFilterVal === "all") || (tx.type === typeFilterVal);

            return matchesStart && matchesEnd && matchesType;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="ingr-empty-state-card-wrapper">
                            <i class="fa-solid fa-receipt ingr-empty-state-illustrated-icon"></i>
                            <p class="ingr-empty-state-headline">Không tìm thấy giao dịch nào</p>
                            <p class="ingr-empty-state-guidance">Chưa có giao dịch biến động kho nào phù hợp với bộ lọc ngày.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map(tx => {
            const ingr = window.ingredientState.ingredients.find(i => i.id === tx.ingredientId);
            const ingrName = ingr ? ingr.name : "Nguyên liệu đã bị xóa";
            const unit = ingr ? ingr.unit : "";

            let typeBadgeClass = "";
            if (tx.type === "IMPORT") typeBadgeClass = "good";
            if (tx.type === "EXPORT") typeBadgeClass = "warning";
            if (tx.type === "AUDIT") typeBadgeClass = "info";
            if (tx.type === "CRUD") typeBadgeClass = "expired";

            const timeStr = new Date(tx.timestamp).toLocaleString("vi-VN");
            const changeFormatted = (tx.qty > 0 ? "+" : "") + tx.qty.toFixed(1);

            return `
                <tr>
                    <td><span style="font-weight: 500;">${timeStr}</span></td>
                    <td><strong style="color: var(--ingr-text-muted); font-size: 0.8rem;">${tx.id}</strong></td>
                    <td>
                        <span class="ingr-ingredient-status-badge ${typeBadgeClass}" style="font-size: 0.65rem;">
                            ${tx.type}
                        </span>
                    </td>
                    <td><span style="font-weight: 700; color: #fff;">${ingrName}</span></td>
                    <td style="text-align: right; font-weight: 800; color: ${tx.qty > 0 ? 'var(--ingr-status-success)' : 'var(--ingr-status-danger)'};">${changeFormatted} ${unit}</td>
                    <td><span style="font-weight: 600;">${tx.user}</span></td>
                    <td><span style="color: var(--ingr-text-muted); font-size: 0.8rem;">${tx.details}</span></td>
                </tr>
            `;
        }).join("");
    }

    // Date/Type filter handlers for History Ledger
    const historyResetBtn = document.getElementById("ingr-history-filter-reset");
    if (historyResetBtn) {
        historyResetBtn.onclick = function() {
            document.getElementById("ingr-history-date-start").value = "";
            document.getElementById("ingr-history-date-end").value = "";
            document.getElementById("ingr-history-type-filter").value = "all";
            renderHistory();
        };
    }
    const historyInputs = ["ingr-history-date-start", "ingr-history-date-end", "ingr-history-type-filter"];
    historyInputs.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.onchange = renderHistory;
    });

    // 9. RENDER SUPPLIERS
    function renderSuppliers() {
        const container = document.getElementById("ingr-suppliers-grid-container");
        if (!container) return;

        container.innerHTML = window.ingredientState.suppliers.map(sup => {
            return `
                <div class="ingr-supplier-profile-card">
                    <div class="ingr-supplier-card-header">
                        <div class="ingr-supplier-card-avatar">
                            <i class="fa-solid fa-truck"></i>
                        </div>
                        <div class="ingr-supplier-card-title-box">
                            <h4 class="ingr-supplier-card-name">${sup.name}</h4>
                            <span class="ingr-supplier-card-meta">ID: ${sup.id}</span>
                        </div>
                    </div>
                    <div class="ingr-supplier-card-body">
                        <div class="ingr-supplier-card-contact-row">
                            <i class="fa-solid fa-envelope"></i>
                            <span>${sup.email}</span>
                        </div>
                        <div class="ingr-supplier-card-contact-row">
                            <i class="fa-solid fa-phone"></i>
                            <span>${sup.phone}</span>
                        </div>
                        <div class="ingr-supplier-card-contact-row">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${sup.address}</span>
                        </div>
                    </div>
                    <div class="ingr-supplier-card-actions">
                        <button class="ingr-outline-add-btn" style="padding: 7px 12px; font-size: 0.75rem;" onclick="window.viewSupplierHistory('${sup.id}', '${sup.name}')"><i class="fa-solid fa-history"></i> Lịch sử</button>
                        <button class="ingr-ingredient-action-btn-circle" onclick="window.editSupplier('${sup.id}')" title="Sửa nhà cung cấp"><i class="fa-solid fa-pen-to-square"></i></button>
                    </div>
                </div>
            `;
        }).join("");
    }

    // Modal historical goods receipt per supplier
    window.viewSupplierHistory = function(supId, supName) {
        const modal = document.getElementById("ingr-supplier-history-modal");
        const tbody = document.getElementById("ingr-supplier-history-table-body");
        document.getElementById("ingr-supplier-history-title").textContent = `Lịch sử giao hàng: ${supName}`;

        // Get transactions belonging to imports from this supplier
        // Simulating matching transaction logs
        const imports = window.ingredientState.history.filter(h => h.type === "IMPORT" && h.details.includes(supName) || h.details.includes(supId));

        if (imports.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--ingr-text-disabled); padding: 30px;">Chưa phát sinh phiếu nhập hàng nào từ nhà cung cấp này.</td></tr>`;
        } else {
            tbody.innerHTML = imports.map(tx => {
                const ingr = window.ingredientState.ingredients.find(i => i.id === tx.ingredientId);
                const name = ingr ? ingr.name : "Nguyên liệu";
                const price = ingr ? ingr.price : 0;
                const total = Math.abs(tx.qty) * price;

                return `
                    <tr>
                        <td>${new Date(tx.timestamp).toLocaleDateString("vi-VN")}</td>
                        <td><strong style="color: var(--ingr-text-muted); font-size: 0.75rem;">${tx.id}</strong></td>
                        <td><span style="font-weight: 600; color: #fff;">${name}</span></td>
                        <td style="text-align: right; font-weight: 700;">+${tx.qty}</td>
                        <td style="text-align: right;">${price.toLocaleString("vi-VN")} đ</td>
                        <td style="text-align: right; color: var(--ingr-accent-amber); font-weight: 700;">${total.toLocaleString("vi-VN")} đ</td>
                    </tr>
                `;
            }).join("");
        }

        modal.classList.add("active");
    };

    // Close Supplier historical modal
    const closeSupHistBtn = document.getElementById("ingr-supplier-history-close");
    if (closeSupHistBtn) {
        closeSupHistBtn.onclick = function() {
            document.getElementById("ingr-supplier-history-modal").classList.remove("active");
        };
    }

    // 10. RENDER REPORTS & ANALYTICS
    function renderReports() {
        const stats = calculateGlobalStats();

        // mini card stats
        document.getElementById("ingr-reports-total-cost").textContent = (stats.totalValue * 0.42).toLocaleString("vi-VN") + " đ";
        document.getElementById("ingr-reports-waste-cost").textContent = (stats.totalValue * 0.035).toLocaleString("vi-VN") + " đ";
        document.getElementById("ingr-reports-total-orders").textContent = window.ingredientState.history.filter(h => h.type === "IMPORT").length + " đơn";

        // CHART 1: MONTHLY LEDGER SPENDING LINE
        const ctxSpend = document.getElementById("ingr-report-spend-chart");
        if (ctxSpend) {
            if (reportSpendChartInstance) reportSpendChartInstance.destroy();

            reportSpendChartInstance = new Chart(ctxSpend, {
                type: "line",
                data: {
                    labels: ["Tháng 12", "Tháng 01", "Tháng 02", "Tháng 03", "Tháng 04", "Tháng 05 (Hiện tại)"],
                    datasets: [
                        {
                            label: "Chi phí Nhập Kho (triệu đ)",
                            data: [120, 145, 98, 160, 185, stats.totalValue / 1000000],
                            borderColor: "#e88735",
                            backgroundColor: "rgba(232, 135, 53, 0.1)",
                            borderWidth: 3,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: "Giá trị Hao hụt/Xuất hủy (triệu đ)",
                            data: [4.5, 6.2, 3.8, 5.0, 7.8, (stats.totalValue * 0.035) / 1000000],
                            borderColor: "#ef4444",
                            backgroundColor: "rgba(239, 68, 68, 0.05)",
                            borderWidth: 2,
                            tension: 0.3,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            ticks: { color: "#94a3b8" },
                            grid: { color: "#2a2f3d" }
                        },
                        x: {
                            ticks: { color: "#94a3b8" },
                            grid: { color: "#2a2f3d" }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: "#e2e8f0" }
                        }
                    }
                }
            });
        }

        // CHART 2: TOP USED INGREDIENT HORIZONTAL BAR
        const ctxTop = document.getElementById("ingr-report-top-ingredients-chart");
        if (ctxTop) {
            if (reportTopChartInstance) reportTopChartInstance.destroy();

            // Populate top used items
            // Simulates top items from ingredients
            const sortedIngr = [...window.ingredientState.ingredients].sort((a, b) => b.price - a.price).slice(0, 5);
            const labels = sortedIngr.map(i => i.name);
            const dataVals = [85, 72, 60, 55, 40]; // Mock usage count

            reportTopChartInstance = new Chart(ctxTop, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Tần suất sử dụng trong chế biến (Lần)",
                        data: dataVals,
                        backgroundColor: "rgba(16, 185, 129, 0.75)",
                        borderColor: "#10b981",
                        borderWidth: 1,
                        borderRadius: 6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: { color: "#94a3b8" },
                            grid: { color: "#2a2f3d" }
                        },
                        y: {
                            ticks: { color: "#e2e8f0" },
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    // ==========================================================================
    // NOTIFICATION DROPDOWN POPULATER
    // ==========================================================================
    function renderGlobalHeaderNotifications() {
        const dropdown = document.getElementById("ingr-notifications-dropdown-list");
        const countSpan = document.getElementById("ingr-header-bell-count");
        if (!dropdown) return;

        const unreadList = window.ingredientState.notifications.filter(n => !n.read);
        countSpan.textContent = unreadList.length;
        if (unreadList.length === 0) {
            countSpan.classList.add("hidden");
        } else {
            countSpan.classList.remove("hidden");
        }

        if (window.ingredientState.notifications.length === 0) {
            dropdown.innerHTML = `<div style="text-align: center; color: var(--ingr-text-disabled); padding: 30px; font-size: 0.8rem;">Chưa nhận được thông báo mới nào.</div>`;
            return;
        }

        dropdown.innerHTML = window.ingredientState.notifications.map(n => {
            let icon = "fa-circle-info";
            if (n.type === "expired" || n.type === "critical") icon = "fa-triangle-exclamation";
            if (n.type === "warning") icon = "fa-circle-exclamation";
            if (n.type === "success") icon = "fa-circle-check";

            return `
                <div class="ingr-notification-list-item ${n.read ? '' : 'unread'}" onclick="window.markNotificationRead('${n.id}')">
                    <div class="ingr-notification-item-icon ${n.type === 'expired' || n.type === 'critical' ? 'critical' : n.type === 'warning' ? 'warning' : 'success'}">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="ingr-notification-item-content">
                        <span class="ingr-notification-item-title">${n.title}</span>
                        <span class="ingr-notification-item-title" style="font-weight: 500; color: var(--ingr-text-muted); font-size: 0.72rem; margin-top: 2px;">${n.message}</span>
                        <span class="ingr-notification-item-time">${n.time}</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    window.markNotificationRead = function(id) {
        const notif = window.ingredientState.notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            saveState();
            renderGlobalHeaderNotifications();
        }
    };

    const notifMarkAllBtn = document.getElementById("ingr-notifications-clear-btn");
    if (notifMarkAllBtn) {
        notifMarkAllBtn.onclick = function(e) {
            e.stopPropagation();
            window.ingredientState.notifications.forEach(n => n.read = true);
            saveState();
            renderGlobalHeaderNotifications();
            window.showToast("Thông báo", "Đã đánh dấu đọc toàn bộ thông báo hệ thống.", "success");
        };
    }

    // SIDEBAR BADGE ALERTS COUNTER
    function renderGlobalSidebarAlerts() {
        const badge = document.getElementById("ingr-badge-global-warnings");
        if (!badge) return;

        // Calculate count of warning stock items
        const warningsCount = window.ingredientState.ingredients.filter(ingr => {
            const status = getIngredientStatus(ingr);
            return status === "critical" || status === "warning" || status === "expired";
        }).length;

        badge.textContent = warningsCount;
        if (warningsCount === 0) {
            badge.style.display = "none";
        } else {
            badge.style.display = "block";
        }
    }

    // ==========================================================================
    // CRUD OPERATIONS CORE HANDLERS
    // ==========================================================================

    // A. INGREDIENT CRUD
    const ingrModal = document.getElementById("ingr-ingredient-crud-modal");
    const ingrForm = document.getElementById("ingr-ingredient-form-element");

    document.getElementById("ingr-btn-add-ingredient").onclick = function () {
        document.getElementById("ingr-ingredient-modal-title").textContent = "Thêm Nguyên Liệu Mới";
        ingrForm.reset();
        document.getElementById("ingr-form-ingredient-id").value = "";
        document.getElementById("ingr-form-ingredient-code").readOnly = false;

        // Populate Category selects inside form
        const categorySelect = document.getElementById("ingr-form-ingredient-category");
        categorySelect.innerHTML = `<option value="">-- Chọn danh mục --</option>` +
            window.ingredientState.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

        ingrModal.classList.add("active");
    };

    window.editIngredient = function (id) {
        const ingr = window.ingredientState.ingredients.find(i => i.id === id);
        if (!ingr) return;

        document.getElementById("ingr-ingredient-modal-title").textContent = "Cập nhật Nguyên Liệu";
        document.getElementById("ingr-form-ingredient-id").value = ingr.id;
        
        const codeInput = document.getElementById("ingr-form-ingredient-code");
        codeInput.value = ingr.code;
        codeInput.readOnly = true;

        document.getElementById("ingr-form-ingredient-name").value = ingr.name;
        document.getElementById("ingr-form-ingredient-unit").value = ingr.unit;
        document.getElementById("ingr-form-ingredient-stock").value = ingr.stock;
        document.getElementById("ingr-form-ingredient-min-stock").value = ingr.minStock;
        document.getElementById("ingr-form-ingredient-expiry").value = ingr.expiry;
        document.getElementById("ingr-form-ingredient-price").value = ingr.price;

        const categorySelect = document.getElementById("ingr-form-ingredient-category");
        categorySelect.innerHTML = window.ingredientState.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
        categorySelect.value = ingr.categoryId;

        ingrModal.classList.add("active");
    };

    // Close ingredient modal
    const closeIngrBtn = document.getElementById("ingr-ingredient-modal-close");
    const cancelIngrBtn = document.getElementById("ingr-ingredient-modal-cancel-btn");
    const dismissIngrModal = () => ingrModal.classList.remove("active");
    if (closeIngrBtn) closeIngrBtn.onclick = dismissIngrModal;
    if (cancelIngrBtn) cancelIngrBtn.onclick = dismissIngrModal;

    // Submit ingredient form
    ingrForm.onsubmit = async function (e) {
        e.preventDefault();

        const id = document.getElementById("ingr-form-ingredient-id").value;
        const code = document.getElementById("ingr-form-ingredient-code").value;
        const name = document.getElementById("ingr-form-ingredient-name").value;
        const categoryId = document.getElementById("ingr-form-ingredient-category").value;
        const unit = document.getElementById("ingr-form-ingredient-unit").value;
        const stock = parseFloat(document.getElementById("ingr-form-ingredient-stock").value) || 0;
        const minStock = parseFloat(document.getElementById("ingr-form-ingredient-min-stock").value) || 0;
        const expiry = document.getElementById("ingr-form-ingredient-expiry").value;
        const price = parseFloat(document.getElementById("ingr-form-ingredient-price").value) || 0;

        // Perform validation checks
        if (!code || !name || !categoryId || !unit || !expiry) {
            window.showToast("Cảnh báo form", "Vui lòng nhập đầy đủ các trường thông tin bắt buộc.", "warning");
            return;
        }

        const isNew = !id;
        const submitBtn = document.getElementById("ingr-ingredient-modal-submit-btn");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...`;

        try {
            await fetch("/api/ingredients", {
                method: "POST",
                body: JSON.stringify({ id, code, name, categoryId, unit, stock, minStock, expiry, price })
            });

            // Log activity
            await fetch("/api/transactions", {
                method: "POST",
                body: JSON.stringify({
                    type: "CRUD",
                    details: isNew ? "Khởi tạo nguyên liệu mới" : "Cập nhật thông số kỹ thuật nguyên liệu",
                    ingredientId: code,
                    qty: 0,
                    user: "Nguyễn Minh Nam"
                })
            });

            window.showToast(
                isNew ? "Thành công" : "Cập nhật thành công",
                isNew ? `Nguyên liệu '${name}' đã được thêm thành công.` : `Thông số nguyên liệu '${name}' đã được đồng bộ.`,
                "success"
            );

            dismissIngrModal();
            renderIngredients();
            renderGlobalSidebarAlerts();
        } catch (err) {
            window.showToast("Lỗi hệ thống", "Có lỗi xảy ra khi kết nối máy chủ.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Lưu nguyên liệu";
        }
    };

    window.deleteIngredient = async function (id) {
        const ingr = window.ingredientState.ingredients.find(i => i.id === id);
        if (!ingr) return;

        if (!confirm(`Bạn có chắc chắn muốn xóa nguyên liệu '${ingr.name}' (${ingr.code}) khỏi kho hệ thống?`)) return;

        try {
            await fetch(`/api/ingredients?id=${id}`, { method: "DELETE" });
            window.showToast("Xóa thành công", `Đã loại bỏ nguyên liệu '${ingr.name}' ra khỏi cơ sở dữ liệu.`, "success");
            renderIngredients();
            renderGlobalSidebarAlerts();
        } catch (err) {
            window.showToast("Lỗi kết nối", "Không thể xóa nguyên liệu do lỗi mạng.", "error");
        }
    };

    // B. CATEGORIES CRUD
    const catModal = document.getElementById("ingr-category-crud-modal");
    const catForm = document.getElementById("ingr-category-form-element");

    document.getElementById("ingr-btn-add-category").onclick = function () {
        document.getElementById("ingr-category-modal-title").textContent = "Thêm Danh Mục Mới";
        catForm.reset();
        document.getElementById("ingr-form-category-id").value = "";
        
        // Reset color indicator
        const nativePicker = document.getElementById("ingr-form-category-color-picker");
        nativePicker.value = "#e88735";
        document.querySelectorAll(".ingr-preset-color-circle").forEach(c => {
            if (c.getAttribute("data-color") === "#e88735") c.classList.add("active");
            else c.classList.remove("active");
        });

        catModal.classList.add("active");
    };

    window.editCategory = function (id) {
        const cat = window.ingredientState.categories.find(c => c.id === id);
        if (!cat) return;

        document.getElementById("ingr-category-modal-title").textContent = "Cập nhật Danh Mục";
        document.getElementById("ingr-form-category-id").value = cat.id;
        document.getElementById("ingr-form-category-name").value = cat.name;
        document.getElementById("ingr-form-category-description").value = cat.description || "";
        
        const nativePicker = document.getElementById("ingr-form-category-color-picker");
        nativePicker.value = cat.color;

        document.querySelectorAll(".ingr-preset-color-circle").forEach(c => {
            if (c.getAttribute("data-color") === cat.color) c.classList.add("active");
            else c.classList.remove("active");
        });

        catModal.classList.add("active");
    };

    // Close Category Modal
    const closeCatBtn = document.getElementById("ingr-category-modal-close");
    const cancelCatBtn = document.getElementById("ingr-category-modal-cancel-btn");
    const dismissCatModal = () => catModal.classList.remove("active");
    if (closeCatBtn) closeCatBtn.onclick = dismissCatModal;
    if (cancelCatBtn) cancelCatBtn.onclick = dismissCatModal;

    // Presets color picking binder
    document.querySelectorAll(".ingr-preset-color-circle").forEach(circle => {
        circle.onclick = function() {
            document.querySelectorAll(".ingr-preset-color-circle").forEach(c => c.classList.remove("active"));
            circle.classList.add("active");
            document.getElementById("ingr-form-category-color-picker").value = circle.getAttribute("data-color");
        };
    });

    catForm.onsubmit = async function (e) {
        e.preventDefault();
        const id = document.getElementById("ingr-form-category-id").value;
        const name = document.getElementById("ingr-form-category-name").value;
        const color = document.getElementById("ingr-form-category-color-picker").value;
        const description = document.getElementById("ingr-form-category-description").value;

        if (!name) return;

        const isNew = !id;

        try {
            await fetch("/api/categories", {
                method: "POST",
                body: JSON.stringify({ id, name, color, description })
            });

            window.showToast(
                isNew ? "Thêm danh mục thành công" : "Cập nhật thành công",
                `Danh mục '${name}' đã được lưu trữ trong danh sách nhóm.`,
                "success"
            );
            dismissCatModal();
            renderCategories();
        } catch (err) {
            window.showToast("Lỗi lưu trữ", "Có lỗi xảy ra.", "error");
        }
    };

    window.deleteCategory = async function (id) {
        const cat = window.ingredientState.categories.find(c => c.id === id);
        if (!cat) return;

        // Check if contains ingredients
        const hasIngr = window.ingredientState.ingredients.some(i => i.categoryId === id);
        if (hasIngr) {
            window.showToast("Không thể xóa", "Danh mục này hiện chứa nguyên liệu hoạt động. Hãy chuyển nhóm nguyên liệu trước khi thực hiện.", "error");
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa danh mục '${cat.name}'?`)) return;

        try {
            await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
            window.showToast("Xóa thành công", "Danh mục đã được xóa.", "success");
            renderCategories();
        } catch (err) {
            window.showToast("Lỗi hệ thống", "Có lỗi xảy ra.", "error");
        }
    };

    // C. SUPPLIER CRUD
    const supModal = document.getElementById("ingr-supplier-crud-modal");
    const supForm = document.getElementById("ingr-supplier-form-element");

    document.getElementById("ingr-btn-add-supplier").onclick = function () {
        document.getElementById("ingr-supplier-modal-title").textContent = "Thêm Nhà Cung Cấp Mới";
        supForm.reset();
        document.getElementById("ingr-form-supplier-id").value = "";
        supModal.classList.add("active");
    };

    window.editSupplier = function (id) {
        const sup = window.ingredientState.suppliers.find(s => s.id === id);
        if (!sup) return;

        document.getElementById("ingr-supplier-modal-title").textContent = "Cập nhật Nhà Cung Cấp";
        document.getElementById("ingr-form-supplier-id").value = sup.id;
        document.getElementById("ingr-form-supplier-name").value = sup.name;
        document.getElementById("ingr-form-supplier-email").value = sup.email;
        document.getElementById("ingr-form-supplier-phone").value = sup.phone;
        document.getElementById("ingr-form-supplier-address").value = sup.address;

        supModal.classList.add("active");
    };

    // Close Supplier Modal
    const closeSupBtn = document.getElementById("ingr-supplier-modal-close");
    const cancelSupBtn = document.getElementById("ingr-supplier-modal-cancel-btn");
    const dismissSupModal = () => supModal.classList.remove("active");
    if (closeSupBtn) closeSupBtn.onclick = dismissSupModal;
    if (cancelSupBtn) cancelSupBtn.onclick = dismissSupModal;

    supForm.onsubmit = async function (e) {
        e.preventDefault();
        const id = document.getElementById("ingr-form-supplier-id").value;
        const name = document.getElementById("ingr-form-supplier-name").value;
        const email = document.getElementById("ingr-form-supplier-email").value;
        const phone = document.getElementById("ingr-form-supplier-phone").value;
        const address = document.getElementById("ingr-form-supplier-address").value;

        if (!name || !email || !phone || !address) return;

        const isNew = !id;

        try {
            await fetch("/api/suppliers", {
                method: "POST",
                body: JSON.stringify({ id, name, email, phone, address })
            });

            window.showToast(
                isNew ? "Thêm NCC thành công" : "Cập nhật thành công",
                `Thông tin nhà cung cấp '${name}' đã được lưu trữ.`,
                "success"
            );
            dismissSupModal();
            renderSuppliers();
        } catch (err) {
            window.showToast("Lỗi hệ thống", "Có lỗi xảy ra.", "error");
        }
    };


    // ==========================================================================
    // TRANSACTION PROCESSORS (SUBMIT GOODS RECEIPT / GOODS ISSUE)
    // ==========================================================================

    // A. SUBMIT GOODS RECEIPT
    const receiptForm = document.getElementById("ingr-receipt-creation-form");
    if (receiptForm) {
        receiptForm.onsubmit = async function(e) {
            e.preventDefault();

            const supplierSelect = document.getElementById("ingr-receipt-supplier");
            const supplierId = supplierSelect.value;
            const supplierName = supplierSelect.options[supplierSelect.selectedIndex].text;
            const rows = document.querySelectorAll("#ingr-receipt-items-tbody tr");

            if (!supplierId) {
                window.showToast("Cảnh báo nhập kho", "Vui lòng lựa chọn nhà cung cấp trước khi ghi nhận.", "warning");
                return;
            }

            const promises = [];
            rows.forEach(tr => {
                const select = tr.querySelector("select");
                const qtyInput = tr.querySelector("input[type='number']");
                const priceInput = tr.querySelectorAll("input")[1];

                const ingrId = select.value;
                const qty = parseFloat(qtyInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;

                if (ingrId && qty > 0) {
                    promises.push(
                        fetch("/api/transactions", {
                            method: "POST",
                            body: JSON.stringify({
                                type: "IMPORT",
                                details: `Nhập kho từ đối tác ${supplierName}`,
                                ingredientId: ingrId,
                                qty: qty,
                                user: "Nguyễn Minh Nam"
                            })
                        })
                    );
                }
            });

            if (promises.length === 0) {
                window.showToast("Cảnh báo phiếu", "Vui lòng lựa chọn ít nhất một nguyên liệu với số lượng nhập khả dụng.", "warning");
                return;
            }

            try {
                await Promise.all(promises);
                window.showToast("Nhập kho thành công", "Phiếu nhập hàng đã được duyệt, số lượng tồn kho đã được cộng thêm.", "success");
                
                // Clear simulated upload invoice attachment
                document.getElementById("ingr-receipt-file-badge").classList.add("hidden");
                document.getElementById("ingr-receipt-file-input").value = "";

                // Reset Goods Receipt Form
                renderGoodsReceipt();
                renderGlobalSidebarAlerts();
            } catch (err) {
                window.showToast("Lỗi nhập kho", "Có lỗi xảy ra trong quá trình cập nhật.", "error");
            }
        };

        // Reset receipt form trigger
        document.getElementById("ingr-receipt-reset-form-btn").onclick = renderGoodsReceipt;
    }

    // DRAG AND DROP SIMULATION FOR RECEIPT INVOICE
    const uploadZone = document.getElementById("ingr-receipt-upload-zone");
    const fileInput = document.getElementById("ingr-receipt-file-input");
    const fileBadge = document.getElementById("ingr-receipt-file-badge");
    const filenameSpan = document.getElementById("ingr-receipt-filename");
    const removeFileBtn = document.getElementById("ingr-receipt-remove-file-btn");

    if (uploadZone) {
        uploadZone.onclick = () => fileInput.click();
        
        uploadZone.ondragover = function(e) {
            e.preventDefault();
            uploadZone.classList.add("dragover");
        };

        uploadZone.ondragleave = function() {
            uploadZone.classList.remove("dragover");
        };

        uploadZone.ondrop = function(e) {
            e.preventDefault();
            uploadZone.classList.remove("dragover");
            if (e.dataTransfer.files.length > 0) {
                handleUploadedFile(e.dataTransfer.files[0]);
            }
        };

        fileInput.onchange = function() {
            if (fileInput.files.length > 0) {
                handleUploadedFile(fileInput.files[0]);
            }
        };

        function handleUploadedFile(file) {
            filenameSpan.textContent = file.name;
            fileBadge.classList.remove("hidden");
            window.showToast("Tải hóa đơn điện tử", `Đã đính kèm tệp '${file.name}' vào phiếu nhập hàng thành công.`, "success");
        }

        if (removeFileBtn) {
            removeFileBtn.onclick = function(e) {
                e.stopPropagation();
                fileInput.value = "";
                fileBadge.classList.add("hidden");
                window.showToast("Gỡ hóa đơn", "Đã gỡ hóa đơn điện tử khỏi phiếu nhập.", "info");
            };
        }
    }

    // B. SUBMIT GOODS ISSUE
    const issueForm = document.getElementById("ingr-issue-creation-form");
    if (issueForm) {
        issueForm.onsubmit = async function(e) {
            e.preventDefault();

            const reasonSelect = document.getElementById("ingr-issue-reason");
            const reason = reasonSelect.value;
            const note = document.getElementById("ingr-issue-note").value;
            const rows = document.querySelectorAll("#ingr-issue-items-tbody tr");

            if (!reason) {
                window.showToast("Cảnh báo xuất kho", "Vui lòng lựa chọn lý do/nơi nhận để hoàn tất xuất kho.", "warning");
                return;
            }

            const promises = [];
            let quantityError = false;

            rows.forEach(tr => {
                const select = tr.querySelector("select");
                const qtyInput = tr.querySelector("input[type='number']");
                
                const ingrId = select.value;
                const qty = parseFloat(qtyInput.value) || 0;

                if (ingrId && qty > 0) {
                    // double check stock quantity
                    const option = select.options[select.selectedIndex];
                    const stock = parseFloat(option.getAttribute("data-stock"));

                    if (qty > stock) {
                        quantityError = true;
                    } else {
                        promises.push(
                            fetch("/api/transactions", {
                                method: "POST",
                                body: JSON.stringify({
                                    type: "EXPORT",
                                    details: `Xuất kho: ${reason} (${note || "Xuất trực tiếp"})`,
                                    ingredientId: ingrId,
                                    qty: -qty,
                                    user: "Nguyễn Minh Nam"
                                })
                            })
                        );
                    }
                }
            });

            if (quantityError) {
                window.showToast("Lỗi định lượng", "Có dòng nguyên liệu vượt quá lượng tồn thực tế. Vui lòng kiểm tra lại.", "error");
                return;
            }

            if (promises.length === 0) {
                window.showToast("Cảnh báo phiếu", "Vui lòng chọn ít nhất một nguyên liệu hợp lệ.", "warning");
                return;
            }

            try {
                await Promise.all(promises);
                window.showToast("Xuất kho thành công", "Đã duyệt phiếu xuất kho. Tồn hệ thống đã được khấu trừ phù hợp.", "success");
                
                // Clear & Reset Issue Form
                renderGoodsIssue();
                renderGlobalSidebarAlerts();
            } catch (err) {
                window.showToast("Lỗi xuất kho", "Có lỗi xảy ra khi thực hiện.", "error");
            }
        };

        // Reset issue trigger
        document.getElementById("ingr-issue-reset-btn").onclick = renderGoodsIssue;
    }


    // ==========================================================================
    // BIND EVENT LISTENERS & ROUTING INITIALIZATION
    // ==========================================================================

    // Accordion click folding transitions
    document.querySelectorAll(".ingr-sidebar-accordion-header").forEach(header => {
        header.onclick = function() {
            const group = header.closest(".ingr-sidebar-accordion-group");
            const content = group.querySelector(".ingr-sidebar-accordion-content");
            const arrow = group.querySelector(".ingr-accordion-arrow");

            header.classList.toggle("active");
            content.classList.toggle("open");
        };
    });

    // Sidebar expand/collapse animations
    const sidebar = document.getElementById("ingr-sidebar-element");
    const collapseTrigger = document.getElementById("ingr-sidebar-collapse-trigger");
    if (collapseTrigger) {
        collapseTrigger.onclick = function() {
            sidebar.classList.toggle("collapsed");
            
            // Adjust margin layout of workspace slightly if needed
            const viewport = document.querySelector(".ingr-main-viewport-container");
            if (sidebar.classList.contains("collapsed")) {
                collapseTrigger.setAttribute("title", "Mở rộng sidebar");
            } else {
                collapseTrigger.setAttribute("title", "Thu gọn sidebar");
            }
        };
    }

    // Mobile menu drawer overlay toggle
    const mobileToggle = document.getElementById("ingr-mobile-toggle-btn");
    if (mobileToggle) {
        mobileToggle.onclick = function(e) {
            e.stopPropagation();
            sidebar.classList.add("mobile-open");
        };
    }

    // Click outside mobile drawer closes it
    document.addEventListener("click", function(e) {
        if (!sidebar.contains(e.target) && sidebar.classList.contains("mobile-open")) {
            sidebar.classList.remove("mobile-open");
        }
    });

    // Header Notification panel toggle trigger
    const notifTrigger = document.getElementById("ingr-notifications-dropdown-trigger");
    const notifPanel = document.getElementById("ingr-notifications-panel");
    if (notifTrigger) {
        notifTrigger.onclick = function(e) {
            e.stopPropagation();
            notifPanel.classList.toggle("active");
        };

        document.addEventListener("click", function() {
            notifPanel.classList.remove("active");
        });
    }

    // MAIN ROUTING DOCK BINDER
    const menuItems = document.querySelectorAll(".ingr-sidebar-menu-item");
    menuItems.forEach(item => {
        item.onclick = function(e) {
            e.preventDefault();

            const tab = item.getAttribute("data-tab");
            if (!tab) return;

            // Remove active tags on all menu options
            menuItems.forEach(mi => mi.classList.remove("active"));
            item.classList.add("active");

            // Close mobile drawer on item click
            sidebar.classList.remove("mobile-open");

            // Setup Header Title
            const tabText = item.querySelector(".ingr-menu-text").textContent;
            document.getElementById("ingr-header-tab-title").textContent = tabText;

            // Render skeleton loading before launching tab
            const panes = document.querySelectorAll(".ingr-tab-panel");
            panes.forEach(pane => pane.classList.remove("active"));

            const targetPane = document.getElementById(`ingr-panel-${tab}`);
            if (targetPane) {
                targetPane.classList.add("active");
                
                // Trigger simulated fetch loading animations
                const cacheOriginalContent = targetPane.innerHTML;
                showSkeleton(targetPane.id, tab === "dashboard" ? "short" : "");
                
                setTimeout(() => {
                    targetPane.innerHTML = cacheOriginalContent;
                    
                    // Trigger actual render routine for specific panel
                    if (tab === "dashboard") renderDashboard();
                    if (tab === "ingredients") renderIngredients();
                    if (tab === "categories") renderCategories();
                    if (tab === "goods-receipt") renderGoodsReceipt();
                    if (tab === "goods-issue") renderGoodsIssue();
                    if (tab === "audit") renderAudit();
                    if (tab === "warnings") renderWarnings();
                    if (tab === "history") renderHistory();
                    if (tab === "suppliers") renderSuppliers();
                    if (tab === "reports") renderReports();
                }, 400); // Matches intercept server delay
            }
        };
    });

    // BIND INGREDIENT FILTER DYNAMIC TRIGGERS
    const searchIngrInput = document.getElementById("ingr-search-ingredient-input");
    const filterCatDropdown = document.getElementById("ingr-filter-ingredient-category");
    const filterStatDropdown = document.getElementById("ingr-filter-ingredient-status");

    if (searchIngrInput) {
        searchIngrInput.oninput = function() {
            window.ingredientState.activeFilters.search = searchIngrInput.value;
            window.ingredientState.pagination.page = 1;
            renderIngredients();
        };
    }
    if (filterCatDropdown) {
        filterCatDropdown.onchange = function() {
            window.ingredientState.activeFilters.category = filterCatDropdown.value;
            window.ingredientState.pagination.page = 1;
            renderIngredients();
        };
    }
    if (filterStatDropdown) {
        filterStatDropdown.onchange = function() {
            window.ingredientState.activeFilters.status = filterStatDropdown.value;
            window.ingredientState.pagination.page = 1;
            renderIngredients();
        };
    }

    // Global Search header input hook
    const globalSearch = document.getElementById("ingr-global-header-search");
    if (globalSearch) {
        globalSearch.oninput = function() {
            const q = globalSearch.value;
            window.ingredientState.activeFilters.search = q;
            
            // Redirect automatically to ingredients list if on other tab
            const ingrTabBtn = document.querySelector(`[data-tab="ingredients"]`);
            if (ingrTabBtn && !ingrTabBtn.classList.contains("active")) {
                ingrTabBtn.click();
            } else {
                renderIngredients();
            }
        };
    }

    // ==========================================================================
    // BOOTSTRAP INITIALIZATION ON LOAD
    // ==========================================================================
    window.onload = function() {
        // Load initial UI dropdown categories list
        const catFilter = document.getElementById("ingr-filter-ingredient-category");
        if (catFilter) {
            catFilter.innerHTML = `<option value="all">Tất cả danh mục</option>` +
                window.ingredientState.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
        }

        renderDashboard();
        renderGlobalHeaderNotifications();
        renderGlobalSidebarAlerts();
        
        window.showToast("Chào mừng", "Hệ thống Quản lý kho Kurumi BBQ đã khởi động thành công.", "success");
    };

})();
