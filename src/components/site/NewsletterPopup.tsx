"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// The dialog and its animation library download only when the popup opens,
// which keeps them out of every page's initial JavaScript.
const NewsletterDialog = dynamic(
  () => import("./NewsletterDialog").then((m) => m.NewsletterDialog),
  { ssr: false },
);

const DISMISS_KEY = "dd_news_popup_dismissed";
const SUBSCRIBED_KEY = "dd_news_subscribed";
const DISMISS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DELAY_MS = 30_000;

// Routes where the popup never shows (its own funnel surface / studio).
const SUPPRESSED = ["/studio", "/contact"];

function eligible(): boolean {
  try {
    if (localStorage.getItem(SUBSCRIBED_KEY)) return false;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_WINDOW_MS) return false;
  } catch {
    // localStorage unavailable (privacy mode) — show once this session is fine.
  }
  return true;
}

function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

const onDismiss = () => remember(DISMISS_KEY, String(Date.now()));
const onSubscribed = () => remember(SUBSCRIBED_KEY, "1");

export function NewsletterPopup() {
  const pathname = usePathname();
  const [armed, setArmed] = useState(false);

  const suppressed = SUPPRESSED.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Arm the 30s timer once per eligible page load.
  useEffect(() => {
    if (suppressed || !eligible()) return;
    const t = setTimeout(() => setArmed(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [suppressed]);

  return armed ? <NewsletterDialog onDismiss={onDismiss} onSubscribed={onSubscribed} /> : null;
}
