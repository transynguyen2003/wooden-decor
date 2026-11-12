import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
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

    const uploaded: Array<{ url: string; name: string }> = [];
    const isServerlessReadOnly = Boolean(process.env.VERCEL);

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      const rawBytes = Buffer.from(await file.arrayBuffer());
      const isVideo =
        folder === "videos" || (file.type && file.type.startsWith("video/"));

      if (!isVideo) {
        // Tự động xoay đúng chiều & nén ảnh sang WebP nhẹ mượt
        let webpBuffer: Buffer = rawBytes;
        let mimeType = file.type || "image/webp";
        try {
          webpBuffer = await sharp(rawBytes)
            .rotate()
            .resize({
              width: folder === "logo" ? 600 : 1280,
              height: folder === "logo" ? 600 : 1280,
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({ quality: 80 })
            .toBuffer();
          mimeType = "image/webp";
        } catch {
          // Giữ nguyên buffer nếu định dạng đặc biệt
        }

        if (!isServerlessReadOnly) {
          try {
            const uploadDir = path.join(
              process.cwd(),
              "public",
              "uploads",
              folder
            );
            await mkdir(uploadDir, { recursive: true });
            const baseName =
              path
                .basename(file.name || "image", path.extname(file.name || ""))
                .toLowerCase()
                .replace(/[^a-z0-9-_]+/g, "-")
                .replace(/^-+|-+$/g, "")
                .slice(0, 50) || "image";
            const uniqueName = `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 7)}-${baseName}.webp`;
            const destPath = path.join(uploadDir, uniqueName);
            await writeFile(destPath, webpBuffer);
            uploaded.push({
              url: `/uploads/${folder}/${uniqueName}`,
              name: file.name,
            });
            continue;
          } catch {
            // Nếu môi trường Cloud chỉ đọc (EROFS), chuyển sang lưu Data URL trực tiếp vào Neon PostgreSQL
          }
        }

        const base64Url = `data:${mimeType};base64,${webpBuffer.toString("base64")}`;
        uploaded.push({
          url: base64Url,
          name: file.name,
        });
      } else {
        // Xử lý file video
        if (!isServerlessReadOnly) {
          try {
            const uploadDir = path.join(
              process.cwd(),
              "public",
              "uploads",
              folder
            );
            await mkdir(uploadDir, { recursive: true });
            const ext = path.extname(file.name || "").toLowerCase() || ".mp4";
            const baseName =
              path
                .basename(file.name || "video", ext)
                .toLowerCase()
                .replace(/[^a-z0-9-_]+/g, "-")
                .replace(/^-+|-+$/g, "")
                .slice(0, 50) || "video";
            const uniqueName = `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 7)}-${baseName}${ext}`;
            const destPath = path.join(uploadDir, uniqueName);
            await writeFile(destPath, rawBytes);
            uploaded.push({
              url: `/uploads/${folder}/${uniqueName}`,
              name: file.name,
            });
            continue;
          } catch {
            // Fallback cho môi trường serverless
          }
        }

        if (rawBytes.byteLength <= 4.5 * 1024 * 1024) {
          const mime = file.type || "video/mp4";
          uploaded.push({
            url: `data:${mime};base64,${rawBytes.toString("base64")}`,
            name: file.name,
          });
        } else {
          return NextResponse.json(
            {
              error:
                "Trên Vercel miễn phí, tệp tải lên trực tiếp giới hạn tối đa 4.5MB. Với video lớn hơn, vui lòng dán đường dẫn (URL) video.",
            },
            { status: 400 }
          );
        }
      }
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
