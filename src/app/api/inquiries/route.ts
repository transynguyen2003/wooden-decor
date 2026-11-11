import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

// Bộ nhớ tạm giới hạn số lần gửi liên tiếp theo IP (Chống spam cơ bản - Mục 5.5 URD)
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000; // 10 phút
const MAX_SUBMISSIONS = 5;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Kiểm tra bẫy spam ẩn (Honeypot)
    if (body.honeypot && String(body.honeypot).trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    // 2. Kiểm tra giới hạn tần suất gửi
    const forwarded = request.headers.get("x-forwarded-for") || "local";
    const ip = forwarded.split(",")[0].trim();
    const now = Date.now();
    const history = (rateLimitMap.get(ip) || []).filter((t) => now - t < WINDOW_MS);

    if (history.length >= MAX_SUBMISSIONS) {
      return NextResponse.json(
        {
          error:
            "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau ít phút hoặc gọi trực tiếp hotline.",
        },
        { status: 429 }
      );
    }

    const customerName = String(body.customerName || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();
    const productId = body.productId ? String(body.productId) : null;

    if (customerName.length < 2 || phone.length < 8) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ họ tên và số điện thoại hợp lệ." },
        { status: 400 }
      );
    }

    history.push(now);
    rateLimitMap.set(ip, history);

    const inquiry = await prisma.inquiry.create({
      data: {
        customerName,
        phone,
        message,
        productId,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch {
    return NextResponse.json(
      { error: "Không thể gửi yêu cầu lúc này. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  const inquiries = await prisma.inquiry.findMany({
    where: status && status !== "ALL" ? { status } : undefined,
    include: {
      product: {
        select: { id: true, nameVi: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ inquiries });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || "");
  if (!id) {
    return NextResponse.json({ error: "Thiếu mã yêu cầu." }, { status: 400 });
  }

  const updated = await prisma.inquiry.update({
    where: { id },
    data: {
      status: String(body.status || "NEW"),
      internalNote: String(body.internalNote || ""),
    },
  });

  return NextResponse.json({ success: true, inquiry: updated });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "Thiếu mã yêu cầu." }, { status: 400 });
  }

  await prisma.inquiry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
