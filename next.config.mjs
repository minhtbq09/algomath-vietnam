/**
 * Đường dẫn gốc khi deploy vào thư mục con.
 *
 * GitHub Pages dạng project site phục vụ site ở địa chỉ
 * https://<tài-khoản>.github.io/<tên-repo>/ chứ không phải ở gốc tên miền.
 * Khi đó mọi liên kết tuyệt đối kiểu /vi/ sẽ hỏng nếu không khai báo basePath.
 *
 * Đặt biến môi trường NEXT_PUBLIC_BASE_PATH = /<tên-repo> khi build cho GitHub Pages.
 * Để trống khi deploy Vercel hoặc GitHub Pages dạng <tài-khoản>.github.io.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
