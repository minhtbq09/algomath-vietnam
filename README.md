# AlgoMath Vietnam

Website học liệu miễn phí đưa tư duy Olympic Toán vào Khoa học Máy tính, dành cho học sinh lớp 9 đến 11. Song ngữ Việt và Anh.

Trang chủ tiếng Việt nằm ở `/vi/`, tiếng Anh ở `/en/`.

## Chạy trên máy

Cần Node.js phiên bản 20 trở lên.

```bash
npm install
npm run dev      # mở http://localhost:3000
npm run build    # xuất trang tĩnh vào thư mục out/
```

## Đưa lên mạng

Site xuất ra HTML tĩnh hoàn toàn, không server, không cơ sở dữ liệu, không tài khoản người dùng. Chi phí vận hành bằng 0. Có hai cách đăng, chọn một.

### Cách 1: GitHub Pages

Repo đã có sẵn workflow tại `.github/workflows/deploy.yml`. Các bước:

1. Đẩy mã nguồn lên GitHub, nhánh `main`
2. Vào repo, mục **Settings** rồi **Pages**
3. Ở phần **Source**, chọn **GitHub Actions** thay vì Deploy from a branch
4. Đợi khoảng 2 phút, địa chỉ site hiện ra ngay trên trang đó

Từ đó mỗi lần push lên `main`, site tự build lại.

Workflow tự nhận biết repo được phục vụ ở đâu:

| Tên repo | Địa chỉ site | Đường dẫn gốc |
| --- | --- | --- |
| `<tài-khoản>.github.io` | `https://<tài-khoản>.github.io/` | không có |
| tên bất kỳ khác | `https://<tài-khoản>.github.io/<tên-repo>/` | `/<tên-repo>` |

Bạn không cần làm gì với bảng này, workflow tự xử lý.

**Muốn build thử ở máy đúng như trên GitHub Pages** (thay `algomath-vietnam` bằng tên repo thật):

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/algomath-vietnam"; npm run build

# macOS hoặc Linux
NEXT_PUBLIC_BASE_PATH=/algomath-vietnam npm run build
```

Hai file bắt buộc phải có, đừng xoá: `public/.nojekyll` (nếu thiếu, GitHub bỏ qua thư mục `_next` và site mất sạch CSS lẫn JavaScript) và `.github/workflows/deploy.yml`.

### Cách 2: Vercel

Vào vercel.com, chọn Import Project và trỏ vào repo. Vercel tự nhận diện Next.js, không cần cấu hình gì, không cần biến môi trường nào. Site nằm ở gốc tên miền nên không có chuyện đường dẫn con.

Vercel dễ hơn một chút và cho tên miền gọn hơn. GitHub Pages thì gộp mã nguồn và website vào một chỗ, tiện khi muốn chỉ dùng một tài khoản duy nhất.

## Sửa nội dung

Đây là phần bạn sẽ đụng tới thường xuyên. Toàn bộ nằm trong thư mục `content/`, không cần biết React.

| Muốn sửa gì | Sửa file nào |
| --- | --- |
| Nội dung một bài học | `content/lessons/<slug>/vi.mdx` và `en.mdx` |
| Bài tập | `content/exercises/*.json` |
| Thông tin workshop | `content/workshops/workshops.json` |
| Số liệu tác động | `content/impact.json` |
| Đội ngũ, cố vấn, liên hệ | `content/about.json` |
| Tên bài, thứ tự, cặp Toán ↔ thuật toán | `src/lib/curriculum.ts` |
| Chữ trên nút, menu, tiêu đề trang | `src/i18n/dictionary.ts` |

Xem `docs/them-bai-hoc.md` để biết cách thêm một bài học mới.

### Bản tiếng Anh chưa viết thì sao

Không sao. Nếu thiếu file `en.mdx`, trang tiếng Anh tự hiển thị nội dung tiếng Việt kèm một dòng ghi chú. Website không bao giờ lỗi 404 vì thiếu bản dịch, nên bạn có thể viết tiếng Việt trước cho đủ 20 bài rồi dịch sau.

## Cấu trúc mã nguồn

```
content/          nội dung: bài học, bài tập, workshop, số liệu
src/algorithms/   logic thuật toán thuần, không dính giao diện
src/components/   giao diện dùng chung và các mô phỏng
src/app/          các trang, theo cấu trúc [locale]/...
src/i18n/         chuỗi giao diện hai ngôn ngữ
src/lib/          đọc file nội dung, dữ liệu chương trình
```

Thư mục `src/algorithms/` được tách riêng có chủ đích: nó chỉ chứa thuật toán thuần, không import React, không biết gì về màu sắc hay bố cục. Cố vấn kỹ thuật có thể đọc và kiểm tra tính đúng đắn ở đây mà không cần biết lập trình web.

## Cách các mô phỏng hoạt động

Mỗi thuật toán không tự chạy trên màn hình. Nó chạy trước một lần và sinh ra một danh sách frame bất biến, mỗi frame là ảnh chụp trạng thái đầy đủ tại một bước kèm câu giải thích song ngữ. Component `AlgorithmPlayer` chỉ việc đổi chỉ số frame.

Nhờ vậy nút Bước trước chỉ là `index - 1`, không cần chạy ngược thuật toán, và cả 10 mô phỏng hành xử giống hệt nhau.

Thêm một mô phỏng mới cần đúng ba việc:

1. Viết `src/algorithms/<ten>.ts` sinh frame
2. Viết `src/components/viz/<Ten>Viz.tsx` để vẽ một frame
3. Thêm một dòng vào `VIZ_REGISTRY` trong `src/components/viz/index.tsx`

Sau đó nhúng vào bài học bằng `<Viz name="<ten>" />`.

Bảng màu trạng thái khai báo tại `STATE_COLOR` trong `src/algorithms/types.ts`. Đổi ở đó là đổi cho cả 10 mô phỏng cùng lúc.

## Tình trạng nội dung

| Hạng mục | Đã có | Ghi chú |
| --- | --- | --- |
| Bài học tiếng Việt | 20 / 20 | đủ |
| Bài học tiếng Anh | 20 / 20 | đủ |
| Mô phỏng | 10 / 10 | đủ |
| Bài tập | 44 / 60 | còn thiếu cho các bài 08, 09, 12, 14, 15, 18 |

Bài tập song ngữ sẵn. Nhãn chủ đề bài tập dịch trong `src/i18n/topics.ts`, chỉ cần sửa khi bạn đặt ra một chủ đề mới.

## Đo tác động

Website không thu thập bất kỳ thông tin cá nhân nào. Đăng ký và khảo sát dùng Google Forms bên ngoài.

Với pre-test và post-test, dùng mã ẩn danh in sẵn trên phiếu, ví dụ `W1-042`, thay vì hỏi họ tên. Hai bài kiểm tra ghép được với nhau qua mã đó, nên tính được mức tiến bộ của từng học sinh mà không lưu danh tính ai cả.

Để đo lượt truy cập, bật Vercel Analytics trong bảng điều khiển Vercel hoặc gắn Umami. Cả hai đều không dùng cookie.

## Đội ngũ

Thông tin đội ngũ và cố vấn nằm trong `content/about.json` và hiển thị ở trang Về dự án. Nhớ điền tên thật vào các ô còn ghi `TÊN NGƯỜI HỖ TRỢ KỸ THUẬT` và `CHƯA XÁC NHẬN` trước khi công bố.

## Ghi chú về công cụ

Phần hạ tầng website, engine mô phỏng và giao diện được phát triển với sự hỗ trợ của công cụ AI. Nội dung chương trình, bài học và bài tập do đội ngũ dự án biên soạn và chịu trách nhiệm.

Nếu dự án được nộp cho một cuộc thi hoặc chương trình có quy định về việc sử dụng công cụ AI, hãy đọc quy định đó và khai báo theo đúng yêu cầu.

## Giấy phép

Nội dung học liệu dùng cho mục đích giáo dục phi lợi nhuận. Giáo viên được dùng lại trong lớp mà không cần xin phép.

## Cập nhật bảo mật thư viện

Các phiên bản trong `package.json` đã được cập nhật theo khuyến cáo bảo mật mới nhất tại thời điểm bàn giao. Nếu `npm install` báo cảnh báo về phiên bản Next.js trong tương lai, chạy:

```bash
npx fix-react2shell-next --fix
npm install
npm run build
```

Ba cảnh báo `high` còn lại của `npm audit` đến từ `postcss` và `sharp`, hai thư viện chỉ chạy lúc build trên máy bạn, không nằm trong trang tĩnh đã xuất ra. Không cần xử lý và **không nên** chạy `npm audit fix --force`, vì lệnh đó nâng Next.js lên phiên bản major và có thể làm hỏng dự án.
