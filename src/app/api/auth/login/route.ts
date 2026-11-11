import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  getCookieMaxAge,
} from "@/lib/auth";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // Khóa 15 phút khi nhập sai 5 lần liên tiếp

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ email và mật khẩu." },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không chính xác." },
        { status: 401 }
      );
    }

    // Kiểm tra xem tài khoản có đang bị khóa tạm thời do nhập sai nhiều lần không (Mục 6.1 URD)
    if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) {
      const remainingMinutes = Math.ceil(
        (admin.lockedUntil.getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          error: `Tài khoản đang tạm khóa do nhập sai mật khẩu quá ${MAX_FAILED_ATTEMPTS} lần. Vui lòng thử lại sau ${remainingMinutes} phút.`,
        },
        { status: 429 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      const nextAttempts = admin.failedAttempts + 1;
      const shouldLock = nextAttempts >= MAX_FAILED_ATTEMPTS;

      await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          failedAttempts: nextAttempts,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : null,
        },
      });

      if (shouldLock) {
        return NextResponse.json(
          {
            error: `Bạn đã nhập sai ${MAX_FAILED_ATTEMPTS} lần liên tiếp. Tài khoản tạm khóa 15 phút để bảo mật.`,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Mật khẩu không đúng. Còn ${
            MAX_FAILED_ATTEMPTS - nextAttempts
          } lần thử trước khi tạm khóa.`,
        },
        { status: 401 }
      );
    }

    // Đăng nhập đúng -> xóa bộ đếm lỗi
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });

    const token = await createAdminToken({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      user: { email: admin.email, name: admin.name },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getCookieMaxAge(),
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
