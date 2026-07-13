import type { Metadata } from "next";
import Link from "next/link";
import { documentedInterfaces, openApiDocument } from "../../lib/api/openapi";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Tài liệu API | Tin học trẻ LAB",
  description: "Hợp đồng dữ liệu cho kho đề và chu trình học Tin học trẻ.",
};

export default function ApiDocsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>TÀI LIỆU PHIÊN BẢN {openApiDocument.info.version}</p>
          <h1>{openApiDocument.info.title}</h1>
          <p>{openApiDocument.info.description}</p>
        </div>
        <nav aria-label="Liên kết tài liệu">
          <Link href="/">Về môi trường học</Link>
          <a href="/openapi.json">Mở OpenAPI JSON</a>
        </nav>
      </header>

      <section className={styles.pulse} aria-label="Tổng quan hợp đồng">
        <span><strong>{documentedInterfaces.length}</strong> giao diện</span>
        <span><strong>OpenAPI 3.1</strong> định dạng</span>
        <span><strong>D1</strong> dữ liệu bền vững</span>
        <span><strong>Sites identity</strong> quyền sở hữu</span>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>HỢP ĐỒNG RUNTIME</p>
            <h2>Giao diện được phục vụ</h2>
          </div>
          <p>Giao diện ghi hoặc đọc dữ liệu cá nhân lấy identity từ phía máy chủ; ứng dụng không nhận learner id từ trình duyệt.</p>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Phương thức</th><th>Đường dẫn</th><th>Quyền truy cập</th><th>Mục đích</th></tr></thead>
            <tbody>
              {documentedInterfaces.map(([method, path, access]) => {
                const operation = openApiDocument.paths[path as keyof typeof openApiDocument.paths];
                const detail = operation[method.toLowerCase() as keyof typeof operation] as { summary?: string };
                return (
                  <tr key={`${method}-${path}`}>
                    <td><code>{method}</code></td>
                    <td><code>{path}</code></td>
                    <td><span className={access === "public" ? styles.public : styles.token}>{access === "public" ? "Công khai trong site" : "Cần identity"}</span></td>
                    <td>{detail.summary}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.note}>
        <h2>Nguyên tắc dữ liệu</h2>
        <p>Nguồn chưa rõ quyền sử dụng chỉ được lưu metadata và liên kết gốc. Mã nguồn người học không được thực thi trong v1. Phản hồi pilot chỉ xuất hiện dưới dạng số liệu tổng hợp.</p>
      </section>
    </main>
  );
}
