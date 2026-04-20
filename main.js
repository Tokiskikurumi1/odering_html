document.addEventListener("DOMContentLoaded", () => {
  const isDesktop = window.innerWidth > 1280;
  gsap.registerPlugin(ScrollTrigger);

  // --- SETUP: LOCOMOTIVE SCROLL ---
  const scrollContainer = document.querySelector(".smooth-scroll");
  const isTouchDevice = window.innerWidth <= 1440 || "ontouchstart" in window;

  const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    multiplier: 1,
  });

  if (!isTouchDevice) {
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollContainer, {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scrollContainer.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.defaults({ scroller: scrollContainer });
  } else {
    ScrollTrigger.defaults({ scroller: window });
  }

  // --- FLYING COOKIE SETUP ---
  let flyingCookie = null;
  if (isDesktop) {
    flyingCookie = document.createElement("img");
    flyingCookie.id = "flying-cookie";
    flyingCookie.style.position = "absolute";
    flyingCookie.style.top = "calc(100vh - 650px)";
    flyingCookie.style.left = "50%";
    flyingCookie.style.transform = "translateX(-50%)";
    flyingCookie.style.height = "420px";
    flyingCookie.style.zIndex = "1000";
    flyingCookie.style.opacity = "0";
    flyingCookie.style.pointerEvents = "none";

    document.querySelector(".smooth-scroll").appendChild(flyingCookie);
  }
  // --- SLIDER PIZZA LOGIC ---
  let prev = document.getElementById("prev");
  let next = document.getElementById("next");
  let image = document.querySelector(".hero-section-images");
  let items = document.querySelectorAll(
    ".hero-section-images .section-image-item",
  );
  let contents = document.querySelectorAll(
    ".hero-section-content .section-content-item",
  );

  let rotate = 0;
  let active = 0;
  let countItem = items.length;
  let rotateAdd = 360 / countItem;
  let isScrolled = false;

  function nextSlider() {
    if (isScrolled) return;
    active = active + 1 > countItem - 1 ? 0 : active + 1;
    rotate = rotate + rotateAdd;
    show();
  }
  function prevSlider() {
    if (isScrolled) return;
    active = active - 1 < 0 ? countItem - 1 : active - 1;
    rotate = rotate - rotateAdd;
    show();
  }

  function autoNextSlider() {
    active = active + 1 > countItem - 1 ? 0 : active + 1;
    rotate = rotate + rotateAdd;
    show();
  }

  function show() {
    image.style.setProperty("--rotate", rotate + "deg");
    contents.forEach((content, key) => {
      if (key == active) {
        content.classList.add("active");
        items[key].classList.add("active");
        if (flyingCookie) {
          flyingCookie.src = items[key].querySelector("img").src;
        }
        document.getElementById("section-description-img").src =
          items[key].querySelector("img").src;

        document.getElementById("section-description-title").innerText =
          contents[key].querySelector("h1").innerText;
        document.getElementById("section-description-desc").innerText =
          contents[key].querySelector(".section-content-item-des").innerText;
      } else {
        content.classList.remove("active");
        items[key].classList.remove("active");
      }
    });
  }
  next.onclick = nextSlider;
  prev.onclick = prevSlider;
  show();

  // Auto slide helper to avoid duplicated intervals
  let autoSlide = null;

  function startAutoSlide() {
    stopAutoSlide();
    if (!isScrolled) {
      autoSlide = setInterval(autoNextSlider, 3000);
    }
  }

  function stopAutoSlide() {
    if (autoSlide !== null) {
      clearInterval(autoSlide);
      autoSlide = null;
    }
  }

  // Start initially
  startAutoSlide();

  // Optionally pause auto slide on hover in mobile only (desktop không pause)
  let slider = document.querySelector(".hero-section.slider");
  if (window.matchMedia("(max-width: 1023px)").matches) {
    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", () => {
      if (!isScrolled) startAutoSlide();
    });
  }

  // Visibility / focus management
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      if (!isScrolled) startAutoSlide();
    }
  });

  window.addEventListener("blur", stopAutoSlide);
  window.addEventListener("focus", () => {
    if (!isScrolled) startAutoSlide();
  });

  // --- AUTO RECALCULATE SCROLL METRICS ---
  // Hàm tự động tính toán tọa độ dựa theo chiều cao thiết bị phòng khi slider bị thu ngắn (đổi vh)
  function getScrollMetrics() {
    const isMobile = window.innerWidth <= 768;
    const sliderHeight = document.querySelector(".slider").offsetHeight;
    const vh = window.innerHeight;

    // Thay vì "top 90%", trigger chạy chuẩn xác khi cuộn vuột qua 50px so với chiều cao slider
    const startTrigger = `top ${sliderHeight - 50}px`;
    const endTrigger = `top ${sliderHeight - vh * 0.4}px`;

    // Tọa độ nơi dĩa ăn hạ cánh ở Section 2, tự động bằng sliderHeight + thêm 15% màn hình
    const dropTarget = isMobile
      ? `${sliderHeight + vh * 0.08}px`
      : `${sliderHeight + vh * 0.15}px`;

    // Chỉnh tọa độ bay theo điện thoại (giữa màn hình) hay máy tính (bên trái)
    const dropTargetLeft = isMobile ? "50vw" : "25vw";
    const cookieHeight = isMobile ? "45vw" : "22vw";

    return {
      startTrigger,
      endTrigger,
      dropTarget,
      dropTargetLeft,
      cookieHeight,
    };
  }

  // --- SCROLL ANIMATION (REFINED ALIGNMENT) ---
  let mm = gsap.matchMedia();
  mm.add("(min-width: 1281px)", function () {
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".description-food-section",
        start: () => getScrollMetrics().startTrigger,
        end: () => getScrollMetrics().endTrigger,
        invalidateOnRefresh: true, // Auto tính toán lại hàm trên khi resize màn hình
        scrub: true,
      },
    });

    // Separate ScrollTrigger for auto slide control
    ScrollTrigger.create({
      trigger: ".description-food-section",
      start: () => getScrollMetrics().startTrigger,
      end: () => getScrollMetrics().endTrigger,
      invalidateOnRefresh: true, // Đồng bộ
      onEnter: () => {
        isScrolled = true;
        const activeImg = document.querySelector(
          ".section-image-item.active img",
        );
        if (activeImg) activeImg.style.opacity = 0;
        if (flyingCookie) {
          gsap.set(flyingCookie, { opacity: 1 });
        }
        stopAutoSlide();
      },
      onLeaveBack: () => {
        isScrolled = false;
        const activeImg = document.querySelector(
          ".section-image-item.active img",
        );
        if (activeImg) activeImg.style.opacity = 1;
        gsap.set(flyingCookie, { opacity: 0 });
        startAutoSlide();
      },
    });

    if (flyingCookie) {
      tl1.to("#flying-cookie", {
        top: () => getScrollMetrics().dropTarget,
        left: "25vw",
        height: "22vw",
        rotate: "50deg",
        ease: "power1.inOut",
      });
    }
  });

  // --- HEADER SCROLL EFFECT MOVED TO header_footer.js ---

  // --- SECTION 3 ANIMATION: PRODUCT IMAGES SLIDE UP ---
  gsap.from(".best-seller-product-card .best-seller-product-img", {
    scrollTrigger: {
      trigger: ".best-seller-food-section",
      start: "top 80%", // Bắt đầu khi đầu Section 3 chạm 80% chiều cao viewport
      toggleActions: "play none none none",
    },
    y: 150, // Trượt từ dưới lên 150px
    opacity: 0,
    duration: 1.2,
    stagger: 0.15, // Từng ảnh hiện lần lượt (premium feel)
    ease: "power3.out",
  });

  ScrollTrigger.refresh();

  // Fix for white space / height calculation
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    locoScroll.update();
  });

  // --- PRODUCT CATEGORY SECTION (SEARCH & PAGINATION) ---
  const productGrid = document.querySelector(".grid-product-container");
  const productSearchInput = document.querySelector(".product-area-search");
  const productPrevPage = document.getElementById("prevPageProduct");
  const productNextPage = document.getElementById("nextPageProduct");
  const productPageNumbers = document.getElementById("pageNumbersProduct");
  const pageInfo = document.querySelector(".page-info");

  if (productGrid) {
    let CARDS_PER_PAGE_PRODUCT = window.innerWidth >= 1080 ? 9 : 8;
    const allProductCards = Array.from(productGrid.querySelectorAll(".p-card"));

    window.addEventListener('resize', () => {
      const newLimit = window.innerWidth >= 1080 ? 9 : 8;
      if (newLimit !== CARDS_PER_PAGE_PRODUCT) {
        CARDS_PER_PAGE_PRODUCT = newLimit;
        currentProductPage = 1;
        renderProductPage();
      }
    });

    // Empty state element
    const emptyStateProduct = document.createElement("div");
    emptyStateProduct.className = "product-empty-state";
    emptyStateProduct.innerHTML = '<i class="fa-solid fa-bowl-food"></i><p>Không tồn tại sản phẩm!</p>';
    emptyStateProduct.style.display = "none";
    productGrid.appendChild(emptyStateProduct);

    let currentProductPage = 1;
    let visibleProductCards = [...allProductCards];

    function renderProductPage() {
      const isEmpty = visibleProductCards.length === 0;
      const totalPages = isEmpty ? 1 : Math.ceil(visibleProductCards.length / CARDS_PER_PAGE_PRODUCT);

      if (currentProductPage > totalPages) currentProductPage = totalPages;
      if (currentProductPage < 1) currentProductPage = 1;

      // Hide all cards first
      allProductCards.forEach((card) => { card.style.display = "none"; });

      if (isEmpty) {
        emptyStateProduct.style.display = "flex";
        if (productPageNumbers) productPageNumbers.textContent = currentProductPage;
        if (pageInfo) pageInfo.textContent = "0/0";
      } else {
        emptyStateProduct.style.display = "none";
        const start = (currentProductPage - 1) * CARDS_PER_PAGE_PRODUCT;
        const end = start + CARDS_PER_PAGE_PRODUCT;
        visibleProductCards.slice(start, end).forEach((card) => { card.style.display = ""; });

        if (productPageNumbers) productPageNumbers.textContent = currentProductPage;
        if (pageInfo) pageInfo.textContent = currentProductPage + "/" + totalPages;
      }

      if (productPrevPage) productPrevPage.disabled = (currentProductPage === 1);
      if (productNextPage) productNextPage.disabled = (currentProductPage === totalPages);
    }

    function applyProductFilter(keyword) {
      const q = keyword.trim().toLowerCase();
      if (q === "") {
        visibleProductCards = [...allProductCards];
      } else {
        visibleProductCards = allProductCards.filter((card) => {
          const name = card.querySelector(".p-name");
          return name && name.textContent.toLowerCase().includes(q);
        });
      }
      currentProductPage = 1;
      renderProductPage();
    }

    if (productSearchInput) {
      productSearchInput.addEventListener("input", () => {
        applyProductFilter(productSearchInput.value);
      });
    }

    if (productPrevPage) {
      productPrevPage.addEventListener("click", () => {
        if (currentProductPage > 1) {
          currentProductPage--;
          renderProductPage();
        }
      });
    }

    if (productNextPage) {
      productNextPage.addEventListener("click", () => {
        const totalPages = Math.ceil(visibleProductCards.length / CARDS_PER_PAGE_PRODUCT);
        if (currentProductPage < totalPages) {
          currentProductPage++;
          renderProductPage();
        }
      });
    }

    renderProductPage();
  }

  // --- CHAT FUNCTIONALITY MOVED TO chat_widget_chat_modal.js ---

  // --- SWIPER INITIALIZATION ---
  const testimonialSwiper = new Swiper(".testimonial-swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });

  const combosSwiper = new Swiper(".combos-swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 1000,
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
      1280: {
        slidesPerView: 4,
      },
    },
  });

  // --- SIDEBAR TOGGLE ---
  window.addEventListener("sidebarToggle", (e) => {
    if (e.detail.active) {
      locoScroll.stop();
    } else {
      locoScroll.start();
    }
  });
});
