fetch("./ingredient_header.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("ingr-header-content").innerHTML = html;

    if (typeof initIngredientHeader === "function") {
      initIngredientHeader();
    }
  })
  .catch((err) => console.error("Header:", err));

fetch("./ingredient_sidebar.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("ingr-sidebar-content").innerHTML = html;

    if (typeof initIngredientSidebar === "function") {
      initIngredientSidebar();
    }
  })
  .catch((err) => console.error("Sidebar:", err));

fetch("./ingredient_pagination.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("ingr-pagination-content").innerHTML = html;

    if (typeof window.initPage === "function") {
      window.initPage();
    }
  });
