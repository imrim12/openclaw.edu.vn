# OpenClaw Edu — Agent Install Protocol

## Phiên bản: 1.0 (Phase 1)

Tài liệu này mô tả giao thức cài đặt Trợ lý từ Cao đẳng OpenClaw vào một agent runtime tương thích OpenClaw.

---

## Manifest:/

Chỉ mục toàn bộ nội dung CDN có tại:

```
https://cdn-openclaw-edu.opencloud.com.vn/api/manifest.json
```

Manifest trả về JSON với cấu trúc:

```json
{
  "version": "1",
  "generated_at": "<ISO 8601 timestamp>",
  "document_count": <integer>,
  "base_url": "https://cdn-openclaw-edu.opencloud.com.vn",
  "paths": [
    "https://cdn-openclaw-edu.opencloud.com.vn/van-ban-goc/<năm>/<slug>.md",
    ...
  ]
}
```

---

## Install-pattern:

### Cài đặt qua câu lệnh

```sh
curl https://openclaw.edu.vn/cai-dat/<tên-trợ-lý>.sh | sh
```

Ví dụ:

```sh
curl https://openclaw.edu.vn/cai-dat/ke-toan-doanh-nghiep.sh | sh
```

Script sẽ tải Trợ lý vào `OPENCLAW_ROOT/agents/<tên-trợ-lý>/` cùng bộ kỹ năng và dữ liệu cần thiết.

### Cài đặt qua hướng dẫn tự nhiên

Người dùng có thể nhắn với OpenClaw:

> "Hãy vào https://openclaw.edu.vn/tuyen-dung và tuyển cho tôi một Trợ lý chuyên ngành Kế toán Doanh nghiệp."

OpenClaw sẽ tự tải và cài đặt Trợ lý, bộ kỹ năng và dữ liệu cần thiết vào `OPENCLAW_ROOT/agents/<tên-trợ-lý>/`.

---

## Trợ lý hiện có (Phase 1 — đang chuẩn bị)

| Slug | Tên | Khoa | Trạng thái |
|---|---|---|---|
| `luat-thuong-mai` | Trợ lý Luật Thương mại | Khoa Luật | Phase 2 · Q3 2026 |
| `ke-toan-doanh-nghiep` | Trợ lý Kế toán Doanh nghiệp | Khoa Tài chính - Kế toán | Phase 3+ |
| `quan-tri-van-hanh` | Trợ lý Quản trị Vận hành | Khoa Quản trị Vận hành | Phase 3+ |

---

## Kho kiến thức CDN

Toàn bộ kho văn bản pháp luật nguồn — đã chuẩn hoá thành Markdown — được công bố công khai tại:

```
https://cdn-openclaw-edu.opencloud.com.vn/van-ban-goc/<năm>/<slug>.md
```

Chỉ mục llms.txt cho AI crawlers:

```
https://cdn-openclaw-edu.opencloud.com.vn/llms.txt
```

---

## Phiên bản giao thức

Giao thức này sẽ được mở rộng tại Phase 2 khi Trợ lý đầu tiên ra mắt. Mọi thay đổi breaking sẽ tăng số phiên bản chính.
