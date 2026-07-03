export async function fetchJson<T>(response: Response): Promise<T> {
  const text = await response.text()

  if (!response.ok) {
    throw new Error(
      `API ${response.url} returned ${response.status}: ${text.slice(0, 200)}`,
    )
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(
      `API ${response.url} returned invalid JSON: ${text.slice(0, 200)}`,
    )
  }
}
