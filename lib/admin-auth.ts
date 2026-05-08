export const COOKIE_NAME = "admin_session_213";

const SECRET = "213-admin-ramy-secret-key";

// Works in both Edge (middleware) and Node (API routes) runtimes
async function hmac(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function verifyCredentials(username: string, password: string): boolean {
  return username === "admin" && password === "ramy";
}

export async function createSessionToken(): Promise<string> {
  return hmac("admin:authenticated");
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const expected = await createSessionToken();
  return token === expected;
}
