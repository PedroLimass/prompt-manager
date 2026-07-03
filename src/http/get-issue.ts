import { IssueSchema } from "@/api/routes/get-issue";
import { clientEnv } from "@/env";
import { fetchJson } from "./utils/fetch-json";

interface GetIssueParams {
  id: string;
}

export async function getIssue({ id }: GetIssueParams) {
  "use cache";

  const url = new URL(`/api/issues/${id}`, clientEnv.NEXT_PUBLIC_API_URL);

  const response = await fetch(url);
  const data = await fetchJson(response);

  return IssueSchema.parse(data);
}
