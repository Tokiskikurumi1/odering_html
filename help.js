// help.js
document.addEventListener('DOMContentLoaded', function () {
  const accordionItems = document.querySelectorAll('.hlp-accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.hlp-accordion-header');

    header.addEventListener('click', () => {
      // Đóng các accordion khác nếu bạn chỉ muốn 1 cái mở tại 1 thời điểm (Tắt đoạn này nếu muốn mở nhiều cái cùng lúc)
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.hlp-accordion-content');
          otherContent.style.maxHeight = null;
        }
      });

      // Bật/tắt accordion hiện tại
      item.classList.toggle('active');
      const content = item.querySelector('.hlp-accordion-content');

      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });
});
