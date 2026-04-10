/**
 * Menus Page Logic
 * - Pagination: 4 cards / page, display < current / total >
 * - Search: filter cards by name
 */
document.addEventListener("DOMContentLoaded", () => {
  const CARDS_PER_PAGE = 12;

  // ── DOM refs ────────────────────────────────────────────
  const grid = document.getElementById("menus-dish-grid");
  const pgPrev = document.getElementById("pg-prev");
  const pgNext = document.getElementById("pg-next");
  const pgCurrent = document.getElementById("pg-current");
  const pgTotal = document.getElementById("pg-total");
  const pgContainer = document.getElementById("menus-pagination");
  const searchInput = document.getElementById("menus-search-input");
  const clearBtn = document.getElementById("menus-search-clear");

  // Empty state element
  const emptyState = document.createElement("div");
  emptyState.className = "menus-empty-state";
  emptyState.innerHTML = `
    <i class="fa-solid fa-bowl-food"></i>
    <p>Không tồn tại sản phẩm!</p>
  `;
  emptyState.style.display = "none";

  if (!grid) return;

  // All cards (static NodeList snapshot)
  const allCards = Array.from(grid.querySelectorAll(".menu-dish-card-item"));

  let currentPage = 1;
  let visibleCards = [...allCards]; // cards matching current filter

  // ── Render page ─────────────────────────────────────────
  function renderPage() {
    const isEmpty = visibleCards.length === 0;
    const totalPages = isEmpty
      ? 1
      : Math.ceil(visibleCards.length / CARDS_PER_PAGE);

    // Clamp current page
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // Hide all cards first
    allCards.forEach((card) => (card.style.display = "none"));

    if (isEmpty) {
      // Show empty state inside grid, hide pagination
      allCards.forEach((card) => (card.style.display = "none"));

      if (!grid.contains(emptyState)) {
        grid.appendChild(emptyState);
      }

      emptyState.style.display = "flex";
      if (pgContainer) pgContainer.style.display = "none";
    } else {
      // Restore grid if it was showing empty state
      if (grid.contains(emptyState)) {
        grid.innerHTML = "";
        allCards.forEach(card => grid.appendChild(card));
      }

      emptyState.style.display = "none";
      if (pgContainer) pgContainer.style.display = "";

      const start = (currentPage - 1) * CARDS_PER_PAGE;
      const end = start + CARDS_PER_PAGE;
      visibleCards
        .slice(start, end)
        .forEach((card) => (card.style.display = ""));

      // Update pagination UI
      pgCurrent.textContent = currentPage;
      pgTotal.textContent = totalPages;
      pgPrev.disabled = currentPage === 1;
      pgNext.disabled = currentPage === totalPages;
    }
  }

  // ── Search / Filter ──────────────────────────────────────
  function applyFilter(keyword) {
    const q = keyword.trim().toLowerCase();

    if (q === "") {
      visibleCards = [...allCards];
    } else {
      visibleCards = allCards.filter((card) => {
        const name = card.querySelector(".ms-card-name");
        return name && name.textContent.toLowerCase().includes(q);
      });
    }

    currentPage = 1;
    renderPage();
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const val = searchInput.value;

      // Show/hide clear button
      if (clearBtn) {
        clearBtn.classList.toggle("visible", val.length > 0);
      }

      applyFilter(val);
    });
  }

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.classList.remove("visible");
      applyFilter("");
      searchInput.focus();
    });
  }

  // ── Pagination buttons ───────────────────────────────────
  pgPrev.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
      scrollToGrid();
    }
  });

  pgNext.addEventListener("click", () => {
    const totalPages = Math.ceil(visibleCards.length / CARDS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
      scrollToGrid();
    }
  });

  // Smooth scroll back to top of grid on page change
  function scrollToGrid() {
    grid.closest(".menus-content-flex-container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // ── Init ────────────────────────────────────────────────
  renderPage();
});
