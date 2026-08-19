"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const DEMO_DURATION_SECONDS = 30;

export default function AloneModePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEMO_DURATION_SECONDS);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationMessage, setLocationMessage] = useState(
    "Location has not been shared yet."
  );
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("This browser does not support location sharing.");
      return;
    }

    setLocationMessage("Getting your location…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(newLocation);
        setLocationMessage("Live location shared successfully.");
      },
      () => {
        setLocationMessage(
          "Location permission was denied. You can still test the timer."
        );
      }
    );
  }

  function triggerDemoEmergency() {
    if (!user) return;

    const emergency = {
      id: crypto.randomUUID(),
      userId: user.email,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      status: "active",
      source: "alone-mode",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("safeTransitLatestEmergency", JSON.stringify(emergency));
    setEmergencyTriggered(true);
    setIsActive(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }

  function startTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          triggerDemoEmergency();
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);
  }

  function startAloneMode() {
    setEmergencyTriggered(false);
    setSecondsLeft(DEMO_DURATION_SECONDS);
    setIsActive(true);
    getCurrentLocation();
    startTimer();
  }

  function checkIn() {
    setSecondsLeft(DEMO_DURATION_SECONDS);
    getCurrentLocation();
    startTimer();
  }

  function stopAloneMode() {
    setIsActive(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }

  if (loading || !user) {
    return <main className="p-8 text-center">Loading…</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-xl">
        <Link href="/dashboard" className="text-sm font-semibold text-cyan-400">
          ← Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Alone Mode</h1>
        <p className="mt-2 leading-7 text-slate-400">
          Start a monitored journey and check in regularly to show that you are
          safe.
        </p>

        {emergencyTriggered ? (
          <section className="mt-8 rounded-2xl border border-rose-400 bg-rose-950 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-rose-300">
              Demo emergency created
            </p>
            <h2 className="mt-2 text-2xl font-bold">We could not confirm your check-in.</h2>
            <p className="mt-3 text-rose-100">
              In the final app, this event will notify nearby volunteers and the
              control dashboard. No real emergency service was contacted.
            </p>

            <Link
              href="/emergency"
              className="mt-6 inline-block rounded-lg bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-400"
            >
              View emergency status
            </Link>
          </section>
        ) : (
          <>
            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-semibold text-slate-400">LIVE LOCATION</p>
              <p className="mt-3 font-medium">{locationMessage}</p>

              {location && (
                <p className="mt-3 text-sm text-slate-400">
                  {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                </p>
              )}
            </section>

            <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Next safety check-in
              </p>

              <p className="mt-3 text-6xl font-bold text-cyan-400">
                {secondsLeft}s
              </p>

              <p className="mt-3 text-sm text-slate-400">
                Demo timer: 30 seconds. Make this 5–10 minutes in a real app.
              </p>
            </section>

            {!isActive ? (
              <button
                onClick={startAloneMode}
                className="mt-5 w-full rounded-xl bg-cyan-400 py-4 text-lg font-bold text-slate-950 hover:bg-cyan-300"
              >
                Start Alone Mode
              </button>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={checkIn}
                  className="rounded-xl bg-emerald-400 py-4 text-lg font-bold text-slate-950 hover:bg-emerald-300"
                >
                  I&apos;m safe
                </button>

                <button
                  onClick={stopAloneMode}
                  className="rounded-xl border border-slate-600 py-4 font-bold hover:bg-slate-800"
                >
                  Stop journey
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}