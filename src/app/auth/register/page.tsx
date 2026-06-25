"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Sparkles,
  Sunrise,
  Sun,
  Moon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Slider from "@/components/ui/Slider";
import AuthSplit from "@/components/auth/AuthSplit";
import GoogleIcon from "@/components/auth/GoogleIcon";
import PasswordStrength from "@/components/auth/PasswordStrength";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Введите имя"),
    email: z.string().email("Введите корректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string().min(6, "Минимум 6 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

type Goal = "study" | "work" | "growth";
type ProductiveTime = "morning" | "day" | "evening";

const goalOptions: { value: Goal; label: string; icon: typeof GraduationCap }[] =
  [
    { value: "study", label: "Учёба", icon: GraduationCap },
    { value: "work", label: "Работа", icon: Briefcase },
    { value: "growth", label: "Личное развитие", icon: Sparkles },
  ];

const goalLabels: Record<Goal, string> = {
  study: "Учёба",
  work: "Работа",
  growth: "Личное развитие",
};

const timeOptions: {
  value: ProductiveTime;
  label: string;
  icon: typeof Sunrise;
}[] = [
  { value: "morning", label: "Утро", icon: Sunrise },
  { value: "day", label: "День", icon: Sun },
  { value: "evening", label: "Вечер", icon: Moon },
];

const timeLabels: Record<ProductiveTime, string> = {
  morning: "Утро",
  day: "День",
  evening: "Вечер",
};

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, configured } = useAuth();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const [goal, setGoal] = useState<Goal>("study");
  const [dailyHours, setDailyHours] = useState(4);
  const [productiveTime, setProductiveTime] =
    useState<ProductiveTime>("morning");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const goToStep2 = async () => {
    setError(null);
    const valid = await trigger([
      "firstName",
      "email",
      "password",
      "confirmPassword",
    ]);
    if (valid) {
      setDirection(1);
      setStep(2);
    }
  };

  const goToStep1 = () => {
    setDirection(-1);
    setStep(1);
  };

  const onSubmit = async (values: RegisterValues) => {
    setError(null);
    if (!configured) {
      router.push("/dashboard");
      return;
    }
    try {
      const { needsConfirmation } = await signUp(
        values.email,
        values.password,
        {
          firstName: values.firstName,
          goal: goalLabels[goal],
          productiveTime: timeLabels[productiveTime],
          dailyHours,
        },
      );
      if (needsConfirmation) {
        setSentEmail(values.email);
        setAwaitingConfirm(true);
        return;
      }
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать аккаунт");
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

  if (awaitingConfirm) {
    return (
      <AuthSplit
        quote="Каждый день — это шанс стать на шаг ближе к себе будущему."
        author="ScheduleMaster"
      >
        <div className="text-center">
          <div className="mb-4 text-5xl">📧</div>
          <h1 className="mb-2 text-2xl font-bold text-brand-text">
            Проверьте почту
          </h1>
          <p className="text-brand-muted">
            Мы отправили письмо на{" "}
            <span className="text-brand-text">{sentEmail}</span>. Перейдите по
            ссылке, чтобы активировать аккаунт и войти.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block text-sm font-medium text-brand-yellow transition-colors hover:text-brand-yellow-hover"
          >
            Вернуться ко входу
          </Link>
        </div>
      </AuthSplit>
    );
  }

  return (
    <AuthSplit
      quote="Каждый день — это шанс стать на шаг ближе к себе будущему."
      author="ScheduleMaster"
    >
      <div>
        {/* Progress */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-brand-muted">
            Шаг {step} из 2
          </p>
          <div className="flex gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-border"
              >
                <motion.div
                  initial={false}
                  animate={{ width: step >= s ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full rounded-full bg-brand-yellow"
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {step === 1 ? (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <h1 className="text-3xl font-semibold text-brand-text">
                  Создай аккаунт
                </h1>
                <p className="mt-2 text-sm text-brand-muted">
                  Начни планировать своё время с удовольствием
                </p>

                <div className="mt-6 space-y-4">
                  <Input
                    label="Имя"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Как тебя зовут?"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                  />
                  <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <div>
                    <Input
                      label="Пароль"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      error={errors.password?.message}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          aria-label={
                            showPassword ? "Скрыть пароль" : "Показать пароль"
                          }
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
                    <PasswordStrength value={passwordValue} />
                  </div>
                  <Input
                    label="Повтор пароля"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                </div>

                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  className="mt-6"
                  onClick={goToStep2}
                >
                  Далее
                </Button>

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
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <h1 className="text-3xl font-semibold text-brand-text">
                  Расскажи о себе
                </h1>
                <p className="mt-2 text-sm text-brand-muted">
                  Это поможет настроить планировщик под тебя
                </p>

                <div className="mt-6 space-y-6">
                  {/* Goal */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-brand-muted">
                      Какова твоя главная цель?
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {goalOptions.map(({ value, label, icon: Icon }) => {
                        const selected = goal === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setGoal(value)}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-xl border bg-brand-card px-3 py-4 text-center transition-all duration-200",
                              selected
                                ? "border-brand-yellow shadow-yellow-glow ring-1 ring-brand-yellow"
                                : "border-brand-border hover:border-brand-yellow/40",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-6 w-6",
                                selected
                                  ? "text-brand-yellow"
                                  : "text-brand-muted",
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs font-medium",
                                selected
                                  ? "text-brand-text"
                                  : "text-brand-muted",
                              )}
                            >
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Daily hours */}
                  <Slider
                    label="Сколько часов в день ты планируешь?"
                    value={dailyHours}
                    onChange={setDailyHours}
                    min={1}
                    max={12}
                    step={1}
                    suffix=" ч"
                  />

                  {/* Productive time */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-brand-muted">
                      Когда ты наиболее продуктивен?
                    </p>
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-brand-border p-1">
                      {timeOptions.map(({ value, label, icon: Icon }) => {
                        const selected = productiveTime === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setProductiveTime(value)}
                            className={cn(
                              "flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200",
                              selected
                                ? "bg-brand-yellow text-brand-black"
                                : "text-brand-muted hover:text-brand-text",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className="mt-8"
                  loading={isSubmitting}
                >
                  Создать аккаунт
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  className="mt-2"
                  onClick={goToStep1}
                >
                  Назад
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="mt-6 text-center text-sm text-brand-muted">
          Уже есть аккаунт?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-brand-yellow transition-colors hover:text-brand-yellow-hover"
          >
            Войти
          </Link>
        </p>
      </div>
    </AuthSplit>
  );
}
