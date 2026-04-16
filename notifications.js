document.addEventListener('DOMContentLoaded', () => {
  // Kịch bản (Mockup): Biến giả lập trạng thái đăng nhập
  let isLoggedIn = true; 

  const contentSections = document.querySelectorAll('.acc-content-section');
  
  // Hàm cập nhật giao diện Auth
  const updateAuthUI = () => {
    contentSections.forEach(sec => {
      const loggedInContent = sec.querySelector('.acc-logged-in-content');
      const guestContent = sec.querySelector('.acc-guest-content');
      
      if (loggedInContent && guestContent) {
        if (!isLoggedIn) {
          loggedInContent.style.display = 'none';
          guestContent.style.display = 'flex';
        } else {
          loggedInContent.style.display = 'block';
          guestContent.style.display = 'none';
        }
      }
    });

    // Mở khóa empty state bằng cách re-trigger active tab
    if (isLoggedIn) {
      setTimeout(() => {
        const initialTabs = document.querySelectorAll('.acc-filter-tabs .acc-tab-btn.active');
        initialTabs.forEach(tab => tab.click());
      }, 0);
    }
  };

  // Khởi chạy lần đầu
  updateAuthUI();
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

        // Đếm số lượng card đang hiển thị
        let visibleCount = 0;
        cards.forEach(c => {
          if (c.style.display !== 'none') visibleCount++;
        });

        // Hiển thị hoặc ẩn empty state
        const emptyState = parentSection.querySelector('.acc-empty-state');
        if (emptyState) {
          if (visibleCount === 0) {
            emptyState.style.display = 'flex';
          } else {
            emptyState.style.display = 'none';
          }
        }
      });
    });
  });
});
