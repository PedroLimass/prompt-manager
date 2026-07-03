import { LikeResponseSchema } from "@/api/routes/schemas/issue-likes";
import { clientEnv } from "@/env";
import { fetchJson } from "./utils/fetch-json";

interface ToggleLikeParams {
  issueId: string;
}

export async function toggleLike({ issueId }: ToggleLikeParams) {
  const url = new URL(
    `/api/issues/${issueId}/like`,
    clientEnv.NEXT_PUBLIC_API_URL,
  );
  const response = await fetch(url, {
    method: "POST",
  });
  const data = await fetchJson(response);

  return LikeResponseSchema.parse(data);
}
