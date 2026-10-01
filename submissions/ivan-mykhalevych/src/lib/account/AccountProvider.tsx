"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ATTEMPTS_KEY_BASE, parseAttempts } from "../attempts";
import type { Attempt } from "../attempts";
import { BEST_KEY_BASE, parseBestScores } from "../bestScores";
import type { BestScores } from "../bestScores";
import { profileKey } from "../profiles";
import { logAttempt, readProfiles, readStored, saveBestScore } from "../profileStore";
import { callApi } from "./api";
import type { ApiResult } from "./api";

export interface AccountUser {
  id: number;
  email: string;
  displayName: string;
}

export interface AccountData {
  best: BestScores;
  attempts: Attempt[];
}

export type Session =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "signedIn"; user: AccountUser; data: AccountData };

type Outcome = Promise<string | null>;

interface AccountContext {
  session: Session;
  signIn: (email: string, password: string) => Outcome;
  register: (email: string, password: string, displayName: string) => Outcome;
  signOut: () => Promise<void>;
  updateName: (displayName: string) => Outcome;
  changePassword: (current: string, next: string) => Outcome;
  deleteAccount: (password: string) => Outcome;
  importProgress: () => Outcome;
  record: (attempt: Attempt) => Promise<void>;
}

const Context = createContext<AccountContext | null>(null);

const send = <T,>(method: string, path: string, body?: unknown): Promise<ApiResult<T>> =>
  callApi<T>((url, init) => fetch(url, init), method, path, body);

const failure = <T,>(result: ApiResult<T>): string | null => (result.ok ? null : result.error);

function readLocalProgress(): AccountData | null {
  const { activeId } = readProfiles();
  if (activeId === null) return null;
  return {
    best: parseBestScores(readStored(profileKey(BEST_KEY_BASE, activeId))),
    attempts: parseAttempts(readStored(profileKey(ATTEMPTS_KEY_BASE, activeId))),
  };
}

async function fetchSession(): Promise<Session> {
  const me = await send<{ user: AccountUser }>("GET", "/api/auth/me");
  if (!me.ok) return { status: "guest" };
  const data = await send<AccountData>("GET", "/api/data");
  return data.ok ? { status: "signedIn", user: me.data.user, data: data.data } : { status: "guest" };
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ status: "loading" });

  const load = useCallback(async () => setSession(await fetchSession()), []);

  useEffect(() => {
    let cancelled = false;
    void fetchSession().then((next) => {
      if (!cancelled) setSession(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const authenticate = useCallback(
    async (path: string, body: unknown): Outcome => {
      const result = await send("POST", path, body);
      if (result.ok) await load();
      return failure(result);
    },
    [load],
  );

  const value = useMemo<AccountContext>(
    () => ({
      session,
      signIn: (email, password) => authenticate("/api/auth/login", { email, password }),
      register: (email, password, displayName) => authenticate("/api/auth/register", { email, password, displayName }),
      signOut: async () => {
        await send("POST", "/api/auth/logout");
        setSession({ status: "guest" });
      },
      updateName: async (displayName) => {
        const result = await send("PATCH", "/api/auth/me", { displayName });
        if (result.ok) await load();
        return failure(result);
      },
      changePassword: async (current, next) => failure(await send("POST", "/api/auth/password", { current, next })),
      deleteAccount: async (password) => {
        const result = await send("DELETE", "/api/auth/me", { password });
        if (result.ok) setSession({ status: "guest" });
        return failure(result);
      },
      importProgress: async () => {
        const local = readLocalProgress();
        if (local === null) return "generic";
        const result = await send("POST", "/api/data/import", local);
        if (result.ok) await load();
        return failure(result);
      },
      record: async (attempt) => {
        if (session.status !== "signedIn") {
          saveBestScore(attempt.level, attempt.percent);
          logAttempt(attempt);
          return;
        }
        await send("POST", "/api/data/attempts", attempt);
        await load();
      },
    }),
    [session, authenticate, load],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAccount(): AccountContext {
  const value = useContext(Context);
  if (value === null) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}
