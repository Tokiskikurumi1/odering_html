// ===============================
// TOAST SERVICE
// ===============================

function showToast(title, message, type = "info") {
  const dock = document.getElementById("ingr-global-toast-container");

  if (!dock) return;

  const card = document.createElement("div");
  card.className = `ingr-toast-card-element ${type}`;

  let icon = "fa-info-circle";

  switch (type) {
    case "success":
      icon = "fa-circle-check";
      break;
    case "warning":
      icon = "fa-triangle-exclamation";
      break;
    case "error":
      icon = "fa-circle-xmark";
      break;
  }

  card.innerHTML = `
    <i class="fa-solid ${icon} ingr-toast-icon"></i>

    <div class="ingr-toast-content">
      <span class="ingr-toast-title">${title}</span>
      <span class="ingr-toast-message">${message}</span>
    </div>

    <button class="ingr-toast-close-btn">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="ingr-toast-progress-bar-decay"></div>
  `;

  dock.appendChild(card);

  const progress = card.querySelector(".ingr-toast-progress-bar-decay");

  progress.style.transition = "width 4s linear";

  setTimeout(() => {
    progress.style.width = "0%";
  }, 50);

  const dismissToast = () => {
    if (card.classList.contains("hiding")) return;

    card.classList.add("hiding");

    card.addEventListener("animationend", () => {
      card.remove();
    });
  };

  const closeBtn = card.querySelector(".ingr-toast-close-btn");

  closeBtn.addEventListener("click", dismissToast);

  const timeoutId = setTimeout(() => {
    dismissToast();
  }, 4000);

  card.addEventListener("mouseenter", () => {
    clearTimeout(timeoutId);
  });
}
