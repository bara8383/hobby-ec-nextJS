import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "学習用テンプレートのため、Stripe連携は未実装です。"
  });
}
