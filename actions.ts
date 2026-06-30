"use server"

import { cookies } from "next/headers"

const COOKIE_NAME = "operator_unlocked"

function getPasscode() {
  // Set OPERATOR_PASSCODE in your project env vars. Falls back to a default.
  return process.env.OPERATOR_PASSCODE ?? "letmein"
}

export async function verifyPasscode(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const entered = String(formData.get("passcode") ?? "")
  if (entered.length === 0) {
    return { ok: false, error: "Enter the passcode." }
  }
  if (entered !== getPasscode()) {
    return { ok: false, error: "Incorrect passcode." }
  }
  const store = await cookies()
  store.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    // `secure` must be false on http preview origins, or the browser drops the cookie
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12, // 12 hours
    path: "/",
  })
  return { ok: true }
}

export async function isOperatorUnlocked(): Promise<boolean> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === "1"
}

export async function lockOperator(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
