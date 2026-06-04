function initIngredientSidebar() {
  console.log("Sidebar Loaded");

  const currentPage = location.pathname.split("/").pop();

  // Active menu theo trang hiện tại
  document.querySelectorAll(".ingr-sidebar-menu-item").forEach((link) => {
    const href = link.getAttribute("href");

    if (href && href.includes(currentPage)) {
      link.classList.add("active");

      const accordion = link.closest(".ingr-sidebar-accordion-group");

      if (accordion) {
        accordion
          .querySelector(".ingr-sidebar-accordion-content")
          ?.classList.add("open");

        accordion
          .querySelector(".ingr-sidebar-accordion-header")
          ?.classList.add("active");

        accordion
          .querySelector(".ingr-accordion-arrow")
          ?.classList.add("rotated");
      }
    }
  });

  // Accordion dropdown
  document
    .querySelectorAll(".ingr-sidebar-accordion-header")
    .forEach((header) => {
      header.addEventListener("click", () => {
        const group = header.closest(".ingr-sidebar-accordion-group");

        const content = group.querySelector(".ingr-sidebar-accordion-content");

        const arrow = group.querySelector(".ingr-accordion-arrow");

        header.classList.toggle("active");
        content.classList.toggle("open");
        arrow.classList.toggle("rotated");
      });
    });

  // Collapse sidebar
  const sidebar = document.getElementById("ingr-sidebar-element");

  const collapseBtn = document.getElementById("ingr-sidebar-collapse-trigger");

  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
}
