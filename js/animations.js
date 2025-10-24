// Animate page entrance
export const animateMainContainer = () => {
  const container = document.querySelector(".container");

  gsap.fromTo(
    container,
    { y: -window.innerHeight, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
  );
};

// Animate results section
export const animateResults = () => {
  const displayed = document.querySelector(".results-displayed");
  const header = displayed.querySelector("h2");
  const description = displayed.querySelector("p");
  const resultItems = displayed.querySelectorAll(".calc-results > div");

  gsap.fromTo(displayed, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  gsap.fromTo(header, { y: -50, opacity: 0 }, { y: 0, opacity: 1, delay: 0.5 });
  gsap.fromTo(
    description,
    { y: -30, opacity: 0 },
    { y: 0, opacity: 1, delay: 1 }
  );

  gsap.fromTo(
    resultItems,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.3,
      delay: 1.5,
    }
  );
};
