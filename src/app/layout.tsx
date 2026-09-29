import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'AlgoMath Vietnam',
  description:
    'Học liệu miễn phí đưa tư duy Olympic Toán vào Khoa học Máy tính, dành cho học sinh lớp 9 đến 11.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,600;0,700;1,400&family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap&subset=vietnamese,latin,latin-ext"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
