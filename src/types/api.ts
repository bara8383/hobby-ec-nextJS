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
