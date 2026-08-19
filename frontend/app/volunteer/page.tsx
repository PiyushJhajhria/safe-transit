"use client";

import { useEffect, useState } from "react";

export default function Volunteer() {
  const [status, setStatus] = useState<"waiting" | "accepted" | "declined">(
    "waiting"
  );
  
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
  if (status !== "waiting") return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        setStatus("declined");
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [status]);

const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">SafeTransit</h1>
            <p className="text-gray-400">Volunteer Response Center</p>
          </div>

          <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Available
          </div>
        </header>

        {/* Emergency Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Nearby Emergencies
          </h2>

          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-6">

            {/* Emergency Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-400 font-semibold text-lg">
                  🚨 Emergency Detected
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  Possible commuter emergency
                </h3>
              </div>

              <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm">
                HIGH RISK
              </span>
            </div>

            {/* Emergency Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Distance</p>
                <p className="text-lg font-semibold">450 m</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Transport</p>
                <p className="text-lg font-semibold">Bus 124</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-lg font-semibold">Ring Road</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Detected</p>
                <p className="text-lg font-semibold">2 min ago</p>
              </div>

            </div>

            {/* Status */}
            {status === "accepted" && (
              <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400">
                ✓ Emergency accepted. You are now responding.
              </div>
            )}

            {status === "declined" && (
              <div className="mt-6 bg-gray-800 rounded-xl p-4 text-gray-300">
                Emergency declined.
              </div>
            )}

            <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Response window
                </p>

                <p className="text-3xl font-bold text-yellow-400">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </p>
            </div>

            {/* Buttons */}
            {status === "waiting" && (
              <div className="flex gap-4 mt-6">

                <button
                  onClick={() => setStatus("accepted")}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
                >
                  Accept Emergency
                </button>

                <button
                  onClick={() => setStatus("declined")}
                  className="px-6 border border-gray-700 hover:bg-gray-800 py-3 rounded-xl font-semibold"
                >
                  Decline
                </button>

              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}