"use client";
import { useActionState } from "react";
import { login } from "@/app/login/actions";
export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <form action={action}>
      <div className="field">
        <label htmlFor="email">Email pemilik</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
        />
      </div>
      <div className="field">
        <label htmlFor="password">Kata sandi</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={512}
        />
      </div>
      {state.error && (
        <p className="notice error" role="alert">
          {state.error}
        </p>
      )}
      <button className="button matcha" disabled={pending}>
        {pending ? "Memeriksa…" : "Masuk ke dashboard"}
      </button>
    </form>
  );
}
