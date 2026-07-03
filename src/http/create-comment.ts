import "server-only"

import { headers } from "next/headers"
import { CommentSchema } from "@/api/routes/create-comment"
import { clientEnv } from "@/env"
import { getCookiesFromHeaders } from "./utils/get-cookies-from-headers"
import { fetchJson } from "./utils/fetch-json"
import { updateTag } from "next/cache"

interface CreateCommentParams {
  issueId: string
  text: string
}

export async function createComment({ issueId, text }: CreateCommentParams) {
  const url = new URL(
    `/api/issues/${issueId}/comments`,
    clientEnv.NEXT_PUBLIC_API_URL,
  )

  const incomingHeaders = await headers()

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: getCookiesFromHeaders(incomingHeaders),
  })

  const data = await fetchJson(response)

  updateTag(`issue-comments-${issueId}`)

  return CommentSchema.parse(data)
}