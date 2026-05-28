fetch("./ingredient_header.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("ingr-header-content").innerHTML = html;
  })
  .catch((err) => console.error("Lỗi load header:", err));

fetch("./ingredient_sidebar.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("ingr-sidebar-content").innerHTML = html;

    // =========================
    // Accordion
    // =========================
    document
      .querySelectorAll(".ingr-sidebar-accordion-header")
      .forEach((header) => {
        header.onclick = function () {
          const group = header.closest(".ingr-sidebar-accordion-group");
          const content = group.querySelector(
            ".ingr-sidebar-accordion-content",
          );
          const arrow = group.querySelector(".ingr-accordion-arrow");

          header.classList.toggle("active");
          content.classList.toggle("open");
          arrow.classList.toggle("rotated");
        };
      });

    // =========================
    // Collapse Sidebar
    // =========================
    const sidebar = document.getElementById("ingr-sidebar-element");
    const collapseTrigger = document.getElementById(
      "ingr-sidebar-collapse-trigger",
    );

    if (collapseTrigger) {
      collapseTrigger.onclick = function () {
        sidebar.classList.toggle("collapsed");

        if (sidebar.classList.contains("collapsed")) {
          collapseTrigger.setAttribute("title", "Mở rộng sidebar");
        } else {
          collapseTrigger.setAttribute("title", "Thu gọn sidebar");
        }
      };
    }
  })
  .catch((err) => console.error("Lỗi load sidebar:", err));
