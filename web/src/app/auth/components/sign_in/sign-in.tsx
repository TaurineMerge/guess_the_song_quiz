import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { AuthLayout } from "../auth_layout/auth-layout";
import { FormField } from "../form_field/form-field";
import styles from "./sign-in.module.css";

const signInSchema = z.object({
  email: z.email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

type SignInFields = z.infer<typeof signInSchema>;

export function SignIn() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: SignInFields) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("root", { message: "Неверный email или пароль" });
        } else {
          const body = await res.json().catch(() => ({}));
          const message = Array.isArray(body.message)
            ? body.message[0]
            : (body.message ?? "Что-то пошло не так");
          setError("root", { message });
        }
        return;
      }

      const { accessToken } = (await res.json()) as { accessToken: string };
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
          <h2 className={styles.heading}>Войти</h2>
          <p className={styles.subheading}>
            Нет аккаунта?{" "}
            <Link to="/signup" className={styles.link}>
              Зарегистрироваться
            </Link>
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
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
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className={styles.forgotRow}>
            <Link to="/forgot-password" className={styles.forgot}>
              Забыли пароль?
            </Link>
          </div>

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
            {isSubmitting ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
