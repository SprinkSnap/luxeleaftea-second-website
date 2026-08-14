"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export function TrackOnce({
  event,
  payload = {},
}: {
  event: string;
  payload?: Record<string, unknown>;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, payload);
  }, [event, payload]);
  return null;
}
