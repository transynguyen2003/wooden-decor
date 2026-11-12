import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/i18n";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const nameVi = String(body.nameVi || "").trim();
  if (!nameVi) {
    return NextResponse.json(
      { error: "Vui lòng nhập tên danh mục (Tiếng Việt)." },
      { status: 400 }
    );
  }

  let slug = slugify(body.slug || nameVi);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const category = await prisma.category.create({
    data: {
      slug,
      nameVi,
      nameEn: String(body.nameEn || "").trim(),
      descriptionVi: String(body.descriptionVi || "").trim(),
      descriptionEn: String(body.descriptionEn || "").trim(),
      imageUrl: String(body.imageUrl || "").trim(),
      sortOrder: Number(body.sortOrder) || 1,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, category });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const id = String(body.id || "").trim();
  const nameVi = String(body.nameVi || "").trim();

  if (!id || !nameVi) {
    return NextResponse.json(
      { error: "Thiếu mã danh mục hoặc tên danh mục (Tiếng Việt)." },
      { status: 400 }
    );
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      nameVi,
      nameEn: String(body.nameEn || "").trim(),
      descriptionVi: String(body.descriptionVi || "").trim(),
      descriptionEn: String(body.descriptionEn || "").trim(),
      imageUrl: String(body.imageUrl || "").trim(),
      sortOrder: Number(body.sortOrder) || 1,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, category });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  const transferTo = searchParams.get("transferTo") || "";

  if (!id) {
    return NextResponse.json(
      { error: "Thiếu mã danh mục cần xóa." },
      { status: 400 }
    );
  }

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    if (!transferTo || transferTo === id) {
      return NextResponse.json(
        {
          error:
            "Danh mục này đang có sản phẩm. Vui lòng chọn danh mục khác để chuyển sản phẩm sang trước khi xóa.",
        },
        { status: 400 }
      );
    }

    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryId: transferTo },
    });
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/", "layout");

  return NextResponse.json({ success: true });
}
