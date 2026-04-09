/**
 * Component Loader using Fetch API
 */
document.addEventListener("DOMContentLoaded", () => {
  loadComponents();
});

async function loadComponents() {
  const components = [
    { id: "header-placeholder", url: "header.html", init: initHeaderLogic },
    { id: "sidebar-placeholder", url: "sidebar_mobile.html", init: initSidebarLogic },
    { id: "footer-placeholder", url: "footer.html", init: null },
    { id: "chat-placeholder", url: "chat_widget_chat_modal.html", init: initChatLogic }
  ];

  for (const component of components) {
    const placeholder = document.getElementById(component.id);
    if (!placeholder) continue;

    try {
      const response = await fetch(component.url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const html = await response.text();
      placeholder.innerHTML = html;

      // Initialize component logic if it exists
      if (typeof component.init === "function") {
        component.init();
      }
    } catch (error) {
      console.error(`Failed to load component: ${component.url}`, error);
    }
  }

  // Dispatch global event that components are ready
  window.dispatchEvent(new CustomEvent("componentsLoaded"));
}

function initHeaderLogic() {
  // --- HEADER SCROLL EFFECT ---
  const header = document.querySelector(".main-header");
  if (header && typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      start: "top -80",
      onEnter: () => header.classList.add("scrolled"),
      onLeaveBack: () => header.classList.remove("scrolled"),
    });
  }
}
