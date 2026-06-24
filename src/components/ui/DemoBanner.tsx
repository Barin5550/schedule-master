"use client";

import { isSupabaseConfigured } from "@/lib/supabase";

/** Информер демо-режима: показывается, пока не настроен Supabase. */
export default function DemoBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="border-b border-brand-yellow/20 bg-brand-yellow/5 px-4 py-2 text-center text-sm text-brand-yellow">
      ⚡ Демо-режим — данные сохраняются в браузере.
      <span className="ml-1 text-brand-muted">
        Подключи Supabase для полноценной работы.
      </span>
    </div>
  );
}
