document.addEventListener('DOMContentLoaded', () => {
  // Lấy danh sách các liên kết menu sidebar
  const navLinks = document.querySelectorAll('.acc-nav-link');
  // Lấy danh sách các section chứa nội dung hiển thị
  const sections = document.querySelectorAll('.acc-content-section');

  // Đảm bảo section đầu tiên (Thông báo) luôn hiện ở trạng thái ban đầu (nếu cần thiết, tuỳ thuộc vào HTML)
  // Thực tế HTML đã có sẵn thẻ set class 'active'.

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Nếu là nút Thoát thì bỏ qua
      if (link.classList.contains('logout')) {
        return;
      }

      // Ngăn chặn mặc định link (với các link có href target "#")
      e.preventDefault();

      // Lấy data-target từ thẻ a, ví dụ data-target="section-notifications"
      const targetId = link.getAttribute('data-target');
      if (!targetId) return; // Nếu ko có mục tiêu thì thôi

      // Xóa active khỏi tất cả liên kết nav
      navLinks.forEach((nv) => nv.classList.remove('active'));
      // Thêm active vào link được click
      link.classList.add('active');

      // Duyệt qua tất cả các section, ẩn đi và dùng animation thu gọn
      sections.forEach((sec) => {
        if (sec.id === targetId) {
          sec.style.display = 'block';
          // Force layout recalculation to apply CSS transition if needed
          void sec.offsetWidth; 
          sec.style.opacity = '1';
          sec.style.transform = 'translateY(0)';

          // Reset lại bộ lọc về tab đầu tiên mỗi khi vào lại mục này
          const firstTabBtn = sec.querySelector('.acc-filter-tabs .acc-tab-btn');
          if (firstTabBtn && !firstTabBtn.classList.contains('active')) {
            firstTabBtn.click();
          }
        } else {
          sec.style.display = 'none';
          sec.style.opacity = '0';
          sec.style.transform = 'translateY(10px)';
        }
      });
    });
  });

  // Xử lý bộ lọc cho từng section
  const filterTabsGroups = document.querySelectorAll('.acc-filter-tabs');

  filterTabsGroups.forEach((group) => {
    const tabBtns = group.querySelectorAll('.acc-tab-btn');
    
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Xóa class active của các tab cùng nhóm
        tabBtns.forEach(t => t.classList.remove('active'));
        // Thêm active cho tab được click
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        
        // Tìm section chứa nhóm tab này
        const parentSection = btn.closest('.acc-content-section');
        if (!parentSection) return;

        // Lấy danh sách các card trong section này
        // (bao gồm cả card thông báo, đơn đặt bàn, khuyến mãi)
        const cards = parentSection.querySelectorAll('.acc-notif-card, .acc-reservation-card, .acc-promo-card');

        cards.forEach((card) => {
          const category = card.getAttribute('data-category') || '';
          
          if (filterValue === 'all') {
            card.style.display = 'flex'; // Hầu hết card có dùng d-flex
          } else {
            // Kiểm tra xem data-category của card có chứa filterValue không
            if (category.includes(filterValue)) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  });
});
