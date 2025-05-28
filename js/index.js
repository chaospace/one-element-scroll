import { preloadImages } from "./utils.js";

gsap.registerPlugin(ScrollTrigger, Flip);

const oneElement = document.querySelector(".one");
const parentElement = oneElement.parentNode;

const stepElements = [...document.querySelectorAll("[data-step]")];

let flipCtx;

const createFlipOnScrollAnimation = () => {
  // revert any previous animation
  flipCtx && flipCtx.revert();
  flipCtx = gsap.context(() => {
    const flipConfig = {
      duration: 1,
      ease: "sine.inOut",
    };

    const states = stepElements.map((stepElement) =>
      Flip.getState(stepElement)
    );
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentElement,
        start: "clamp(center center)",
        endTrigger: stepElements[stepElements.length - 1],
        end: "clamp(center center)",
        scrub: true,
        immediateRender: false,
      },
    });

    states.forEach((state, index) => {
      const customFlipConfig = {
        ...flipConfig,
        ease: index === 0 ? "none" : flipConfig.ease,
      };
      tl.add(
        Flip.fit(oneElement, state, customFlipConfig),
        index ? "+=0.5" : 0
      );
    });
  });
};

const animateSpansOnScroll = () => {
  const spans = document.querySelectorAll(".content__title > span");
  spans.forEach((span, index) => {
    const direction = index % 2 === 0 ? -150 : 150;
    const triggerElement = span.closest(".content--center")
      ? span.parentNode
      : span;
    gsap.from(span, {
      x: direction,
      duration: 1,
      ease: "sine",
      scrollTrigger: {
        trigger: triggerElement,
        start: "top bottom",
        end: "+=45%",
        scrub: true,
      },
    });
  });
};

const animateImagesOnScroll = () => {
  const images = document.querySelectorAll(
    ".content--lines .content__img:not([data-step]), .content--grid .content__img:not([data-step])"
  );
  images.forEach((image) => {
    gsap.fromTo(
      image,
      {
        scale: 0,
        autoAlpha: 0,
        filter: "brightness(180%) saturate(0%)",
      },
      {
        scale: 1,
        autoAlpha: 1,
        filter: "brightness(100%) saturate(100%)",
        duration: 1,
        ease: "sine",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "+=45%",
          scrub: true,
        },
      }
    );
  });
};

const addParallaxToText = () => {
  const firstTextElement = document.querySelector(".content__text");
  if (!firstTextElement) return;

  gsap.fromTo(
    firstTextElement,
    {
      y: 250,
    },
    {
      y: -250,
      ease: "sine",
      scrollTrigger: {
        trigger: firstTextElement,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    }
  );
};

const addParallaxToColumnImages = () => {
  const columnImages = [
    ...document.querySelectorAll(
      ".content--column .content__img:not([data-step])"
    ),
  ];
  const totalImages = columnImages.length;
  const middleIndex = Math.floor(totalImages / 2);

  columnImages.forEach((image, index) => {
    const intensity = Math.abs(index - middleIndex) * 75;

    gsap.fromTo(
      image,
      {
        y: intensity,
      },
      {
        y: -intensity,
        ease: "sine",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
};

// Animate the filter effect on the `.one` element during the first scroll
const animateFilterOnFirstSwitch = () => {
  gsap.fromTo(
    oneElement,
    {
      filter: "brightness(80%)", // Start with high brightness and reduced saturation
    },
    {
      filter: "brightness(100%)", // Transition to normal state
      ease: "sine", // Smooth easing
      scrollTrigger: {
        trigger: parentElement,
        start: "clamp(top bottom)", // Start when parent enters viewport
        end: "clamp(bottom top)", // End when parent leaves viewport
        scrub: true,
      },
    }
  );
};

const animateRelatedDemos = () => {
  const relatedSection = document.querySelector(".card-wrap");
  const relatedDemos = [
    ...relatedSection.querySelectorAll(".card-wrap > .card"),
  ];

  gsap.from(relatedDemos, {
    scale: 0,
    ease: "sine",
    stagger: {
      each: 0.04,
      from: "center",
    },
    scrollTrigger: {
      trigger: relatedSection,
      start: "top bottom",
      end: "clamp(center center)",
      scrub: true,
    },
  });
};

const init = () => {
  createFlipOnScrollAnimation();
  animateSpansOnScroll();
  animateImagesOnScroll();
  addParallaxToText();
  addParallaxToColumnImages();
  animateFilterOnFirstSwitch(); // Animate the filter on the `.one` element
  animateRelatedDemos(); // Animate the related demos section
  window.addEventListener("resize", createFlipOnScrollAnimation); // Reinitialize Flip animations on resize
};

preloadImages(".one__img").then(() => {
  document.body.classList.remove("loading");
  console.log("init");
  init();
});
