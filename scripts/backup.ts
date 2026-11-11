import fs from "fs/promises";
import path from "path";

/**
 * Mục 9 Sao lưu URD: Sao lưu cơ sở dữ liệu SQLite (prisma/dev.db) và thư mục ảnh (public/uploads)
 * Chạy bằng lệnh: npm.cmd run backup
 */
async function main() {
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);

  const backupRoot = path.join(process.cwd(), "backups", `backup-${stamp}`);
  await fs.mkdir(backupRoot, { recursive: true });

  // 1. Sao lưu file SQLite dev.db
  const dbSrc = path.join(process.cwd(), "prisma", "dev.db");
  const dbDest = path.join(backupRoot, "dev.db");
  await fs.copyFile(dbSrc, dbDest);

  // 2. Sao lưu toàn bộ thư mục public/uploads
  const uploadsSrc = path.join(process.cwd(), "public", "uploads");
  const uploadsDest = path.join(backupRoot, "uploads");
  await fs.cp(uploadsSrc, uploadsDest, { recursive: true });

  console.log(`✔ Đã sao lưu thành công Database và toàn bộ ảnh vào: ${backupRoot}`);
}

main().catch((err) => {
  console.error("Lỗi sao lưu:", err);
  process.exit(1);
});
