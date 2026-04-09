/**
 * Sidebar Toggle Logic
 */
function initSidebarLogic() {
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const sidebar = document.querySelector(".sidebar");
  const sidebarClose = document.querySelector(".sidebar-close");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");

  if (!mobileNavToggle || !sidebar || !sidebarOverlay) {
    console.warn("Sidebar elements missing");
    return;
  }

  function toggleSidebar() {
    const isActive = sidebar.classList.toggle("active");
    sidebarOverlay.classList.toggle("active");

    // Dispatch custom event for Locomotive Scroll control in main.js
    window.dispatchEvent(new CustomEvent("sidebarToggle", { 
      detail: { active: isActive } 
    }));
  }

  mobileNavToggle.addEventListener("click", toggleSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", toggleSidebar);
  sidebarOverlay.addEventListener("click", toggleSidebar);
}
