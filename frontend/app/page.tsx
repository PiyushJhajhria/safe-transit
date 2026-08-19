import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-10">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center">
        <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-cyan-400">
          SAFETRANSIT
        </p>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white md:text-7xl">
          Travel safer. Feel supported.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Find safe places, share your journey, and access emergency support
          when you need it.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Create commuter account
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}