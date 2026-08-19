"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name"));
    const email = String(formData.get("email")).toLowerCase();
    const password = String(formData.get("password"));

    if (password.length < 6) {
      setError("Use a password with at least 6 characters.");
      return;
    }

    const created = register(name, email, password);

    if (!created) {
      setError("An account with this email already exists.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
      >
        <Link href="/" className="text-sm font-semibold text-cyan-400">
          ← SafeTransit
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-slate-400">Set up your commuter profile.</p>

        <label className="mt-7 block text-sm font-medium">
          Full name
          <input
            name="name"
            required
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
            placeholder="Your name"
          />
        </label>

        <label className="mt-5 block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
            placeholder="you@example.com"
          />
        </label>

        <label className="mt-5 block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
            placeholder="At least 6 characters"
          />
        </label>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

        <button className="mt-7 w-full rounded-lg bg-cyan-400 py-3 font-bold text-slate-950 hover:bg-cyan-300">
          Create account
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-cyan-400">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}