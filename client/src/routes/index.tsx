import { createFileRoute } from "@tanstack/react-router";

import { UsernameChecker } from "@/components/username-checker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Username Checker — Claim your handle" },
      {
        name: "description",
        content:
          "Check if your preferred username is available and claim it before someone else does.",
      },
      { property: "og:title", content: "Username Checker — Claim your handle" },
      {
        property: "og:description",
        content:
          "Check if your preferred username is available and claim it before someone else does.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <UsernameChecker />
    </main>
  );
}
