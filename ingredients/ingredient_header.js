function initIngredientHeader() {
  console.log("Header Loaded");

  const searchInput = document.getElementById("ingr-global-header-search");

  const notificationBtn = document.getElementById(
    "ingr-notifications-dropdown-trigger",
  );

  console.log(searchInput);
  console.log(notificationBtn);

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      console.log(e.target.value);
    });
  }

  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      alert("Notification");
    });
  }
}
