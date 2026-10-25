"use client"

import { useMemo } from "react"
import { useAppState, useCurrentUser, actions } from "@/lib/store"

const ADMIN_ROLES = ["admin", "management"] as const

export default function AdminPage() {
  const state = useAppState()
  const user = useCurrentUser()

  const openTickets = useMemo(
    () => (state?.tickets ?? []).filter((t) => t.status !== "hal qilindi"),
    [state]
  )

  if (!state) {
    return <p className="p-6 text-muted-foreground">Ma’lumotlar yuklanmadi.</p>
  }

  if (!user) {
    return (
      <section className="p-6">
        <h1 className="font-heading text-2xl font-bold">Administrator</h1>
        <p className="mt-2 text-muted-foreground">Avval tizimga kiring.</p>
      </section>
    )
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    return (
      <section className="p-6">
        <h1 className="font-heading text-2xl font-bold">Ruxsat yo‘q</h1>
        <p className="mt-2 text-muted-foreground">
          Bu bo‘lim faqat administrator va rahbariyat uchun.
        </p>
        <a className="mt-4 inline-block text-primary underline" href="/kabinet">
          Shaxsiy kabinet
        </a>
      </section>
    )
  }

  return (
    <section className="p-6 space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">Administrator paneli</h1>
        <p className="text-muted-foreground">
          Foydalanuvchilar: {state.users?.length ?? 0} · Ochiq murojaatlar: {openTickets.length}
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary text-left">
              <th className="p-3">Login</th>
              <th className="p-3">Ism</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Parol</th>
            </tr>
          </thead>
          <tbody>
            {(state.users ?? []).map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.login}</td>
                <td className="p-3">{u.name ?? "—"}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 font-mono">{u.password ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Murojaatlar</h2>
        {openTickets.length === 0 ? (
          <p className="text-muted-foreground">Ochiq murojaat yo‘q.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {openTickets.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 p-2 border rounded-lg">
                <span>{t.title ?? t.id}</span>
                <button
                  type="button"
                  className="rounded-lg bg-primary px-3 py-1 text-primary-foreground hover:bg-primary/90 transition"
                  onClick={() => actions.resolveTicket(t.id)}
                >
                  Hal qilindi
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
