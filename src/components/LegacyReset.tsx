"use client";

import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { resetIfLegacy } from "@/lib/mock";

/**
 * Один раз на клиенте очищает старые демо-задачи из localStorage.
 * Если что-то удалили — сбрасываем общий кэш задач, чтобы интерфейс
 * сразу стал чистым без перезагрузки. Ничего не рендерит.
 */
export default function LegacyReset() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (resetIfLegacy()) {
      mutate("demo-tasks", [], false);
    }
  }, [mutate]);

  return null;
}
