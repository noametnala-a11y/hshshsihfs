"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { verifyPasscode } from "@/app/operator/actions"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export function PasscodeGate() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await verifyPasscode(formData)
      if (res.ok) {
        router.refresh()
      } else {
        setError(res.error ?? "Something went wrong.")
      }
    })
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-5 flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Lock className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Operator Console</h1>
            <p className="text-sm text-muted-foreground text-pretty">
              Enter the passcode to access the live conversations.
            </p>
          </div>
        </div>

        <label htmlFor="passcode" className="sr-only">
          Passcode
        </label>
        <input
          id="passcode"
          name="passcode"
          type="password"
          autoComplete="off"
          autoFocus
          placeholder="Passcode"
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus-visible:ring-2"
        />

        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

        <Button type="submit" className="mt-4 w-full" disabled={pending}>
          {pending ? "Checking…" : "Unlock"}
        </Button>
      </form>
    </main>
  )
}
