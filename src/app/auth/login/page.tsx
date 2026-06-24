"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthSplit from "@/components/auth/AuthSplit";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, configured } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    if (!configured) {
      router.push("/dashboard");
      return;
    }
    try {
      await signIn(values.email, values.password);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось войти");
    }
  };

  const handleGoogle = async () => {
    setError(null);
    if (!configured) {
      router.push("/dashboard");
      return;
    }
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось войти через Google");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthSplit
      quote="Дисциплина — это мост между целями и их достижением."
      author="Джим Рон"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-semibold text-brand-text">
          Добро пожаловать
        </h1>
        <p className="mt-2 text-sm text-brand-muted">Войди, чтобы продолжить</p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Пароль"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                className="transition-colors hover:text-brand-yellow"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            {...register("password")}
          />

          <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-brand-muted">
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-brand-border bg-brand-black transition-colors checked:border-brand-yellow checked:bg-brand-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/60"
              />
              <svg
                className="pointer-events-none absolute h-3 w-3 text-brand-black opacity-0 peer-checked:opacity-100"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 6.5L5 9l4.5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Запомнить меня
          </label>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
          >
            Войти
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-brand-border" />
          <span className="text-xs uppercase tracking-wide text-brand-muted">
            или
          </span>
          <span className="h-px flex-1 bg-brand-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          fullWidth
          loading={googleLoading}
          onClick={handleGoogle}
        >
          <GoogleIcon />
          Войти через Google
        </Button>

        <p className="mt-6 text-center text-sm text-brand-muted">
          Нет аккаунта?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-brand-yellow transition-colors hover:text-brand-yellow-hover"
          >
            Зарегистрироваться
          </Link>
        </p>
      </motion.div>
    </AuthSplit>
  );
}
