# Thêm hoặc sửa một bài học

Bạn không cần biết React để làm việc này. Chỉ cần soạn thảo văn bản.

## Sửa một bài đã có

Mở `content/lessons/<slug>/vi.mdx`, sửa như sửa file văn bản thường, lưu lại. Nếu bạn đang sửa trên GitHub thì bấm Commit changes, website tự cập nhật sau khoảng một phút.

## Thêm một bài mới

### Bước 1. Tạo thư mục và file

Slug đã được đặt sẵn cho cả 20 bài trong `src/lib/curriculum.ts`. Ví dụ bài 4 có slug `04-phep-chia-co-du`.

Tạo file `content/lessons/04-phep-chia-co-du/vi.mdx`.

### Bước 2. Viết theo đúng sáu bước

Dán khung này rồi điền vào:

```mdx
---
title: Tên bài học
---

## 1. Bài toán mở đầu

> Một câu hỏi Toán quen thuộc, đặt trong dấu > để hiển thị thành khung trích dẫn.

Vài câu dẫn dắt.

## 2. Ý tưởng Toán

Phân tích quy luật, quy nạp, bất biến hoặc cấu trúc tổ hợp.

## 3. Chuyển thành thuật toán

Cần lưu gì, mỗi bước làm gì, dừng khi nào.

## 4. Mô phỏng

<Viz name="ten-mo-phong" />

## 5. Pseudocode và Python

```python
# code ở đây
```

## 6. Điều đáng nhớ

Một đoạn ngắn nói rõ bài này để lại điều gì.
```

Bài học sẽ tự xuất hiện trên trang danh sách ngay khi file tồn tại. Trước đó nó hiển thị là "Sắp có".

## Những thứ viết được trong file MDX

**Công thức Toán** viết bằng LaTeX. Trong dòng thì kẹp giữa một dấu đô la, ví dụ `$\gcd(a,b)$`. Tách riêng một dòng thì kẹp giữa hai dấu đô la:

```
$$\gcd(a, b) = \gcd(b, r)$$
```

**Bảng** viết theo cú pháp Markdown thường:

```
| Cột A | Cột B |
| --- | --- |
| nội dung | nội dung |
```

**Khung ghi chú** dùng khi muốn nhấn mạnh một điểm dễ hiểu nhầm:

```mdx
<Note>
Nội dung ghi chú.
</Note>
```

**Mô phỏng** nhúng bằng một dòng. Tên hợp lệ hiện có: `euclid`, `bfs`, `binary-search`.

```mdx
<Viz name="bfs" />
```

Nếu gõ sai tên, trang sẽ hiện một khung đỏ nhắc bạn, không làm hỏng cả bài.

**Liên kết tới bài khác** nhớ ghi cả tiền tố ngôn ngữ:

```
[bài về BFS](/vi/lessons/10-bfs-va-khoang-cach/)
```

## Thêm bài tập

Mở `content/exercises/mvp.json` hoặc tạo file `.json` mới trong cùng thư mục. Mỗi bài tập có dạng:

```json
{
  "id": "L04-E1",
  "lesson": "04-phep-chia-co-du",
  "topic": "Số học",
  "difficulty": "easy",
  "statement": { "vi": "...", "en": "..." },
  "hint": { "vi": "...", "en": "..." },
  "solution": { "vi": "...", "en": "..." }
}
```

`difficulty` chỉ nhận ba giá trị: `easy`, `medium`, `hard`.

Bài tập tự động xuất hiện ở hai chỗ: cuối trang bài học tương ứng, và trong kho bài tập chung có bộ lọc.

## Lỗi hay gặp

**Trang trắng sau khi sửa.** Thường do quên đóng một thẻ, ví dụ viết `<Note>` mà thiếu `</Note>`. Chạy `npm run build` ở máy sẽ chỉ ra dòng bị lỗi.

**Công thức không hiện.** Kiểm tra xem có đủ cặp dấu đô la không, và trong LaTeX phải viết `\gcd` chứ không phải `gcd`.

**Dấu ngoặc nhọn trong code Python.** MDX hiểu `{` là mã, nên nếu viết ngoài khối code sẽ lỗi. Luôn đặt code trong khối ba dấu backtick.
