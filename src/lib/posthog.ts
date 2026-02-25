import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let initialized = false;

export function initPostHog() {
  if (
    typeof window === "undefined" ||
    initialized ||
    !POSTHOG_KEY
  ) {
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    autocapture: true,
    // Privacy-friendly defaults
    disable_session_recording: true,
    mask_all_text: false,
    mask_all_element_attributes: false,
  });

  initialized = true;
}

/** Track a custom event */
export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (!POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

/** Identify a user (call after sign-in) */
export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>
) {
  if (!POSTHOG_KEY) return;
  posthog.identify(userId, properties);
}

/** Reset identity (call after sign-out) */
export function resetUser() {
  if (!POSTHOG_KEY) return;
  posthog.reset();
}

export { posthog };
