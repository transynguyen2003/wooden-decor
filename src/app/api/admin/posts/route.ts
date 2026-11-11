import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/i18n";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
    include: {
      products: {
        include: { product: { select: { id: true, nameVi: true } } },
      },
    },
  });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const body = await request.json();
  const titleVi = String(body.titleVi || "").trim();
  if (!titleVi) {
    return NextResponse.json(
      { error: "Vui lòng nhập tiêu đề bài viết (Tiếng Việt)." },
      { status: 400 }
    );
  }

  let slug = slugify(body.slug || titleVi);
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const productIds: string[] = Array.isArray(body.productIds) ? body.productIds : [];

  const created = await prisma.post.create({
    data: {
      slug,
      titleVi,
      titleEn: String(body.titleEn || "").trim(),
      excerptVi: String(body.excerptVi || "").trim(),
      excerptEn: String(body.excerptEn || "").trim(),
      contentVi: String(body.contentVi || "").trim(),
      contentEn: String(body.contentEn || "").trim(),
      coverImage: String(body.coverImage || "").trim(),
      isPublished: Boolean(body.isPublished ?? true),
      products: {
        create: productIds.map((pid) => ({ productId: pid })),
      },
    },
  });

  return NextResponse.json({ success: true, post: created });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || "");
  const titleVi = String(body.titleVi || "").trim();

  if (!id || !titleVi) {
    return NextResponse.json(
      { error: "Vui lòng nhập đầy đủ mã bài viết và tiêu đề tiếng Việt." },
      { status: 400 }
    );
  }

  const productIds: string[] = Array.isArray(body.productIds) ? body.productIds : [];
  await prisma.postProduct.deleteMany({ where: { postId: id } });

  const updated = await prisma.post.update({
    where: { id },
    data: {
      titleVi,
      titleEn: String(body.titleEn || "").trim(),
      excerptVi: String(body.excerptVi || "").trim(),
      excerptEn: String(body.excerptEn || "").trim(),
      contentVi: String(body.contentVi || "").trim(),
      contentEn: String(body.contentEn || "").trim(),
      coverImage: String(body.coverImage || "").trim(),
      isPublished: Boolean(body.isPublished),
      products: {
        create: productIds.map((pid) => ({ productId: pid })),
      },
    },
  });

  return NextResponse.json({ success: true, post: updated });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "Thiếu mã bài viết." }, { status: 400 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
