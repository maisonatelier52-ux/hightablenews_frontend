"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";

/**
 * useAutoSave(saveFn, options)
 *
 * Call `trigger(payload)` whenever local state changes. The hook debounces
 * calls to `saveFn` and exposes a status string so the UI can show
 * "Saving…" / "Saved" indicators, plus fires a toast on success.
 */
export function useAutoSave(saveFn, { delay = 900, toastMessage = "Saved successfully" } = {}) {
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const timer = useRef(null);
  const { showToast } = useToast();

  const trigger = useCallback(
    (payload) => {
      setStatus("saving");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        try {
          await saveFn(payload);
          setStatus("saved");
          showToast(toastMessage, { type: "success" });
        } catch (err) {
          setStatus("error");
          showToast("Couldn't save your changes", { type: "error" });
        }
      }, delay);
    },
    [saveFn, delay, toastMessage, showToast]
  );

  const saveNow = useCallback(
    async (payload) => {
      if (timer.current) clearTimeout(timer.current);
      setStatus("saving");
      try {
        await saveFn(payload);
        setStatus("saved");
        showToast(toastMessage, { type: "success" });
      } catch (err) {
        setStatus("error");
        showToast("Couldn't save your changes", { type: "error" });
      }
    },
    [saveFn, toastMessage, showToast]
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { status, trigger, saveNow };
}
