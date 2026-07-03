import { IssueInteractionsResponseSchema } from "@/api/routes/schemas/issue-interactions";
import { clientEnv } from "@/env";
import { fetchJson } from "./utils/fetch-json";

interface GetIssueInteractionsParams {
  issueIds: string[];
}

export async function getIssueInteractions({
  issueIds,
}: GetIssueInteractionsParams) {
  const url = new URL(
    `/api/issues/interactions`,
    clientEnv.NEXT_PUBLIC_API_URL,
  );

  url.searchParams.set("issueIds", issueIds.join(","));

  const response = await fetch(url, {
    credentials: "include",
  });
  const data = await fetchJson(response);

  return IssueInteractionsResponseSchema.parse(data);
}
