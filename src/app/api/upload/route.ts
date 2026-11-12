import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/auth";

const ALLOWED_FOLDERS = new Set([
  "logo",
  "banners",
  "products",
  "categories",
  "collections",
  "posts",
  "videos",
]);

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Không có quyền truy cập." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const rawFolder = String(formData.get("folder") || "products").trim();
    const folder = ALLOWED_FOLDERS.has(rawFolder) ? rawFolder : "products";

    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Vui lòng chọn ít nhất 1 tệp để tải lên." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const uploaded: Array<{ url: string; name: string }> = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      const ext = path.extname(file.name || "").toLowerCase() || (folder === "videos" ? ".mp4" : ".webp");
      const baseName = path
        .basename(file.name || "file", ext)
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50) || "media";

      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${baseName}${ext}`;
      const destPath = path.join(uploadDir, uniqueName);

      const bytes = Buffer.from(await file.arrayBuffer());
      await writeFile(destPath, bytes);

      uploaded.push({
        url: `/uploads/${folder}/${uniqueName}`,
        name: file.name,
      });
    }

    return NextResponse.json({ files: uploaded });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi tải tệp lên." },
      { status: 500 }
    );
  }
}
