"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

const actions = [
  {
    title: "Safe route",
    description: "Plan a safer journey to your destination.",
    href: "/safe-route",
    icon: "🧭",
  },
  {
    title: "Safe locations",
    description: "Find nearby police stations, hospitals, and hubs.",
    href: "/safe-locations",
    icon: "📍",
  },
  {
    title: "Alone Mode",
    description: "Start a monitored journey and check in safely.",
    href: "/alone-mode",
    icon: "🛡️",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <main className="p-8 text-center">Loading your SafeTransit account…</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <p className="text-sm font-semibold tracking-widest text-cyan-400">
              SAFETRANSIT
            </p>
            <h1 className="mt-1 text-3xl font-bold">Hi, {user.name}</h1>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Log out
          </button>
        </header>

        <section className="mt-10">
          <p className="text-slate-400">What do you need for this journey?</p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400"
              >
                <span className="text-3xl">{action.icon}</span>
                <h2 className="mt-5 text-xl font-bold">{action.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <Link
          href="/emergency"
          className="mt-8 flex items-center justify-between rounded-2xl bg-rose-600 p-6 transition hover:bg-rose-500"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest">
              Need immediate help?
            </p>
            <h2 className="mt-1 text-2xl font-bold">Emergency SOS</h2>
          </div>
          <span className="text-3xl">🚨</span>
        </Link>
      </div>
    </main>
  );
}