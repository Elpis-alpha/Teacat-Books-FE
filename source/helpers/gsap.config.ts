import gsap from "gsap";

type animateModalType = {
  in: {
    from: gsap.TweenVars;
    to: gsap.TweenVars;
  };
  out: gsap.TweenVars;
};
export const animateModal: animateModalType = {
  in: {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.2, ease: "power2.inOut" },
  },
  out: { opacity: 0, y: 20, duration: 0.2, ease: "power2.inOut" },
};

type animatePageType = {
  in: {
    set: gsap.TweenVars;
    from: (direction: "left" | "right") => gsap.TweenVars;
  };
  out: (direction: "left" | "right") => gsap.TweenVars;
  ext: gsap.TweenVars;
};
export const animatePage: animatePageType = {
  in: {
    set: { x: 0, opacity: 1 },
    from: (direction) => {
      return {
        x: direction === "left" ? -50 : 50,
        opacity: 0,
        duration: 0.2,
      };
    },
  },
  out: (direction) => {
    return {
      x: direction === "left" ? -50 : 50,
      opacity: 0,
      duration: 0.2,
    };
  },
  ext: {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.3,
    ease: "power3.out",
  },
};

type animateNavType = {
  show: gsap.TweenVars;
  hide: gsap.TweenVars;
};
export const animateNav: animateNavType = {
  show: { opacity: 1, y: 45, duration: 0.2, ease: "power2.inOut" },
  hide: { opacity: 0, y: 0, duration: 0.2, ease: "power2.inOut" },
};
