import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");

  if (!currentPassword || newPassword.length < 6) {
    return NextResponse.json(
      { error: "Mật khẩu mới phải có ít nhất 6 ký tự." },
      { status: 400 }
    );
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.userId },
  });

  if (!admin) {
    return NextResponse.json({ error: "Không tìm thấy tài khoản." }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!isMatch) {
    return NextResponse.json(
      { error: "Mật khẩu hiện tại không chính xác." },
      { status: 400 }
    );
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: newHash },
  });

  return NextResponse.json({
    success: true,
    message: "Đã đổi mật khẩu thành công!",
  });
}
