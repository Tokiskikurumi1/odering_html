// ==========================================
// REUSABLE PAGINATION
// ==========================================

class Pagination {
  constructor({
    data = [],
    itemsPerPage = 10,
    infoElementId,
    controlsElementId,
    onRender,
  }) {
    this.data = data;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;

    this.infoElementId = infoElementId;
    this.controlsElementId = controlsElementId;

    this.onRender = onRender;
  }

  // ==========================================
  // UPDATE DATA
  // ==========================================

  setData(data) {
    this.data = data || [];
    this.currentPage = 1;
    this.render();
  }

  // ==========================================
  // CHANGE PAGE
  // ==========================================

  goToPage(pageNum) {
    const totalPages = this.getTotalPages();

    if (pageNum < 1 || pageNum > totalPages) return;

    this.currentPage = pageNum;

    this.render();
  }

  // ==========================================
  // TOTAL PAGES
  // ==========================================

  getTotalPages() {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  // ==========================================
  // GET CURRENT PAGE DATA
  // ==========================================

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = Math.min(startIndex + this.itemsPerPage, this.data.length);

    return {
      pageData: this.data.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalItems: this.data.length,
    };
  }

  // ==========================================
  // RENDER
  // ==========================================

  render() {
    const { pageData, startIndex, endIndex, totalItems } =
      this.getCurrentPageData();

    if (typeof this.onRender === "function") {
      this.onRender(pageData);
    }

    this.renderInfo(startIndex, endIndex, totalItems);

    this.renderControls();
  }

  // ==========================================
  // PAGE INFO
  // ==========================================

  renderInfo(startIndex, endIndex, totalItems) {
    const pageInfo = document.getElementById(this.infoElementId);

    if (!pageInfo) return;

    const startNum = totalItems > 0 ? startIndex + 1 : 0;

    pageInfo.textContent = `Hiển thị ${startNum}-${endIndex} trên ${totalItems} bản ghi`;
  }

  // ==========================================
  // PAGINATION BUTTONS
  // ==========================================

  renderControls() {
    const controls = document.getElementById(this.controlsElementId);

    if (!controls) return;

    const totalPages = this.getTotalPages();

    if (totalPages <= 1) {
      controls.innerHTML = "";
      return;
    }

    let pages = [];

    pages.push(1);

    if (totalPages <= 7) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        pages.push(2, 3, 4, "...", totalPages - 1, totalPages);
      } else if (this.currentPage >= totalPages - 2) {
        pages.push(
          2,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          2,
          "...",
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          "...",
          totalPages - 1,
          totalPages,
        );
      }
    }

    let html = `
      <button
        class="ingr-pagination-number-btn"
        ${this.currentPage === 1 ? "disabled" : ""}
        data-page="${this.currentPage - 1}"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    `;

    pages.forEach((page) => {
      if (page === "...") {
        html += `
          <span class="ingr-pagination-ellipsis">
            ...
          </span>
        `;
      } else {
        html += `
          <button
            class="ingr-pagination-number-btn ${
              this.currentPage === page ? "active" : ""
            }"
            data-page="${page}"
          >
            ${page}
          </button>
        `;
      }
    });

    html += `
      <button
        class="ingr-pagination-number-btn"
        ${this.currentPage === totalPages ? "disabled" : ""}
        data-page="${this.currentPage + 1}"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;

    controls.innerHTML = html;

    controls.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.goToPage(Number(btn.dataset.page));
      });
    });
  }
}
