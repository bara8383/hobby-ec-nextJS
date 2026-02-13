import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "METHOD_NOT_ALLOWED"
  | "INTERNAL_SERVER_ERROR"
  | "EXTERNAL_SERVICE_UNAVAILABLE";

export type ApiErrorResponse = {
  status: number;
  code: ApiErrorCode;
  message: string;
};

export function errorResponse(status: number, code: ApiErrorCode, message: string) {
  const payload: ApiErrorResponse = {
    status,
    code,
    message
  };

  return NextResponse.json(payload, { status });
}
