"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Invalid username or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-sand">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-display text-5xl tracking-wider-2 text-ink mb-2">213</p>
          <p className="text-xs uppercase tracking-wider-2 text-ink/50">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider-2 text-ink/60 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border border-ink/20 focus:border-ink px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider-2 text-ink/60 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-ink/20 focus:border-ink px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-terracotta">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-sand uppercase tracking-wider-2 text-xs py-4 hover:bg-sea transition-colors disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
