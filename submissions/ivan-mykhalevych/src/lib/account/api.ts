export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };
export type Fetcher = (input: string, init: RequestInit) => Promise<Response>;

export async function callApi<T>(
  _fetcher: Fetcher,
  _method: string,
  _path: string,
  _body?: unknown,
): Promise<ApiResult<T>> {
  throw new Error("not implemented");
}
