export const dynamic = "force-dynamic";
export const revalidate = 0;

import { errorResponse } from "@/lib/apiError";

export async function POST() {
  return errorResponse(
    503,
    "EXTERNAL_SERVICE_UNAVAILABLE",
    "学習用テンプレートのため、Stripe連携は未実装です。"
  );
}

export async function GET() {
  return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
}
