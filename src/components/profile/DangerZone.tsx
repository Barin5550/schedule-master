"use client";

import { useState } from "react";
import { AlertTriangle, Check, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function DangerZone() {
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function clearTasks() {
    setConfirmClear(false);
    setCleared(true);
    window.setTimeout(() => setCleared(false), 2500);
  }

  return (
    <div className="space-y-5">
      {/* Удалить все задачи */}
      <div className="flex flex-col gap-3 rounded-xl border border-brand-border bg-brand-black p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-brand-text">Удалить все задачи</p>
          <p className="text-sm text-brand-muted">
            Очищает весь список задач без возможности восстановления.
          </p>
        </div>
        {cleared ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400">
            <Check className="h-4 w-4" />
            Задачи удалены
          </span>
        ) : confirmClear ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-muted">Вы уверены?</span>
            <Button
              size="sm"
              type="button"
              onClick={clearTasks}
              className="bg-red-500 text-white hover:bg-red-600 hover:shadow-none"
            >
              Да, удалить
            </Button>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => setConfirmClear(false)}
            >
              Отмена
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => setConfirmClear(true)}
            className="border-red-500/60 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Удалить
          </Button>
        )}
      </div>

      {/* Удалить аккаунт */}
      <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-brand-text">Удалить аккаунт</p>
          <p className="text-sm text-brand-muted">
            Безвозвратно удаляет аккаунт и все связанные данные.
          </p>
        </div>
        <Button
          size="sm"
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="bg-red-500 text-white hover:bg-red-600 hover:shadow-none"
        >
          <Trash2 className="h-4 w-4" />
          Удалить аккаунт
        </Button>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Удалить аккаунт?"
      >
        <div className="space-y-5">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-brand-muted">
              Это действие необратимо. Все ваши задачи, привычки, статистика и
              достижения будут удалены навсегда. Восстановить данные будет
              невозможно.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setDeleteOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={() => setDeleteOpen(false)}
              className="bg-red-500 text-white hover:bg-red-600 hover:shadow-none"
            >
              Удалить навсегда
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
