import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/i18n";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json({ collections });
  } catch (error) {
    console.error("GET /api/admin/collections error:", error);
    return NextResponse.json({ collections: [] }, { status: 500 });
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
      { error: "Vui lòng nhập tên bộ sưu tập (Tiếng Việt)." },
      { status: 400 }
    );
  }

  let slug = slugify(body.slug || nameVi);
  const existing = await prisma.collection.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const collection = await prisma.collection.create({
    data: {
      slug,
      nameVi,
      nameEn: String(body.nameEn || "").trim(),
      descriptionVi: String(body.descriptionVi || "").trim(),
      descriptionEn: String(body.descriptionEn || "").trim(),
      imageUrl: String(body.imageUrl || "").trim(),
      isFeatured: Boolean(body.isFeatured ?? true),
      sortOrder: Number(body.sortOrder) || 1,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, collection });
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
      { error: "Thiếu mã bộ sưu tập hoặc tên bộ sưu tập (Tiếng Việt)." },
      { status: 400 }
    );
  }

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      nameVi,
      nameEn: String(body.nameEn || "").trim(),
      descriptionVi: String(body.descriptionVi || "").trim(),
      descriptionEn: String(body.descriptionEn || "").trim(),
      imageUrl: String(body.imageUrl || "").trim(),
      isFeatured: Boolean(body.isFeatured ?? true),
      sortOrder: Number(body.sortOrder) || 1,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, collection });
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
  if (!id) {
    return NextResponse.json(
      { error: "Thiếu mã bộ sưu tập cần xóa." },
      { status: 400 });
  }

  await prisma.productCollection.deleteMany({ where: { collectionId: id } });
  await prisma.collection.delete({ where: { id } });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
