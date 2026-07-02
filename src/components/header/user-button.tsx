"use client"

import { Loader2Icon, LogInIcon } from "lucide-react"
import { authClient } from "@/app/lib/auth-client"

export function UserButton() {
  const { data: session, isPending } = authClient.useSession()

  async function handleSignIn() {
    await authClient.signIn.social({ provider: "github", callbackURL: "/" })
  }

  async function handleSignOut() {
    await authClient.signOut()
  }

  return (
    <>
      {isPending ? (
        <div className="size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center">
          <Loader2Icon className="size-3.5 text-navy-200 animate-spin" />
        </div>
      ) : session?.user ? (
        <button
          type="button"
          onClick={handleSignOut}
          className="size-8 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-navy-200 transition-colors duration-150"
        >
          {/** biome-ignore lint/performance/noImgElement: Github already optimizes the image */}
          <img
            src={session.user.image ?? ""}
            alt={session.user.name}
            className="size-8 rounded-full"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSignIn}
          className="size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center hover:bg-navy-600 transition-colors duration-150 cursor-pointer"
        >
          <LogInIcon className="size-3.5 text-navy-200" />
        </button>
      )}
    </>
  )
}