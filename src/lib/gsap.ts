/**
 * GSAP barrel export — single registration point for ScrollTrigger.
 * Import { gsap, ScrollTrigger } from "@/lib/gsap" across the app
 * instead of registering the plugin in every component.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
