// =======================================
// SAMPLE DATA
// =======================================

let categories = [
  {
    id: "CAT001",
    name: "Thịt",
    color: "#ef4444",
    description: "Các loại thịt bò, heo, gà",
  },
  {
    id: "CAT002",
    name: "Hải sản",
    color: "#06b6d4",
    description: "Tôm, cua, mực, cá",
  },
  {
    id: "CAT003",
    name: "Rau củ",
    color: "#22c55e",
    description: "Rau xanh và củ quả",
  },
  {
    id: "CAT004",
    name: "Đồ uống",
    color: "#f59e0b",
    description: "Các loại đồ uống giải khát",
  },
];

let ingredients = [
  { id: "NL001", categoryId: "CAT001" },
  { id: "NL002", categoryId: "CAT001" },
  { id: "NL003", categoryId: "CAT002" },
  { id: "NL004", categoryId: "CAT004" },
];

// =======================================
// RENDER CATEGORY LIST
// =======================================

function renderCategories() {
  const grid = document.getElementById("ingr-categories-grid-container");

  if (!grid) return;

  grid.innerHTML = "";

  categories.forEach((cat) => {
    const count = ingredients.filter((i) => i.categoryId === cat.id).length;

    grid.innerHTML += `
      <div class="ingr-category-card-element">

        <div
          class="ingr-category-card-color-strip"
          style="background:${cat.color};"
        ></div>

        <div class="ingr-category-card-header">
          <h4 class="ingr-category-card-title">
            ${cat.name}
          </h4>

          <span class="ingr-category-card-badge-count">
            ${count} nguyên liệu
          </span>
        </div>

        <div class="ingr-category-card-body">
          <p class="ingr-category-card-desc">
            ${cat.description || "Chưa có mô tả."}
          </p>
        </div>

        <div class="ingr-category-card-actions">

          <button
            class="ingr-ingredient-action-btn-circle"
            data-edit="${cat.id}"
            title="Sửa danh mục"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            class="ingr-ingredient-action-btn-circle delete"
            data-delete="${cat.id}"
            title="Xóa danh mục"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>

        </div>

      </div>
    `;
  });

  bindCategoryActions();
}

// =======================================
// MODAL
// =======================================

const catModal = document.getElementById("ingr-category-crud-modal");

const catForm = document.getElementById("ingr-category-form-element");

function openAddModal() {
  document.getElementById("ingr-category-modal-title").textContent =
    "Thêm Danh Mục Mới";

  catForm.reset();

  document.getElementById("ingr-form-category-id").value = "";

  const picker = document.getElementById("ingr-form-category-color-picker");

  picker.value = "#e88735";

  document.querySelectorAll(".ingr-preset-color-circle").forEach((item) => {
    item.classList.remove("active");

    if (item.dataset.color === "#e88735") {
      item.classList.add("active");
    }
  });

  catModal.classList.add("active");
}

function openEditModal(id) {
  const category = categories.find((c) => c.id === id);

  if (!category) return;

  document.getElementById("ingr-category-modal-title").textContent =
    "Cập nhật Danh Mục";

  document.getElementById("ingr-form-category-id").value = category.id;

  document.getElementById("ingr-form-category-name").value = category.name;

  document.getElementById("ingr-form-category-description").value =
    category.description || "";

  document.getElementById("ingr-form-category-color-picker").value =
    category.color;

  document.querySelectorAll(".ingr-preset-color-circle").forEach((item) => {
    item.classList.remove("active");

    if (item.dataset.color === category.color) {
      item.classList.add("active");
    }
  });

  catModal.classList.add("active");
}

function closeCategoryModal() {
  catModal.classList.remove("active");
}

// =======================================
// DELETE
// =======================================

function deleteCategory(id) {
  const category = categories.find((c) => c.id === id);

  if (!category) return;

  const hasIngredient = ingredients.some((i) => i.categoryId === id);

  if (hasIngredient) {
    alert("Danh mục này đang chứa nguyên liệu.");
    return;
  }

  const confirmDelete = confirm(`Bạn có chắc muốn xóa '${category.name}'?`);

  if (!confirmDelete) return;

  categories = categories.filter((c) => c.id !== id);

  renderCategories();
}

// =======================================
// FORM SUBMIT
// =======================================

catForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("ingr-form-category-id").value;

  const name = document.getElementById("ingr-form-category-name").value.trim();

  const color = document.getElementById(
    "ingr-form-category-color-picker",
  ).value;

  const description = document.getElementById(
    "ingr-form-category-description",
  ).value;

  if (!name) {
    alert("Vui lòng nhập tên danh mục.");
    return;
  }

  // ADD
  if (!id) {
    categories.push({
      id: "CAT" + Date.now(),
      name,
      color,
      description,
    });
  }

  // UPDATE
  else {
    const category = categories.find((c) => c.id === id);

    if (category) {
      category.name = name;
      category.color = color;
      category.description = description;
    }
  }

  closeCategoryModal();

  renderCategories();
});

// =======================================
// COLOR PICKER
// =======================================

document.querySelectorAll(".ingr-preset-color-circle").forEach((circle) => {
  circle.addEventListener("click", function () {
    document
      .querySelectorAll(".ingr-preset-color-circle")
      .forEach((item) => item.classList.remove("active"));

    this.classList.add("active");

    document.getElementById("ingr-form-category-color-picker").value =
      this.dataset.color;
  });
});

// =======================================
// ACTION BUTTONS
// =======================================

function bindCategoryActions() {
  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.onclick = () => openEditModal(btn.dataset.edit);
  });

  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.onclick = () => deleteCategory(btn.dataset.delete);
  });
}

// =======================================
// MODAL EVENTS
// =======================================

document
  .getElementById("ingr-btn-add-category")
  .addEventListener("click", openAddModal);

document
  .getElementById("ingr-category-modal-close")
  .addEventListener("click", closeCategoryModal);

document
  .getElementById("ingr-category-modal-cancel-btn")
  .addEventListener("click", closeCategoryModal);

// =======================================
// INIT
// =======================================

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
});
