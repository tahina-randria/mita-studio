import { gsap, ScrollTrigger } from "@/lib/gsap";

/* ── Word Splitter ──
 * Wraps each word of an element's text content in nested spans
 * for word-by-word animation. Returns the inner spans (animation targets).
 *
 * Structure:
 *   <span class="inline-block overflow-hidden">   ← clip wrapper
 *     <span class="inline-block word-span">word</span>  ← animation target
 *   </span>
 */
export function splitWords(element: HTMLElement): HTMLSpanElement[] {
  const text = element.textContent || "";
  const words = text.split(/\s+/).filter(Boolean);
  element.innerHTML = "";
  element.setAttribute("aria-label", text);

  const targets: HTMLSpanElement[] = [];

  words.forEach((word, i) => {
    const outer = document.createElement("span");
    outer.className = "inline-block overflow-hidden";
    outer.setAttribute("aria-hidden", "true");

    const inner = document.createElement("span");
    inner.className = "inline-block word-span";
    inner.textContent = word;
    targets.push(inner);

    outer.appendChild(inner);
    element.appendChild(outer);

    // Add space between words (except after last)
    if (i < words.length - 1) {
      const space = document.createElement("span");
      space.className = "inline-block";
      space.innerHTML = "&nbsp;";
      element.appendChild(space);
    }
  });

  return targets;
}

/* ── Word-by-word entrance animation ──
 * Animates split words with stagger. One-shot trigger.
 */
export function animateWordsEntrance(
  wordSpans: HTMLSpanElement[],
  trigger: Element,
  options?: {
    stagger?: number;
    duration?: number;
    y?: number;
    blur?: number;
    delay?: number;
    ease?: string;
  }
) {
  const {
    stagger = 0.06,
    duration = 0.7,
    y = 30,
    blur = 4,
    delay = 0,
    ease = "power3.out",
  } = options || {};

  return gsap.fromTo(
    wordSpans,
    {
      opacity: 0,
      y,
      filter: `blur(${blur}px)`,
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      stagger,
      delay,
      ease,
      scrollTrigger: {
        trigger,
        start: "top 85%",
      },
    }
  );
}

/* ── Scrub-driven word reveal (About quote style) ──
 * Each word starts dim (opacity 0.15) and scrubs to full opacity
 * as the user scrolls through the section.
 */
export function animateWordsScrub(
  wordSpans: HTMLSpanElement[],
  trigger: Element,
  options?: {
    startOpacity?: number;
    start?: string;
    end?: string;
  }
) {
  const {
    startOpacity = 0.15,
    start = "top 80%",
    end = "top 20%",
  } = options || {};

  // Set initial state
  gsap.set(wordSpans, { opacity: startOpacity });

  // Create a timeline scrubbed by scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: 1,
    },
  });

  tl.to(wordSpans, {
    opacity: 1,
    duration: 1,
    stagger: 1 / wordSpans.length,
    ease: "none",
  });

  return tl;
}

/* ── Scrub-driven heading reveal ──
 * Heading fades in progressively as user scrolls (not instant).
 */
export function animateHeadingScrub(
  elements: Element | Element[],
  trigger: Element,
  options?: {
    start?: string;
    end?: string;
    y?: number;
  }
) {
  const {
    start = "top 90%",
    end = "top 60%",
    y = 30,
  } = options || {};

  return gsap.fromTo(
    elements,
    { opacity: 0, y, filter: "blur(4px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      ease: "none",
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: 1,
      },
    }
  );
}

/* ── Multi-layer parallax ──
 * Applies different scroll speeds to multiple elements for depth.
 */
export function createParallax(
  layers: { element: Element; speed: number }[],
  trigger: Element,
  options?: {
    start?: string;
    end?: string;
  }
) {
  const {
    start = "top bottom",
    end = "bottom top",
  } = options || {};

  const animations: gsap.core.Tween[] = [];

  layers.forEach(({ element, speed }) => {
    const anim = gsap.to(element, {
      y: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: 1.5,
      },
    });
    animations.push(anim);
  });

  return animations;
}

/* ── Counter animation ──
 * Animates a number from 0 to target value.
 */
export function animateCounter(
  element: HTMLElement,
  targetValue: number,
  trigger: Element,
  options?: {
    duration?: number;
    separator?: string;
    prefix?: string;
    suffix?: string;
    ease?: string;
  }
) {
  const {
    duration = 1.5,
    separator = "\u00a0",
    prefix = "",
    suffix = "",
    ease = "power2.out",
  } = options || {};

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: targetValue,
    duration,
    ease,
    scrollTrigger: {
      trigger,
      start: "top 80%",
    },
    onUpdate() {
      const formatted = Math.round(obj.value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      element.textContent = `${prefix}${formatted}${suffix}`;
    },
  });
}

/* ── Set final states (for prefers-reduced-motion) ──
 * Immediately shows all elements without animation.
 */
export function setReducedMotionState(
  elements: Element | Element[] | NodeListOf<Element> | null,
  props?: gsap.TweenVars
) {
  if (!elements) return;
  gsap.set(elements, {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    scaleY: 1,
    scaleX: 1,
    filter: "blur(0px)",
    rotateX: 0,
    ...props,
  });
}
