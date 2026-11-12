import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/i18n";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      collections: { include: { collection: true } },
    },
  });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const body = await request.json();

  // 1. Tính năng NHÂN BẢN SẢN PHẨM (Mục 6.3 & 15.4 URD)
  if (body.action === "duplicate" && body.productId) {
    const source = await prisma.product.findUnique({
      where: { id: String(body.productId) },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        collections: true,
      },
    });

    if (!source) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm gốc để nhân bản." },
        { status: 404 }
      );
    }

    const newSlug = `${source.slug}-ban-sao-${Date.now().toString().slice(-4)}`;
    const duplicated = await prisma.product.create({
      data: {
        slug: newSlug,
        categoryId: source.categoryId,
        nameVi: `${source.nameVi} (Bản sao)`,
        nameEn: source.nameEn ? `${source.nameEn} (Copy)` : "",
        price: source.price,
        isContactPrice: source.isContactPrice,
        priceNoteVi: source.priceNoteVi,
        priceNoteEn: source.priceNoteEn,
        materialVi: source.materialVi,
        materialEn: source.materialEn,
        dimensionsVi: source.dimensionsVi,
        dimensionsEn: source.dimensionsEn,
        descriptionVi: source.descriptionVi,
        descriptionEn: source.descriptionEn,
        stockStatus: source.stockStatus,
        isVisible: false, // Lưu dạng nháp/ẩn trước để chủ shop kiểm tra rồi bật hiển thị
        isFeatured: false,
        images: {
          create: source.images.map((img) => ({
            url: img.url,
            altVi: img.altVi,
            altEn: img.altEn,
            sortOrder: img.sortOrder,
            isCover: img.isCover,
          })),
        },
        collections: {
          create: source.collections.map((c) => ({
            collectionId: c.collectionId,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, product: duplicated });
  }

  // 2. Tính năng SỬA GIÁ HÀNG LOẠT THEO % (Mục 15.3 URD)
  if (body.action === "bulk_price") {
    const percent = Number(body.percent);
    const categoryId = body.categoryId ? String(body.categoryId) : "";

    if (isNaN(percent) || percent === 0 || percent < -90 || percent > 200) {
      return NextResponse.json(
        { error: "Tỷ lệ phần trăm điều chỉnh không hợp lệ." },
        { status: 400 }
      );
    }

    const targets = await prisma.product.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        isContactPrice: false,
        price: { not: null, gt: 0 },
      },
    });

    for (const item of targets) {
      if (item.price) {
        // Làm tròn đến hàng trăm nghìn VND cho đẹp
        const rawNewPrice = item.price * (1 + percent / 100);
        const roundedPrice = Math.max(100000, Math.round(rawNewPrice / 100000) * 100000);
        await prisma.product.update({
          where: { id: item.id },
          data: { price: roundedPrice },
        });
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount: targets.length,
    });
  }

  // 3. THÊM SẢN PHẨM MỚI
  const nameVi = String(body.nameVi || "").trim();
  const categoryId = String(body.categoryId || "").trim();

  if (!nameVi || !categoryId) {
    return NextResponse.json(
      { error: "Vui lòng nhập Tên sản phẩm (Tiếng Việt) và chọn Danh mục." },
      { status: 400 }
    );
  }

  let slug = slugify(body.slug || nameVi);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const isContactPrice = Boolean(body.isContactPrice);
  const price = isContactPrice || !body.price ? null : Number(body.price);

  const imagesInput: Array<{
    url: string;
    altVi?: string;
    altEn?: string;
    sortOrder?: number;
    isCover?: boolean;
  }> = Array.isArray(body.images) ? body.images : [];

  const collectionIds: string[] = Array.isArray(body.collectionIds)
    ? body.collectionIds
    : [];

  const created = await prisma.product.create({
    data: {
      slug,
      categoryId,
      nameVi,
      nameEn: String(body.nameEn || "").trim(),
      price,
      isContactPrice,
      priceNoteVi: String(body.priceNoteVi || "").trim(),
      priceNoteEn: String(body.priceNoteEn || "").trim(),
      materialVi: String(body.materialVi || "").trim(),
      materialEn: String(body.materialEn || "").trim(),
      dimensionsVi: String(body.dimensionsVi || "").trim(),
      dimensionsEn: String(body.dimensionsEn || "").trim(),
      descriptionVi: String(body.descriptionVi || "").trim(),
      descriptionEn: String(body.descriptionEn || "").trim(),
      stockStatus: body.stockStatus === "OUT_OF_STOCK" ? "OUT_OF_STOCK" : "IN_STOCK",
      isVisible: Boolean(body.isVisible ?? true),
      isFeatured: Boolean(body.isFeatured ?? false),
      images: {
        create: imagesInput.map((img, idx) => ({
          url: img.url,
          altVi: String(img.altVi || nameVi),
          altEn: String(img.altEn || body.nameEn || nameVi),
          sortOrder: idx + 1,
          isCover: idx === 0 ? true : Boolean(img.isCover),
        })),
      },
      collections: {
        create: collectionIds.map((cid) => ({ collectionId: cid })),
      },
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, product: created });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || "");
  if (!id) {
    return NextResponse.json({ error: "Thiếu mã sản phẩm." }, { status: 400 });
  }

  // 1. SỬA GIÁ NHANH / ĐỔI TRẠNG THÁI NHANH NGAY TRÊN DANH SÁCH (Mục 15.3 & 15.6 URD)
  if (body.action === "quick_update") {
    const dataToUpdate: Record<string, unknown> = {};
    if (body.price !== undefined) {
      const numericPrice = Number(body.price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        dataToUpdate.price = null;
        dataToUpdate.isContactPrice = true;
      } else {
        dataToUpdate.price = numericPrice;
        dataToUpdate.isContactPrice = false;
      }
    }
    if (body.isContactPrice !== undefined) {
      dataToUpdate.isContactPrice = Boolean(body.isContactPrice);
    }
    if (body.isVisible !== undefined) {
      dataToUpdate.isVisible = Boolean(body.isVisible);
    }
    if (body.stockStatus !== undefined) {
      dataToUpdate.stockStatus = body.stockStatus;
    }
    if (body.isFeatured !== undefined) {
      dataToUpdate.isFeatured = Boolean(body.isFeatured);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, product: updated });
  }

  // 2. CẬP NHẬT TOÀN BỘ SẢN PHẨM TỪ FORM CHI TIẾT
  const nameVi = String(body.nameVi || "").trim();
  const categoryId = String(body.categoryId || "").trim();

  if (!nameVi || !categoryId) {
    return NextResponse.json(
      { error: "Tên sản phẩm tiếng Việt và Danh mục không được để trống." },
      { status: 400 }
    );
  }

  const isContactPrice = Boolean(body.isContactPrice);
  const price = isContactPrice || !body.price ? null : Number(body.price);

  const imagesInput: Array<{
    url: string;
    altVi?: string;
    altEn?: string;
    sortOrder?: number;
    isCover?: boolean;
  }> = Array.isArray(body.images) ? body.images : [];

  const collectionIds: string[] = Array.isArray(body.collectionIds)
    ? body.collectionIds
    : [];

  // Làm mới ảnh và bộ sưu tập của sản phẩm
  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.productCollection.deleteMany({ where: { productId: id } });

  const hasExplicitCover = imagesInput.some((i) => i.isCover);

  const updated = await prisma.product.update({
    where: { id },
    data: {
      categoryId,
      nameVi,
      nameEn: String(body.nameEn || "").trim(),
      price,
      isContactPrice,
      priceNoteVi: String(body.priceNoteVi || "").trim(),
      priceNoteEn: String(body.priceNoteEn || "").trim(),
      materialVi: String(body.materialVi || "").trim(),
      materialEn: String(body.materialEn || "").trim(),
      dimensionsVi: String(body.dimensionsVi || "").trim(),
      dimensionsEn: String(body.dimensionsEn || "").trim(),
      descriptionVi: String(body.descriptionVi || "").trim(),
      descriptionEn: String(body.descriptionEn || "").trim(),
      stockStatus: body.stockStatus === "OUT_OF_STOCK" ? "OUT_OF_STOCK" : "IN_STOCK",
      isVisible: Boolean(body.isVisible),
      isFeatured: Boolean(body.isFeatured),
      images: {
        create: imagesInput.map((img, idx) => ({
          url: img.url,
          altVi: String(img.altVi || nameVi),
          altEn: String(img.altEn || body.nameEn || nameVi),
          sortOrder: idx + 1,
          isCover: hasExplicitCover ? Boolean(img.isCover) : idx === 0,
        })),
      },
      collections: {
        create: collectionIds.map((cid) => ({ collectionId: cid })),
      },
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, product: updated });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  if (!id) {
    return NextResponse.json({ error: "Thiếu mã sản phẩm cần xóa." }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
