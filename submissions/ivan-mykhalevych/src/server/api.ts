import type { Db } from "./db";

export interface ApiRequest {
  method: string;
  path: string;
  origin: string | null;
  host: string | null;
  contentType: string | null;
  cookie: string | null;
  body: string;
}

export interface ApiResponse {
  status: number;
  body: unknown;
  setCookie?: string;
}

export function handleApi(_db: Db, _request: ApiRequest, _now: number, _secure = false): ApiResponse {
  throw new Error("not implemented");
}
