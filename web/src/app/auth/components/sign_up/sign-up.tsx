import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { AuthLayout } from "../auth_layout/auth-layout";
import { FormField } from "../form_field/form-field";
import styles from "./sign-up.module.css";
import { useSessionStore } from "../../store/session-store";

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(32, "Максимум 32 символа"),
  email: z.email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type SignUpFields = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: SignUpFields) => {
    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        const message = Array.isArray(body.message)
          ? body.message[0]
          : (body.message ?? "Что-то пошло не так");

        if (res.status === 409) {
          setError("email", { message: "Этот email уже используется" });
        } else {
          setError("root", { message });
        }
        return;
      }

      const { accessToken } = (await res.json()) as { accessToken: string };

      useSessionStore.getState().setAccessToken(accessToken);
      localStorage.setItem("access_token", accessToken);

      navigate("/");
    } catch {
      setError("root", { message: "Нет соединения с сервером" });
    }
  };

  return (
    <AuthLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Создать аккаунт</h2>
          <p className={styles.subheading}>
            Уже есть аккаунт?{" "}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            label="Имя пользователя"
            placeholder="soundmaster"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormField
            label="Пароль"
            type="password"
            placeholder="••••••"
            autoComplete="new-password"
            hint="Минимум 6 символов"
            error={errors.password?.message}
            {...register("password")}
          />

          {errors.root && (
            <p className={styles.rootError} role="alert">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Создаём аккаунт..." : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
