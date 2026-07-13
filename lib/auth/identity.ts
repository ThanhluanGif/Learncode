export type AuthenticatedIdentity = {
  email: string;
  displayName: string;
};

export type LearnerRecord = {
  id: number;
  displayName: string;
  division: "A" | "B" | "C1" | "C2";
  schoolLevel: "Tiểu học" | "THCS" | "THPT";
  xp: number;
  createdAt: string;
};

export type LearnerIdentityStore = {
  findByEmail(email: string): Promise<LearnerRecord | null>;
  create(input: { email: string; displayName: string }): Promise<LearnerRecord>;
};

const EMAIL_HEADER = "oai-authenticated-user-email";
const FULL_NAME_HEADER = "oai-authenticated-user-full-name";
const FULL_NAME_ENCODING_HEADER = "oai-authenticated-user-full-name-encoding";
const PERCENT_ENCODED_UTF8 = "percent-encoded-utf-8";

export class AuthRequiredError extends Error {
  readonly code = "AUTH_REQUIRED";

  constructor() {
    super("Bạn cần đăng nhập để sử dụng dữ liệu học tập.");
    this.name = "AuthRequiredError";
  }
}

export function readAuthenticatedIdentity(headers: Headers): AuthenticatedIdentity | null {
  const email = normalizeEmail(headers.get(EMAIL_HEADER));
  if (!email) return null;

  const encodedName = headers.get(FULL_NAME_HEADER);
  const decodedName = encodedName && headers.get(FULL_NAME_ENCODING_HEADER) === PERCENT_ENCODED_UTF8
    ? safeDecodeURIComponent(encodedName)
    : null;

  return {
    email,
    displayName: decodedName?.trim().slice(0, 120) || email,
  };
}

export async function resolveLearner(
  headers: Headers,
  store: LearnerIdentityStore,
): Promise<LearnerRecord> {
  const identity = readAuthenticatedIdentity(headers);
  if (!identity) throw new AuthRequiredError();

  const existing = await store.findByEmail(identity.email);
  if (existing) return existing;

  return store.create(identity);
}

function normalizeEmail(value: string | null): string | null {
  const email = value?.trim().toLowerCase();
  if (!email || email.length > 320 || !email.includes("@")) return null;
  return email;
}

function safeDecodeURIComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
