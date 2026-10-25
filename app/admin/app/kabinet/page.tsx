"use client"

import { useMemo } from "react"
import { useAppState, useCurrentUser, actions } from "@/lib/store"

const STAFF_ROLES = ["admin", "management", "teacher", "tutor", "staff"] as const

export default function KabinetPage() {
  const state = useAppState()
  const user = useCurrentUser()

  const myCreative = useMemo(
    () => (state?.creative ?? []).filter((item) => item.userId === user?.id),
    [state, user]
  )

  const myPlan = user ? state?.plans?.[user.id] : undefined

  if (!state) {
    return <p className="p-6 text-muted-foreground">Ma’lumotlar yuklanmadi.</p>
  }

  if (!user) {
    return (
      <section className="p-6">
        <h1 className="font-heading text-2xl font-bold">Shaxsiy kabinet</h1>
        <p className="mt-2 text-muted-foreground">
          Kirish uchun yuqoridagi «Tizimga kirish» tugmasidan foydalaning.
        </p>
      </section>
    )
  }

  return (
    <section className="p-6 space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">Shaxsiy kabinet</h1>
        <p className="text-muted-foreground">
          {user.name ?? user.login} · {user.role}
          {user.originTag ? ` · ${user.originTag}` : ""}
        </p>
      </header>

      {STAFF_ROLES.includes(user.role) && (
        <p>
          Xodimlar paneli:{" "}
          <a className="text-primary underline" href="/admin">
            Administrator
          </a>
        </p>
      )}

      {myPlan ? (
        <div>
          <h2 className="text-lg font-semibold">Reja</h2>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-secondary p-4 text-sm">
            {JSON.stringify(myPlan, null, 2)}
          </pre>
        </div>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold">Ijodiy ishlarim</h2>
        {myCreative.length === 0 ? (
          <p className="text-muted-foreground">Hozircha ish yo‘q.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {myCreative.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="rounded-xl bg-secondary px-4 py-2 hover:bg-secondary/80 transition"
        onClick={() => actions.setSession(null)}
      >
        Chiqish
      </button>
    </section>
  )
}
