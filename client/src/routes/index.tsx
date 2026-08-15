import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Claim your username — availability check" },
      {
        name: "description",
        content:
          "Check in real time whether your username is still available, as you type.",
      },
      { property: "og:title", content: "Claim your username" },
      {
        property: "og:description",
        content: "Live username availability check as you type.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Added invalid_length and invalid_chars to handle the new validation states
type Status = "idle" | "checking" | "available" | "taken" | "error" | "invalid_length" | "invalid_chars";

function Index() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const value = username.trim();
    
    if (!value) {
      setStatus("idle");
      return;
    }

    // 1. Check for minimum length
    if (value.length < 6) {
      setStatus("invalid_length");
      return;
    }

    // 2. Check for special characters (allows only alphanumeric A-Z, a-z, 0-9)
    const hasNoSpecialChars = /^[a-zA-Z0-9]+$/.test(value);
    if (!hasNoSpecialChars) {
      setStatus("invalid_chars");
      return;
    }

    const controller = new AbortController();
    setStatus("checking");

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: value }),
          signal: controller.signal,
        });
        const data = await res.json();
        const isTaken =
          typeof data === "boolean"
            ? data
            : typeof data?.exists === "boolean"
              ? data.exists
              : typeof data?.available === "boolean"
                ? !data.available
                : typeof data?.result === "boolean"
                  ? data.result
                  : false;

        setStatus(isTaken ? "taken" : "available");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setStatus("error");
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [username]);

  // Map the new statuses to human-readable UI messages
  const message = {
    idle: "",
    checking: "Checking…",
    available: "Username available",
    taken: "Username not available",
    error: "Couldn't reach the server",
    invalid_length: "Minimum 6 characters required",
    invalid_chars: "No special characters allowed",
  }[status];

  // Apply the red destructive text class if it matches our new invalid states
  const tone =
    status === "available"
      ? "text-emerald-400"
      : status === "taken" || status === "error" || status.startsWith("invalid")
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-md rounded-3xl bg-card p-10 shadow-2xl">
        <h1 className="text-center text-4xl font-bold tracking-tight text-card-foreground">
          Claim your username
        </h1>
        <p className="mt-2 text-center text-xs font-bold uppercase tracking-widest text-primary">
          Reserved for you
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-input px-4 py-4">
          <span className="text-muted-foreground">@</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
            autoComplete="off"
            aria-label="Username"
            className="w-full bg-transparent text-card-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <p className={`mt-4 h-5 text-center text-sm font-medium ${tone}`} aria-live="polite">
          {message}
        </p>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          By claiming this handle, you agree to our terms of service and identity guidelines.
        </p>
      </section>
    </main>
  );
}