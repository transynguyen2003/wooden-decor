import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const body = await request.json();
  const entries: Array<{
    key: string;
    valueVi: string;
    valueEn?: string;
    group?: string;
  }> = Array.isArray(body.settings) ? body.settings : [];

  for (const item of entries) {
    if (!item.key) continue;
    await prisma.siteSetting.upsert({
      where: { key: item.key },
      update: {
        valueVi: String(item.valueVi ?? ""),
        valueEn: String(item.valueEn ?? item.valueVi ?? ""),
        group: item.group || "general",
      },
      create: {
        key: item.key,
        valueVi: String(item.valueVi ?? ""),
        valueEn: String(item.valueEn ?? item.valueVi ?? ""),
        group: item.group || "general",
      },
    });
  }

  return NextResponse.json({ success: true });
}
