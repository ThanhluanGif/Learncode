import { AuthRequiredError } from "../auth/identity";

export type ApiErrorCode =
  | "AUTH_REQUIRED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "DATABASE_ERROR";

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  issues?: Array<{ path: string; message: string }>,
) {
  return Response.json(
    { error: { code, message, ...(issues?.length ? { issues } : {}) } },
    { status },
  );
}

export function handledApiError(error: unknown) {
  if (error instanceof AuthRequiredError) {
    return apiError(401, error.code, error.message);
  }

  console.error("API database failure", error);
  return apiError(500, "DATABASE_ERROR", "Không thể truy cập kho dữ liệu lúc này.");
}
