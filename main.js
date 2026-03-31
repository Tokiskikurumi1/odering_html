document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);

    // --- SETUP: LOCOMOTIVE SCROLL ---
    const scrollContainer = document.querySelector(".smooth-scroll");
    const locoScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        multiplier: 1,
    });

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
    ScrollTrigger.defaults({ scroller: ".smooth-scroll" });

    // --- FLYING COOKIE SETUP ---
    let flyingCookie = document.createElement("img");
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

    // --- SLIDER PIZZA LOGIC ---
    let prev = document.getElementById('prev');
    let next = document.getElementById('next');
    let image = document.querySelector('.images');
    let items = document.querySelectorAll('.images .item');
    let contents = document.querySelectorAll('.content .item');

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

    function show() {
        image.style.setProperty("--rotate", rotate + 'deg');
        contents.forEach((content, key) => {
            if (key == active) {
                content.classList.add('active');
                items[key].classList.add('active');
                flyingCookie.src = items[key].querySelector("img").src;

                document.getElementById('section2-title').innerText = contents[key].querySelector('h1').innerText;
                document.getElementById('section2-desc').innerText = contents[key].querySelector('.des').innerText;
            } else {
                content.classList.remove('active');
                items[key].classList.remove('active');
            }
        })
    }
    next.onclick = nextSlider;
    prev.onclick = prevSlider;
    show();

    // --- SCROLL ANIMATION (REFINED ALIGNMENT) ---
    ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function () {

            // Flight: Slider -> Section 2 (Higher landing spot to avoid overlap)
            const tl1 = gsap.timeline({
                scrollTrigger: {
                    trigger: ".second-section",
                    start: "top bottom",
                    end: "top 50%",
                    scrub: true,
                    onEnter: () => {
                        isScrolled = true;
                        document.querySelector(".item.active img").style.opacity = 0;
                        gsap.set(flyingCookie, { opacity: 1 });
                    },
                    onLeaveBack: () => {
                        isScrolled = false;
                        document.querySelector(".item.active img").style.opacity = 1;
                        gsap.set(flyingCookie, { opacity: 0 });
                    }
                }
            });

            tl1.to("#flying-cookie", {
                top: "110vh", // Nâng mốc đáp lên 130vh thay vì 135vh để tránh đè Section 3
                left: "25vw",
                height: "22vw",
                rotate: "50deg",
                ease: "power1.inOut"
            });

        },
    });

    // --- SECTION 3 ANIMATION: PRODUCT IMAGES SLIDE UP ---
    gsap.from(".product-card .product-img", {
        scrollTrigger: {
            trigger: ".third-section",
            start: "top 80%", // Bắt đầu khi đầu Section 3 chạm 80% chiều cao viewport
            toggleActions: "play none none none",
        },
        y: 150, // Trượt từ dưới lên 150px
        opacity: 0,
        duration: 1.2,
        stagger: 0.15, // Từng ảnh hiện lần lượt (premium feel)
        ease: "power3.out"
    });

    ScrollTrigger.refresh();
});