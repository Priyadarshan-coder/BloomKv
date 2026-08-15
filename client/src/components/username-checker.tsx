import * as React from "react";
import { AtSign, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { checkUsernameAvailability } from "@/lib/check-username";

type Status = "idle" | "loading" | "available" | "taken" | "invalid";

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

function getValidationMessage(username: string): string | null {
  if (!username) return null;
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > 32) return "Username must be 32 characters or less.";
  if (!USERNAME_REGEX.test(username)) {
    return "Only letters, numbers, underscores, and hyphens are allowed.";
  }
  return null;
}

export function UsernameChecker() {
  const [username, setUsername] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState("");

  // Debounced availability check.
  React.useEffect(() => {
    const trimmed = username.trim();
    const validationError = getValidationMessage(trimmed);

    if (!trimmed) {
      setStatus("idle");
      setMessage("");
      return;
    }

    if (validationError) {
      setStatus("invalid");
      setMessage(validationError);
      return;
    }

    setStatus("loading");
    setMessage("Checking availability...");

    const timer = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailability(trimmed);
        if (available) {
          setStatus("available");
          setMessage("Username is available");
        } else {
          setStatus("taken");
          setMessage("This username is already taken.");
        }
      } catch {
        setStatus("invalid");
        setMessage("Unable to check availability. Please try again.");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The real submission/registration logic lives in your backend integration.
  };

  const statusDot =
    status === "loading" ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
    ) : status === "available" ? (
      <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(var(--color-success)/0.6)]" />
    ) : status === "taken" || status === "invalid" ? (
      <X className="h-3.5 w-3.5 text-destructive" />
    ) : null;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[2.5rem] border border-border bg-card p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-card-foreground">
            Claim your username
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Reserved for you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="pointer-events-none absolute left-5 top-1/2 flex -translate-y-1/2 items-center">
              <AtSign
                className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  status === "taken" || status === "invalid"
                    ? "text-destructive"
                    : status === "available"
                      ? "text-success"
                      : "text-muted-foreground group-focus-within:text-primary",
                )}
                aria-hidden="true"
              />
            </div>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn(
                "h-auto rounded-2xl border border-border bg-input py-5 pl-12 pr-6 text-lg text-foreground shadow-none outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40",
                status === "taken" || status === "invalid"
                  ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40"
                  : status === "available"
                    ? "border-success focus-visible:border-success focus-visible:ring-success/40"
                    : "",
              )}
              autoComplete="off"
              spellCheck={false}
              aria-describedby="username-status"
            />
          </div>

          <div
            id="username-status"
            role="status"
            aria-live="polite"
            className={cn(
              "flex min-h-[1.5rem] items-center justify-center gap-2.5 px-1 text-sm font-medium transition-colors duration-300",
              status === "idle" && "text-muted-foreground",
              status === "loading" && "text-muted-foreground",
              status === "available" && "text-success",
              (status === "taken" || status === "invalid") && "text-destructive",
            )}
          >
            {statusDot}
            <span>{message || "\u00A0"}</span>
          </div>

          <Button
            type="submit"
            className="h-auto w-full rounded-2xl bg-primary py-5 text-base font-bold text-primary-foreground shadow-[0_12px_24px_-8px_rgba(79,70,229,0.4)] transition-all duration-300 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
            disabled={status !== "available"}
          >
            Continue
          </Button>

          <p className="px-4 text-center text-xs leading-relaxed text-muted-foreground/70">
            By claiming this handle, you agree to our terms of service and
            identity guidelines.
          </p>
        </form>
      </div>
    </div>
  );
}
