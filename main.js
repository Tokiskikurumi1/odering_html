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

  // --- ANIMATION SECTION ---
  
  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function () {
      // first section animation
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".second-section",
          start: "20% 100%",
          end: "50% 50%",
          scrub: true,
          // markers: true
        }
      });

      tl1.to("#cookie", {
        top: "138%",
        left: 0,
        rotate: "50deg",
      }, 'cookie');

      tl1.to("#chips", {
        width: "8vw",
        top: "125%",
        left: "88%"
      }, 'cookie')
      
      // second section animation
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".third-section",
          start: "20% 100%",
          end: "50% 50%",
          scrub: true,
          // markers: true
        }
      });

      tl2.to("#cookie", {
        top: "237%",
        left: "43%",
        width: "13vw",
        rotate: "-50deg",
      }, 'cookism');

      tl2.to("#cookism", {
        rotate: "-50deg"
      }, 'cookism')

    },
  });

  // Force a refresh after setup
  ScrollTrigger.refresh();
});