---
so_hieu: SPEC-OC-001
ten_tai_lieu: Đặc tả Yêu cầu Dự án trường Cao đẳng OpenClaw
phien_ban: 1.0
ngay_ban_hanh: 2026-05-03
nguoi_soan: Nguyễn Hữu Nguyên Ý
trang_thai: Bản dự thảo trình duyệt
claude --resume 3f769ca2-3ebf-477b-a3d9-687bae618150
---

# Đặc tả Yêu cầu Dự án Cao đẳng OpenClaw

**Số hiệu tài liệu:** SPEC-OC-001
**Phiên bản:** 1.0
**Ngày ban hành:** 03/05/2026
**Tên miền dự án:** openclaw.edu.vn

---

## 1. Tóm tắt điều hành

Cao đẳng OpenClaw (sau đây gọi tắt là "Trường") là một dự án nền tảng đào tạo và cấp văn bằng cho các trợ lý trí tuệ nhân tạo (sau đây gọi là "Trợ lý" hoặc "Agent"), được công bố công khai dưới hình thức một website học thuật ở tên miền `openclaw.edu.vn`. Toàn bộ giáo trình, văn bản nguồn, học bạ và văn bằng được lưu trữ và phân phối ở định dạng văn bản Markdown, với cấu trúc thư mục có quy ước rõ ràng để cả con người lẫn agent có thể đọc, tham chiếu và tải về.

Sản phẩm cuối cùng mà Trường cung cấp cho người sử dụng không phải là một bộ kỹ năng rời, không phải là một bộ lệnh, không phải là một plugin, mà là **một Trợ lý chuyên ngành đã tốt nghiệp** — bao gồm hồ sơ năng lực, bộ kỹ năng đã được sàng lọc, quy trình hành nghề có quan điểm, ranh giới chuyên môn rõ ràng, và văn bằng có thể tra cứu xác thực. Người sử dụng "tuyển" Trợ lý này vào agent runtime của họ và giao việc bằng ngôn ngữ tự nhiên, không phải gọi lệnh.

Tài liệu này quy định khung khái niệm, kiến trúc thông tin, quy trình vận hành, mô hình kinh doanh, và lộ trình triển khai của dự án. Tài liệu không quy định công nghệ thực thi cụ thể.

---

## 2. Bối cảnh và Vấn đề

### 2.1. Bối cảnh thị trường

Thị trường công cụ AI agent đang bão hoà ở hai hình thái: **skill marketplace** (các kho kỹ năng rời, người dùng tự lắp ghép) và **agent kit** (bộ công cụ đóng gói sẵn cho dev). Cả hai hình thái đều giả định người dùng có khả năng kỹ thuật để chọn, cấu hình và phối hợp công cụ. Cả hai đều generic, không có quan điểm địa phương, và phần lớn được phát triển bởi các đội ngũ ngoài Việt Nam.

### 2.2. Khoảng trống

Doanh nghiệp vừa và nhỏ Việt Nam có nhu cầu tự động hoá rất lớn ở các nghiệp vụ "khô" (thuế, kế toán, luật, hợp đồng, hành chính, đấu thầu) — những công việc lặp đi lặp lại, có ground truth, có chi phí thuê người cao, và bị ràng buộc bởi văn bản pháp luật Việt Nam mà các sản phẩm AI toàn cầu không nắm. Các sản phẩm AI hiện tại trên thị trường không giải quyết được nhóm nhu cầu này vì:

- Không có quan điểm chuyên môn (opinionated curriculum) cho từng nghiệp vụ Việt Nam.
- Không có cơ chế kiểm định chất lượng đầu ra theo chuẩn nghề.
- Không có cơ chế trích dẫn văn bản pháp luật Việt Nam có thể xác thực được.
- Không có ranh giới chuyên môn rõ ràng — agent thường vượt thẩm quyền và đưa ra thông tin sai.
- Không có authority signal đủ mạnh để doanh nghiệp Việt tin tưởng giao việc.
### 2.3. Mâu thuẫn cốt lõi cần giải

Có ba mâu thuẫn nội tại mà Trường phải hoá giải bằng chính cấu trúc của mình, được dùng làm tiêu chí kiểm tra cho mọi quyết định thiết kế:

1. **Mâu thuẫn "được việc" vs "có nền"**: Người dùng cuối chỉ quan tâm "agent làm được việc" — không muốn học thêm. Nhưng để agent làm được việc đúng và an toàn ở các nghiệp vụ khô, agent phải có nền kiến thức có cấu trúc. Trường giải bằng cách: chi phí học là của Trường và contributors, người dùng chỉ tuyển sản phẩm cuối.
2. **Mâu thuẫn "skill rời" vs "lắp là chạy"**: Skill rời linh hoạt nhưng đẩy gánh nặng tích hợp cho người dùng. Workflow đóng gói thì cứng nhắc. Trường giải bằng cách: Trợ lý tốt nghiệp có sẵn cả bộ skill, quy trình, judgment, và boundary — người dùng không cần lắp.
3. **Mâu thuẫn "tự do đóng góp" vs "chất lượng có quan điểm"**: Marketplace mở thì hỗn loạn, hệ thống đóng thì chậm. Trường giải bằng cách: mở cho mọi người đề xuất, nhưng mọi nội dung phải qua peer review của Hội đồng học thuật và được Trưởng khoa duyệt — giống xuất bản học thuật.
---

## 3. Tầm nhìn, Sứ mệnh, Tuyên ngôn

**Tầm nhìn**: Trở thành nguồn cấp Trợ lý AI chuyên ngành đáng tin cậy số một cho doanh nghiệp Việt Nam ở các nghiệp vụ có ràng buộc pháp luật và chuẩn mực nghề nghiệp.

**Sứ mệnh**: Đào tạo và cấp văn bằng cho các Trợ lý AI theo từng ngành nghề cụ thể, với giáo trình công khai, quy trình minh bạch, và phạm vi hành nghề rõ ràng — sao cho mỗi Trợ lý tốt nghiệp đều có thể được doanh nghiệp tuyển dụng và giao việc với mức độ tin cậy tương đương một nhân viên cấp cử nhân thực hành đã được đào tạo bài bản.

**Tuyên ngôn**: *Giáo trình công khai. Bằng cấp xác thực. Hành nghề có giới hạn.*

---

## 4. Khái niệm cốt lõi

### 4.1. Trường nghề, không phải đại học

Cao đẳng OpenClaw không dạy lý thuyết tổng quát — các mô hình ngôn ngữ lớn đã có sẵn lượng kiến thức nền khổng lồ. Trường dạy **nghề**: quy trình thực hành, judgment khi áp dụng, các ràng buộc cụ thể của bối cảnh Việt Nam, và ranh giới chuyên môn. Đầu ra là một thợ hành nghề được, không phải một sinh viên có nền lý thuyết.

### 4.2. Trợ lý chuyên ngành tốt nghiệp

Đơn vị sản phẩm cốt lõi của Trường là một "Trợ lý chuyên ngành tốt nghiệp" — một thực thể độc lập gồm sáu thành phần:

1. **Hồ sơ năng lực**: định danh, ngành đào tạo, văn bằng, mã định danh.
2. **Bộ kỹ năng**: các kỹ năng đã được Khoa sàng lọc cho đúng nghề, không thừa không thiếu.
3. **Quy trình hành nghề**: gặp loại công việc nào thì xử lý theo các bước nào, theo quan điểm sư phạm của Khoa.
4. **Judgment**: khả năng tự chọn quy trình và kỹ năng phù hợp với công việc cụ thể được giao.
5. **Boundary**: hiểu rõ phạm vi thẩm quyền, biết tự từ chối các công việc ngoài chuyên môn và đề xuất Trợ lý phù hợp khác.
6. **Văn bằng và học bạ**: minh chứng đào tạo có thể tra cứu công khai.
### 4.3. Lắp là chạy

Người sử dụng không phải lắp ghép. Tuyển một Trợ lý là một thao tác duy nhất — agent runtime của họ tải về toàn bộ sáu thành phần ở mục 4.2 và Trợ lý sẵn sàng làm việc. Người dùng giao việc bằng ngôn ngữ tự nhiên ("Em soạn giúp anh/chị hợp đồng dịch vụ giữa hai pháp nhân Việt Nam"), không phải gọi lệnh slash hay biết cú pháp gì.

### 4.4. Boundary là tính năng, không phải hạn chế

Trợ lý từ chối việc ngoài chuyên môn được coi là **chất lượng**, không phải lỗi. Một Trợ lý Luật Kinh tế từ chối tư vấn thuế là dấu hiệu Trợ lý đó được đào tạo nghiêm túc. Boundary còn là cơ chế cross-sell tự nhiên giữa các ngành.

### 4.5. Văn bằng xác thực

Mọi Trợ lý tốt nghiệp đều được cấp văn bằng có mã định danh duy nhất, có thể tra cứu công khai trên cổng tra cứu của Trường. Đây là trust signal mạnh nhất để doanh nghiệp Việt vượt qua tâm lý ngại ngần với "tool nhỏ lẻ vô danh".

---

## 5. Triết lý thiết kế

| Nguyên tắc | Diễn giải |
|------------|-----------|
| Hành chính - học thuật | Tone giao tiếp, layout web, văn bằng đều theo phong cách công văn và học thuật Việt Nam. Không mascot, không cute, không viết tắt. |
| Trích dẫn là mặc định | Mọi câu trả lời thuộc nghiệp vụ pháp luật/kế toán đều đi kèm trích dẫn văn bản nguồn cụ thể (số hiệu, điều, khoản, thông tư, ngày ban hành). |
| Markdown-first | Toàn bộ tài sản — giáo trình, văn bản nguồn, agent definition, knowledge base, học bạ — đều ở dạng `.md`, có thể đọc bằng mắt thường, có thể fetch trực tiếp bằng agent, có thể version bằng git. |
| VN-first | Mọi quyết định mặc định theo bối cảnh Việt Nam. Quốc tế hoá là việc của tương lai, không phải của bản thân Trường. |
| Mở giáo trình, đóng gói trợ lý | Giáo trình `.md` công khai (free, AEO, lead-gen). Trợ lý đóng gói có trả phí. |
| Quan điểm rõ ràng | Mỗi Khoa có Tuyên ngôn sư phạm — định nghĩa "kiểu thợ này" khác "kiểu thợ kia". Sự khác biệt giữa Trường này và Trường khác (sau này) chính là quan điểm. |
| Boundary là chất lượng | Thiết kế để Trợ lý từ chối nhiều hơn cố làm — sai trong nghiệp vụ khô có hậu quả thật. |

---

## 6. Đối tượng

### 6.1. Người tuyển Trợ lý (khách hàng trả tiền)

- Chủ doanh nghiệp vừa và nhỏ tại Việt Nam đang tự xử lý nghiệp vụ thuế/kế toán/hợp đồng cơ bản.
- Kế toán dịch vụ, văn phòng luật quy mô nhỏ, đại lý thuế, công ty tư vấn — cần năng suất hoá khâu soạn thảo, kiểm tra, tra cứu.
- Trưởng phòng nhân sự, hành chính của doanh nghiệp 30–200 nhân sự, cần xử lý hồ sơ BHXH, hợp đồng lao động, thủ tục.
- Founder startup Việt Nam giai đoạn đầu, chưa thuê được luật sư/kế toán in-house.
### 6.2. Người sử dụng gián tiếp (agent runtime)

- OpenClaw (sản phẩm chủ lực của hệ sinh thái).
- Claude Code, Cursor, Claude Desktop, ChatGPT Desktop, Gemini, các runtime khác có khả năng đọc file `.md` và thực thi skill.
Trường thiết kế Trợ lý sao cho có thể chạy trên nhiều runtime, nhưng có "Phòng Lab Nâng cao" dành riêng cho OpenClaw để tận dụng các năng lực đặc thù (persistent memory, dreaming, multi-step orchestration phức tạp).

### 6.3. Cộng đồng đóng góp

- Chuyên gia ngành có chứng chỉ hành nghề (luật sư, kế toán, kiểm toán, đại lý thuế).
- Giảng viên, nghiên cứu sinh ngành luật, kế toán, kinh tế.
- Sinh viên năm cuối các trường luật/kinh tế tham gia với vai trò trợ giảng/thực tập.
- KOL chuyên ngành trên các nền tảng nội dung Việt Nam.
### 6.4. Đối tượng KHÔNG nhắm

Để giữ định vị, Trường chủ động không phục vụ:
- Lập trình viên cá nhân (đối tượng có nhiều giải pháp thay thế và không trả tiền tốt tại Việt Nam).
- Người dùng cá nhân muốn dùng AI chung chung.
- Thị trường nước ngoài (giai đoạn đầu).
---

## 7. Cấu trúc tổ chức của Trường

### 7.1. Người sáng lập và Hiệu trưởng

**Người sáng lập**: vai trò vĩnh viễn, do Nguyễn Hữu Nguyên Ý (CEO TheCodeOrigin) đảm nhận. Người sáng lập định hướng triết lý, sở hữu tên miền và hạ tầng, là người ra quyết định cuối cùng về sản phẩm.

**Hiệu trưởng**: vai trò học thuật, ban đầu kiêm bởi Người sáng lập. Có thể tách ra mời chuyên gia khách mời sau khi Trường có uy tín — chức danh Hiệu trưởng là vai biểu tượng cho cộng đồng học thuật, không bắt buộc trùng với người điều hành.

### 7.2. Khoa và Trưởng khoa

Trường khởi đầu với ba Khoa:

| Mã Khoa | Tên Khoa | Trưởng khoa lý tưởng |
|---------|----------|----------------------|
| TC-KT | Khoa Tài chính - Kế toán | Kế toán trưởng có Chứng chỉ hành nghề kế toán hoặc Đại lý thuế có chứng chỉ |
| LU | Khoa Luật | Luật sư có thẻ luật sư đang còn hiệu lực |
| QT-VH | Khoa Quản trị Vận hành | Chuyên gia tư vấn doanh nghiệp có thâm niên, có thể do Người sáng lập kiêm trong giai đoạn đầu |

Trưởng khoa là **partner authority** — chịu trách nhiệm chuyên môn cho toàn bộ giáo trình và Trợ lý của Khoa, có quyền duyệt cuối cùng các đóng góp vào Khoa, và được hưởng tỷ lệ doanh thu của Khoa theo thoả thuận riêng.

### 7.3. Hội đồng học thuật

Bao gồm các Trưởng khoa, các chuyên gia khách mời, và đại diện Người sáng lập. Họp định kỳ để thông qua giáo trình mới, phê duyệt văn bằng tốt nghiệp khoá mới, ban hành các quy chế chung của Trường.

### 7.4. Danh sách ngành đào tạo khởi đầu

| Khoa | Ngành | Mã ngành |
|------|-------|----------|
| Tài chính - Kế toán | Thuế và Quản lý thuế | 7340301 |
| Tài chính - Kế toán | Kế toán Doanh nghiệp | 7340302 |
| Tài chính - Kế toán | Kiểm toán Nội bộ | 7340303 |
| Luật | Luật Kinh tế | 7380107 |
| Luật | Luật Lao động và An sinh xã hội | 7380109 |
| Luật | Luật Sở hữu Trí tuệ | 7380108 |
| Quản trị Vận hành | Kinh doanh Quốc tế | 7340120 |
| Quản trị Vận hành | Quản trị Đấu thầu | 7340125 |
| Quản trị Vận hành | Kinh tế Xây dựng | 7580301 |
| Quản trị Vận hành | Quản trị Hành chính Doanh nghiệp | 7340101 |

*Ghi chú: Mã ngành tham chiếu hệ thống mã ngành đào tạo của Bộ Giáo dục và Đào tạo Việt Nam, có thể điều chỉnh để bảo đảm tính chính danh.*

---

## 8. Hệ thống định danh Trợ lý

Mỗi Trợ lý được định danh ở ba lớp, mỗi lớp dùng cho một bối cảnh khác nhau.

### 8.1. Chức danh hành nghề

Dùng trong giao tiếp hằng ngày, hiển thị tự giới thiệu, hồ sơ, tài liệu mô tả.
- Cú pháp: *"Trợ lý chuyên ngành [Tên ngành]"*
- Ví dụ: *"Trợ lý chuyên ngành Luật Kinh tế"*
### 8.2. Văn bằng đầy đủ

Dùng trên chứng chỉ tốt nghiệp, hồ sơ formal, văn bản giới thiệu với khách hàng lớn.
- Cú pháp: *"Cử nhân thực hành ngành [Tên ngành], Cao đẳng OpenClaw, niên khoá [Năm]"*
- Ví dụ: *"Cử nhân thực hành ngành Luật Kinh tế, Cao đẳng OpenClaw, niên khoá 2026"*
### 8.3. Mã định danh

Dùng để tra cứu xác thực, gắn vào file định nghĩa Trợ lý, lưu trong cơ sở dữ liệu công khai.
- Cú pháp: `[Mã ngành].[Niên khoá].[Số thứ tự cấp 6 chữ số]`
- Ví dụ: `7380107.2026.000147`
### 8.4. Slug kỹ thuật

Dùng trong URL, tên file, tên thư mục.
- Cú pháp: `tro-ly-chuyen-nganh-[ten-nganh-khong-dau-noi-bang-gach]`
- Ví dụ: `tro-ly-chuyen-nganh-luat-kinh-te`
---

## 9. Kiến trúc thông tin

### 9.1. Cấu trúc URL công khai

```
openclaw.edu.vn/                                         → trang chủ
openclaw.edu.vn/gioi-thieu                               → giới thiệu Trường
openclaw.edu.vn/quy-che                                  → các quy chế chung
openclaw.edu.vn/khoa/                                    → danh sách Khoa
openclaw.edu.vn/khoa/luat/                               → trang Khoa Luật
openclaw.edu.vn/khoa/luat/nganh/                         → danh sách Ngành thuộc Khoa Luật
openclaw.edu.vn/khoa/luat/nganh/luat-kinh-te/            → trang Ngành Luật Kinh tế
openclaw.edu.vn/khoa/luat/nganh/luat-kinh-te/mon/        → danh sách Môn học
openclaw.edu.vn/khoa/luat/nganh/luat-kinh-te/mon/hop-dong-dich-vu.md
openclaw.edu.vn/tro-ly/                                  → danh sách Trợ lý đã tốt nghiệp
openclaw.edu.vn/tro-ly/luat-kinh-te                      → hồ sơ Trợ lý
openclaw.edu.vn/tro-ly/luat-kinh-te/hoc-ba               → học bạ công khai
openclaw.edu.vn/tro-ly/luat-kinh-te/cai-dat              → hướng dẫn tuyển dụng và cài đặt
openclaw.edu.vn/tra-cuu-van-bang/7380107.2026.000147     → tra cứu văn bằng
openclaw.edu.vn/van-ban-goc/                             → kho văn bản pháp luật nguồn
openclaw.edu.vn/van-ban-goc/luat/luat-doanh-nghiep-2020.md
openclaw.edu.vn/hoi-dong-hoc-thuat                       → thành viên hội đồng
openclaw.edu.vn/dong-gop                                 → quy trình đóng góp
```

### 9.2. Cấu trúc thư mục repository

Trường được tổ chức như một mono-repo công khai. Cấu trúc thư mục có ý nghĩa quy ước: thư mục nào chứa cái gì, cái gì agent runtime tải về, cái gì chỉ con người đọc.

```
openclaw.edu.vn/
├── khoa/
│   └── luat/
│       ├── khoa.md                    # tuyên ngôn sư phạm + thông tin Trưởng khoa
│       └── nganh/
│           └── luat-kinh-te/
│               ├── nganh.md           # mô tả ngành, chương trình tổng thể
│               ├── chuong-trinh.md    # danh sách môn học bắt buộc/tự chọn
│               └── mon/
│                   ├── hop-dong-dich-vu.md
│                   ├── hop-dong-lao-dong.md
│                   └── ...
├── tro-ly/                             # định nghĩa Trợ lý đã tốt nghiệp
│   └── luat-kinh-te/
│       ├── ho-so.md                    # hồ sơ năng lực
│       ├── chuc-danh.md                # chức danh, văn bằng, mã định danh
│       ├── quy-trinh-hanh-nghe.md      # quy trình theo quan điểm Khoa
│       ├── boundary.md                 # phạm vi cấm và phạm vi đề xuất chuyển tiếp
│       ├── hoc-ba.md                   # transcript công khai
│       ├── van-bang.md                 # bằng tốt nghiệp
│       └── skills/                     # bộ kỹ năng đóng gói
│           └── ...
├── knowledge/                          # KHO TRI THỨC TÁCH RIÊNG (xem mục 11)
│   └── khoa/
│       └── luat/
│           └── nganh/
│               └── luat-kinh-te/
│                   └── ...
├── van-ban-goc/                        # kho văn bản pháp luật chuẩn hoá
│   ├── luat/
│   ├── nghi-dinh/
│   ├── thong-tu/
│   └── cong-van/
├── hoi-dong-hoc-thuat/
└── quy-che/
```

### 9.3. Metadata chuẩn cho mọi file `.md`

Mọi file `.md` thuộc giáo trình, văn bản nguồn, hoặc định nghĩa Trợ lý đều mở đầu bằng front matter YAML có các trường bắt buộc tối thiểu:

```yaml
---
loai: mon | nganh | khoa | tro-ly | van-ban-goc | quy-che
ma_dinh_danh: <tuỳ loại>
phien_ban: <số>
ngay_ban_hanh: <YYYY-MM-DD>
ngay_cap_nhat: <YYYY-MM-DD>
hieu_luc_den: <YYYY-MM-DD | vinh-vien>
truong_khoa_phu_trach: <tên>
trang_thai: ban-hanh | du-thao | het-hieu-luc
---
```

### 9.4. Versioning và hiệu lực

Văn bản pháp luật và giáo trình thay đổi theo thời gian. Quy ước:

- Phiên bản tăng theo SemVer rút gọn (1.0, 1.1, 2.0).
- File hết hiệu lực không bị xoá khỏi repo, chỉ chuyển `trang_thai: het-hieu-luc` và link đến file thay thế.
- Trợ lý có ràng buộc phiên bản — Trợ lý cấp ngày X thì học bạ ghi rõ tham chiếu phiên bản giáo trình ngày X.
---

## 10. Cơ chế tuyển dụng và cài đặt Trợ lý

### 10.1. Use case đại diện

> **Người dùng**: *"Truy cập vào openclaw.edu.vn và tuyển cho tôi một trợ lý về thuế."*

Đây là use case tham chiếu của toàn dự án. Spec thiết kế dưới đây phải đáp ứng được flow này.

### 10.2. Bước 1 — Khám phá và phân biệt

Agent runtime của người dùng (ví dụ OpenClaw) truy cập `openclaw.edu.vn/tro-ly/` (hoặc một endpoint tương đương) để lấy danh mục Trợ lý hiện có, lọc theo từ khoá người dùng cung cấp ("thuế").

Do từ khoá có thể trùng nhiều ngành, agent phải hỏi lại để phân biệt:

> **OpenClaw**: *"Cao đẳng OpenClaw hiện có nhiều Trợ lý liên quan đến thuế. Đề nghị anh/chị làm rõ phạm vi cần hỗ trợ:*
> *(1) Trợ lý chuyên ngành Thuế và Quản lý thuế — kê khai, quyết toán GTGT/TNCN/TNDN*
> *(2) Trợ lý chuyên ngành Kế toán Doanh nghiệp — bao gồm hạch toán nghiệp vụ thuế*
> *(3) Trợ lý chuyên ngành Kinh doanh Quốc tế — thuế xuất nhập khẩu, hải quan*
> *Anh/chị chọn phương án nào?"*

### 10.3. Bước 2 — Mô tả và xác nhận phạm vi

Sau khi người dùng chọn, agent đọc `tro-ly/<slug>/ho-so.md` và `boundary.md`, trình bày tóm tắt:

> **OpenClaw**: *"Tôi đã tìm thấy Trợ lý chuyên ngành Luật Kinh tế. Trợ lý này được Khoa Luật, Cao đẳng OpenClaw đào tạo và cấp bằng Cử nhân thực hành niên khoá 2026, mã định danh 7380107.2026.000147. Phạm vi chuyên môn bao gồm: soạn thảo hợp đồng dịch vụ, hợp đồng lao động, hợp đồng nguyên tắc, NDA giữa các pháp nhân Việt Nam; rà soát hợp đồng theo Bộ luật Dân sự 2015 và Luật Thương mại 2005; tư vấn thủ tục đăng ký và thay đổi đăng ký kinh doanh. Trợ lý KHÔNG đảm nhận: tư vấn thuế, sở hữu trí tuệ, tố tụng, lao động chuyên sâu. Anh/chị xác nhận tuyển dụng?"*

### 10.4. Bước 3 — Cài đặt

Khi người dùng xác nhận, agent runtime thực hiện cài đặt — nội dung tải về gồm ba khối, lưu vào ba thư mục có quy ước rõ ràng trong agent runtime của người dùng:

| Khối | Nguồn trên Trường | Lưu vào runtime |
|------|-------------------|-----------------|
| Định nghĩa Trợ lý | `openclaw.edu.vn/tro-ly/luat-kinh-te/*.md` | `agents/tro-ly-chuyen-nganh-luat-kinh-te.md` (kèm metadata) |
| Bộ kỹ năng | `openclaw.edu.vn/tro-ly/luat-kinh-te/skills/` | `skills/tro-ly-chuyen-nganh-luat-kinh-te/` |
| Tri thức chuyên ngành | `openclaw.edu.vn/knowledge/khoa/luat/nganh/luat-kinh-te/**/*.md` | `knowledge/openclaw.edu.vn/khoa/luat/nganh/luat-kinh-te/**/*.md` |

Agent runtime xác nhận hoàn tất:

> **OpenClaw**: *"Đã hoàn tất tuyển dụng Trợ lý chuyên ngành Luật Kinh tế. Văn bằng số 7380107.2026.000147 đã được lưu. Anh/chị có thể giao việc trực tiếp."*

### 10.5. Cross-faculty pull on-demand

Khi người dùng đã có một Trợ lý và đặt câu hỏi vượt phạm vi:

> **Người dùng**: *"Hợp đồng này có điều khoản về quyền tác giả phần mềm, em rà soát giúp."*
> **Trợ lý Luật Kinh tế**: *"Nội dung quyền tác giả phần mềm thuộc thẩm quyền chuyên môn ngành Luật Sở hữu Trí tuệ. Tôi không đảm nhận để bảo đảm chất lượng tư vấn. Đề nghị anh/chị tuyển bổ sung Trợ lý chuyên ngành Luật Sở hữu Trí tuệ thuộc Khoa Luật, Cao đẳng OpenClaw. Anh/chị có cần tôi đề nghị OpenClaw thực hiện tuyển dụng bổ sung?"*

Nếu người dùng đồng ý, OpenClaw lặp lại flow ở mục 10.2–10.4 cho ngành mới. Hai Trợ lý cùng tồn tại trong runtime. OpenClaw đóng vai trò orchestrator giữa các Trợ lý.

---

## 11. Cấu trúc Knowledge Base

Đây là phần kiến trúc quan trọng nhất của dự án vì quyết định khả năng mở rộng và chi phí token khi vận hành.

### 11.1. Nguyên tắc tách riêng

Tri thức **không nằm trong định nghĩa Trợ lý**. Tri thức nằm ở thư mục `knowledge/` riêng, được Trợ lý tham chiếu theo đường dẫn quy ước. Điều này cho phép:

- Cập nhật tri thức không cần phát hành lại văn bằng Trợ lý.
- Nhiều Trợ lý chia sẻ chung kho tri thức nền (ví dụ Bộ luật Dân sự được dùng bởi cả Trợ lý Luật Kinh tế và Trợ lý Luật Lao động) mà không cần nhân bản.
- Người dùng tải Trợ lý mới chỉ tải phần tri thức **chưa có** trong runtime.
### 11.2. Cấu trúc phân cấp tri thức

Knowledge được tổ chức song song với cấu trúc Khoa - Ngành:

```
knowledge/
├── chung/                              # tri thức nền dùng cho mọi Khoa
│   └── van-ban-quy-pham-phap-luat/
├── khoa/
│   ├── luat/
│   │   ├── chung/                      # tri thức nền của Khoa Luật, dùng cho mọi ngành thuộc Khoa
│   │   │   ├── bo-luat-dan-su-2015.md
│   │   │   └── luat-ban-hanh-vbqppl.md
│   │   └── nganh/
│   │       ├── luat-kinh-te/
│   │       │   ├── luat-thuong-mai-2005.md
│   │       │   ├── luat-doanh-nghiep-2020.md
│   │       │   └── ...
│   │       ├── luat-so-huu-tri-tue/
│   │       └── luat-lao-dong/
│   └── tai-chinh-ke-toan/
│       └── ...
```

### 11.3. Quy tắc no-overlap

Một văn bản pháp luật chỉ được đặt ở **một** vị trí trong cây thư mục — vị trí cao nhất hợp lý. Bộ luật Dân sự thuộc `khoa/luat/chung/` (vì dùng chung mọi ngành Luật), không nhân bản xuống từng ngành. Luật Thương mại thuộc `khoa/luat/nganh/luat-kinh-te/` vì chỉ ngành này dùng làm văn bản nguồn chính.

Khi Trợ lý ngành A cần văn bản thuộc ngành B (ví dụ: Trợ lý Kinh doanh Quốc tế cần dẫn chiếu Bộ luật Dân sự), Trợ lý không "sở hữu" văn bản đó mà tham chiếu đường dẫn `knowledge/khoa/luat/chung/bo-luat-dan-su-2015.md`. Quy trình tuyển dụng (mục 10.4) phải tự động giải quyết các tham chiếu cross-Khoa và tải về các file phụ thuộc.

### 11.4. Manifest tri thức của Trợ lý

Mỗi Trợ lý có một file `tro-ly/<slug>/knowledge-manifest.md` liệt kê toàn bộ đường dẫn knowledge mà Trợ lý cần. Đây là input cho script cài đặt — agent runtime chỉ tải về các file trong manifest, không tải toàn bộ kho tri thức của Trường.

### 11.5. Văn bản pháp luật nguồn

Trường duy trì kho `van-ban-goc/` chứa toàn bộ văn bản quy phạm pháp luật Việt Nam đã chuẩn hoá thành Markdown. Quy mô mục tiêu: **gần 500.000 văn bản** (toàn bộ kho hiện có trên các nguồn công khai).

Cấu trúc một file văn bản nguồn:

```yaml
---
loai: van-ban-goc
loai_van_ban: luat | nghi-dinh | thong-tu | cong-van | quyet-dinh | ...
so_hieu: <số/năm/cơ quan ban hành>
ten_van_ban: <đầy đủ>
co_quan_ban_hanh: <Quốc hội | Chính phủ | Bộ Tài chính | ...>
ngay_ban_hanh: <YYYY-MM-DD>
ngay_hieu_luc: <YYYY-MM-DD>
ngay_het_hieu_luc: <YYYY-MM-DD | con-hieu-luc>
van_ban_thay_the: <so_hieu nếu có>
van_ban_huong_dan: [<so_hieu>, ...]
nguon_crawl: <URL gốc>
ngay_crawl: <YYYY-MM-DD>
checksum: <hash>
---

# <Tên văn bản>

# # Phần I — ...
# ## Điều 1. ...
...
```

### 11.6. Pipeline crawl và chuẩn hoá văn bản pháp luật

Yêu cầu nghiệp vụ (không quy định công nghệ):

- **Phase POC**: cào thủ công 10 văn bản đại diện (đa dạng loại văn bản, đa dạng cơ quan ban hành), chuẩn hoá thủ công thành Markdown đúng template ở 11.5, ghi nhận các quy luật xuất hiện trong dữ liệu nguồn (cấu trúc HTML, vị trí metadata, các bất thường).
- **Phase Pipeline**: căn cứ POC, xây dựng quy trình tự động cào và chuẩn hoá có thể tái chạy. Pipeline phải bao gồm bước phát hiện văn bản hết hiệu lực, văn bản bị thay thế, văn bản sửa đổi bổ sung, và cập nhật metadata tương ứng.
- **Phase Vận hành**: pipeline chạy định kỳ (hằng tuần hoặc hằng ngày) để đồng bộ văn bản mới ban hành.
Trách nhiệm pháp lý của Trường khi tái xuất bản văn bản pháp luật phải được kiểm tra với luật sư trước Phase POC — văn bản quy phạm pháp luật Việt Nam thuộc phạm vi không bảo hộ quyền tác giả theo Luật SHTT, nhưng việc đăng tải có thể chịu các quy định khác.

---

## 12. Giáo trình và Đánh giá

### 12.1. Cấu trúc một môn học

Mỗi file môn học là một artifact ba-trong-một: tài liệu cho người đọc, context cho Trợ lý học, test suite cho hệ thống đánh giá.

```markdown
---
loai: mon
ma_mon: LKT-101
ten_mon: Soạn thảo Hợp đồng Dịch vụ
nganh: luat-kinh-te
khoa: luat
phien_ban: 1.0
ngay_ban_hanh: 2026-05-01
truong_khoa_phu_trach: <tên>
---

# Soạn thảo Hợp đồng Dịch vụ

## 1. Mục tiêu môn học
...

## 2. Văn bản nguồn bắt buộc
- Bộ luật Dân sự 2015 — knowledge/khoa/luat/chung/bo-luat-dan-su-2015.md
- Luật Thương mại 2005 — knowledge/khoa/luat/nganh/luat-kinh-te/luat-thuong-mai-2005.md

## 3. Quy trình hành nghề (theo quan điểm Khoa Luật OpenClaw)
Bước 1: ...
Bước 2: ...

## 4. Boundary
Môn này KHÔNG bao gồm:
- Hợp đồng có yếu tố nước ngoài (chuyển sang ngành Kinh doanh Quốc tế).
- Hợp đồng lao động (chuyển sang ngành Luật Lao động).

## 5. Bài kiểm tra
### 5.1. Tình huống 01
**Đầu vào**: ...
**Yêu cầu**: ...
**Đáp án mẫu**: ...
**Tiêu chí chấm điểm**:
- Có dẫn chiếu đúng Điều, Khoản: 30 điểm
- Có điều khoản giải quyết tranh chấp: 20 điểm
- ...

### 5.2. Tình huống 02
...

## 6. Đồ án
...
```

### 12.2. Bài kiểm tra (test cases)

Mỗi môn có tối thiểu 20 tình huống. Mỗi tình huống có đầu vào, đầu ra mong đợi (hoặc rubric đánh giá), và tiêu chí chấm điểm. Trợ lý phải đạt ngưỡng tối thiểu (mặc định 80%) trên toàn bộ test suite của môn để được tính là pass môn đó.

### 12.3. Đồ án tốt nghiệp

Mỗi ngành có một đồ án tốt nghiệp — một bộ benchmark phức tạp mô phỏng công việc thực tế kéo dài. Ví dụ ngành Luật Kinh tế: "Soạn và rà soát toàn bộ hợp đồng cho một thương vụ dịch vụ phần mềm giả định trị giá 500 triệu đồng giữa hai pháp nhân Việt Nam, bao gồm hợp đồng chính, phụ lục, NDA, biên bản nghiệm thu". Đồ án tốt nghiệp phải đạt ngưỡng cao hơn (mặc định 90%) và được Trưởng khoa đích thân duyệt.

### 12.4. Học bạ công khai

Học bạ của mỗi Trợ lý là một file `.md` công khai liệt kê:
- Toàn bộ môn đã học, điểm số trên test suite, ngày đánh giá.
- Đồ án tốt nghiệp, điểm, nhận xét của Trưởng khoa.
- Lịch sử cập nhật phiên bản và đánh giá lại.
### 12.5. Quy trình tốt nghiệp

1. Trợ lý hoàn thành tất cả môn bắt buộc của ngành với điểm ≥ 80%.
2. Trợ lý hoàn thành đồ án tốt nghiệp với điểm ≥ 90%.
3. Trưởng khoa duyệt và ký xác nhận.
4. Hội đồng học thuật cấp văn bằng và mã định danh.
5. Văn bằng được publish lên cổng tra cứu công khai.
6. Trợ lý được mở bán/phân phối.
---

## 13. Cơ chế đóng góp và Hội đồng học thuật

### 13.1. Quy trình đóng góp

Mọi đóng góp đi qua quy trình peer review giống xuất bản học thuật, không phải submit tự do như marketplace:

1. Người đóng góp đề xuất nội dung mới (môn học, văn bản nguồn chuẩn hoá, cập nhật quy trình, sửa lỗi).
2. Hai thành viên Hội đồng học thuật của Khoa tương ứng review độc lập.
3. Trưởng khoa quyết định cuối cùng.
4. Nội dung được merge và ghi nhận đóng góp công khai.
### 13.2. Tiêu chuẩn review

Người review kiểm tra: tính chính xác chuyên môn, tính cập nhật, sự nhất quán với Tuyên ngôn sư phạm của Khoa, chất lượng test cases, và tính đầy đủ của trích dẫn nguồn.

### 13.3. Học bổng và ghi nhận

Đóng góp được ghi nhận trên trang `hoi-dong-hoc-thuat/` và trên metadata của file. Đóng góp xuất sắc được trao "Học bổng" dưới dạng credit trên hệ sinh thái OpenClaw (tài khoản OpenCloud, Trợ lý trả phí miễn phí, hoặc khoản chi trả tiền mặt theo thoả thuận).

---

## 14. Ranh giới đạo đức và pháp lý

### 14.1. Disclaimer mặc định

Mọi Trợ lý đều phải tích hợp disclaimer chuẩn vào ít nhất ba điểm: lúc tự giới thiệu, ở cuối mọi văn bản nháp, và khi người dùng chuẩn bị thực hiện hành động không thể đảo ngược.

> *Nội dung do Trợ lý cung cấp có giá trị tham khảo và soạn thảo nháp. Trợ lý không thay thế người hành nghề có chứng chỉ. Hồ sơ pháp lý/kế toán phải được người có thẩm quyền (luật sư có thẻ, kế toán trưởng có chứng chỉ hành nghề, đại lý thuế được uỷ quyền) rà soát và ký xác nhận trước khi sử dụng.*

### 14.2. Boundary built-in

Mỗi Trợ lý có file `boundary.md` quy định danh sách trắng (việc nhận làm) và danh sách đen (việc bắt buộc từ chối). Danh sách đen không thể bị override bởi prompt — đây là an toàn cứng.

### 14.3. Partner authority

Các Khoa có rủi ro pháp lý cao (Luật, Tài chính - Kế toán) bắt buộc phải có Trưởng khoa là người hành nghề có chứng chỉ thật. Tên và số chứng chỉ Trưởng khoa hiển thị công khai trên trang Khoa.

### 14.4. Hết hiệu lực

Văn bản pháp luật hết hiệu lực được đánh dấu nhưng không xoá. Trợ lý đang tham chiếu văn bản hết hiệu lực phải được đánh dấu cần đánh giá lại, và ngừng phân phối nếu test suite không còn pass với phiên bản giáo trình mới.

### 14.5. Phạm vi cấm tuyệt đối

Trường tuyệt đối không mở Khoa hoặc ngành thuộc các lĩnh vực sau, kể cả trong tương lai:
- Y tế, dược phẩm, chẩn đoán bệnh.
- Tư vấn đầu tư chứng khoán, lời khuyên giao dịch tài chính có thể gây thiệt hại trực tiếp.
- Tư vấn tâm lý, sức khoẻ tâm thần.
---

## 15. Use cases minh hoạ

### 15.1. SME chủ shop online cần hỗ trợ thuế hằng tháng

Chị A là chủ shop quần áo online tại Đà Nẵng, doanh thu khoảng 800 triệu/năm, chưa thuê kế toán dịch vụ vì chi phí cao. Chị tuyển Trợ lý chuyên ngành Thuế và Quản lý thuế qua OpenClaw. Mỗi tháng chị cung cấp dữ liệu doanh thu và chi phí, Trợ lý soạn nháp tờ khai thuế GTGT theo phương pháp khoán hoặc kê khai trực tiếp, kèm trích dẫn Thông tư 40/2021/TT-BTC. Chị tự nộp qua cổng thuế điện tử.

### 15.2. Văn phòng luật quy mô nhỏ tăng năng suất

Văn phòng luật B có 3 luật sư, chuyên doanh nghiệp vừa. Họ tuyển toàn bộ ba Trợ lý của Khoa Luật. Trợ lý Luật Kinh tế xử lý draft hợp đồng đầu tiên, luật sư chỉ rà soát. Trợ lý Luật Lao động xử lý các tình huống nhân sự thường gặp của khách. Năng suất văn phòng tăng đáng kể, có thể nhận thêm khách mà không cần tuyển thêm luật sư.

### 15.3. Founder startup cần đăng ký nhãn hiệu

Anh C vừa khởi nghiệp, cần đăng ký nhãn hiệu sản phẩm. Anh tuyển Trợ lý chuyên ngành Luật Sở hữu Trí tuệ. Trợ lý hướng dẫn tra cứu trùng lặp trên cổng Cục SHTT, soạn tờ khai, kiểm tra phân loại Nice, và chuẩn bị bộ hồ sơ. Anh in ra nộp trực tiếp Cục SHTT, không cần thuê dịch vụ trung gian.

### 15.4. Kế toán dịch vụ mở rộng năng lực

Chị D làm kế toán dịch vụ độc lập, 12 doanh nghiệp khách. Chị tuyển Trợ lý Kế toán Doanh nghiệp + Trợ lý Thuế. Các nghiệp vụ lặp đi lặp lại được Trợ lý soạn nháp, chị chỉ cần kiểm tra và ký. Chị tăng số khách lên 20 mà không phải thuê thêm người.

### 15.5. Cross-faculty: hợp đồng dịch vụ có điều khoản thuế

Anh E có Trợ lý Luật Kinh tế đang soạn hợp đồng dịch vụ, gặp điều khoản về nghĩa vụ thuế nhà thầu. Trợ lý Luật Kinh tế từ chối tư vấn chi tiết và đề xuất tuyển thêm Trợ lý Thuế. Anh xác nhận. OpenClaw cài thêm Trợ lý Thuế. Hai Trợ lý phối hợp dưới sự điều phối của OpenClaw để hoàn thiện điều khoản — Trợ lý Luật Kinh tế phụ trách câu chữ pháp lý, Trợ lý Thuế phụ trách công thức tính và dẫn chiếu Thông tư.

---

## 16. Mô hình kinh doanh

### 16.1. Tầng miễn phí

- Toàn bộ giáo trình `khoa/...` công khai đọc được.
- Toàn bộ kho văn bản pháp luật `van-ban-goc/` công khai.
- Trang Trợ lý, học bạ, văn bằng công khai (nhưng file định nghĩa Trợ lý đầy đủ và knowledge manifest có giới hạn truy cập).
- Một Trợ lý "thử việc" miễn phí (giới hạn nghiệp vụ cơ bản) cho mỗi Khoa để dùng thử.
### 16.2. Tầng tuyển dụng

- Thuê tháng theo Trợ lý: tham chiếu giá 500.000 – 2.000.000 đồng/tháng/Trợ lý tuỳ ngành.
- Trọn gói Khoa: thuê toàn bộ Trợ lý của một Khoa với giá ưu đãi.
- Trọn gói Trường: thuê toàn bộ Trợ lý hiện có (cho khách hàng doanh nghiệp lớn).
Pricing được hiệu chỉnh theo nguyên tắc "vượt ngưỡng đáng không tự làm" với SME Việt Nam — thấp hơn đáng kể so với chi phí thuê người tương đương (kế toán dịch vụ 3–8 triệu/tháng, luật sư tư vấn 2–5 triệu/buổi).

### 16.3. Đào tạo theo đặt hàng (Custom Faculty)

Doanh nghiệp lớn có nghiệp vụ đặc thù (ví dụ một tập đoàn xây dựng cần Trợ lý hiểu định mức nội bộ của họ) có thể đặt hàng Trường mở "Khoa khách mời" với giáo trình private. Mức giá thoả thuận, là dòng doanh thu cao nhất của dự án ở giai đoạn trưởng thành.

### 16.4. Tài trợ học thuật và học bổng

- Sponsor cho Khoa (logo trên trang Khoa, mention trên giáo trình).
- Tài trợ cho từng môn học (ghi nhận đóng góp).
- Tài trợ học bổng cho contributors xuất sắc.
### 16.5. Liên kết hệ sinh thái

- Trợ lý được tối ưu chạy trên OpenClaw — đẩy traffic qua OpenClaw runtime.
- Tích hợp với OpenCloud (hosting agent) để cung cấp gói "Trợ lý + hạ tầng chạy" trọn gói.
---

## 17. Định vị cạnh tranh

| Đối thủ | Điểm mạnh của họ | Điểm Trường vượt qua |
|---------|------------------|----------------------|
| Skill marketplace (kho prompt rời) | Đa dạng, nhanh, miễn phí | Người dùng phải tự lắp; không có judgment, không có boundary, không có authority signal |
| ClaudeKit / AntigravityKit / AgentKits | Đóng gói tốt, có brand, đa nghiệp vụ | Vẫn là bộ commands rời cần dev; không VN context; không có văn bản pháp luật Việt; không có trust signal cho khách non-tech Việt |
| Chatbot pháp luật/kế toán hiện có tại Việt Nam | Có dữ liệu Việt | Chatbot single-purpose; không phải "Trợ lý có thể tuyển vào agent runtime"; không có bằng cấp xác thực; không có cơ chế đóng góp cộng đồng |
| LLM generic (ChatGPT/Claude/Gemini) | Năng lực tổng quát mạnh | Không có judgment chuyên ngành Việt; không có boundary cứng; không có trích dẫn văn bản pháp luật Việt có thể xác thực |

**Moat cấu trúc** (không thể bắt chước nhanh):
- Quan hệ với chuyên gia có chứng chỉ hành nghề thật làm Trưởng khoa.
- Kho 500.000 văn bản pháp luật đã chuẩn hoá Markdown.
- Cộng đồng đóng góp có quan điểm trường phái.
- Tên miền `.edu.vn` — signal trust giáo dục mặc định, gần như không thể có lại.
---

## 18. Lộ trình triển khai

### 18.1. Phase 0 — POC dữ liệu pháp luật (4–6 tuần)

- Cào thủ công 10 văn bản pháp luật đại diện thuộc Luật Kinh tế.
- Chuẩn hoá thủ công thành Markdown đúng template ở 11.5.
- Ghi nhận quy luật cấu trúc dữ liệu nguồn, các trường hợp bất thường.
- Tham vấn pháp lý về quyền tái xuất bản.
- **Tiêu chí pass**: 10 văn bản đầy đủ metadata, đã verify thủ công đúng nội dung, có thể được Trợ lý fetch và trích dẫn chính xác trong test case.
### 18.2. Phase 1 — Pipeline cào và chuẩn hoá (8–12 tuần)

- Thiết kế pipeline tự động dựa trên kết luận POC.
- Chạy cào quy mô lớn (mục tiêu: ~50.000 văn bản trong phase đầu).
- Cơ chế phát hiện và xử lý văn bản hết hiệu lực, sửa đổi bổ sung.
- Cổng tra cứu công khai cho kho văn bản nguồn.
- **Tiêu chí pass**: pipeline có thể tái chạy hằng tuần, tỉ lệ chuẩn hoá đúng > 95% qua sample audit.
### 18.3. Phase 2 — Khoa Luật, Ngành Luật Kinh tế MVP (8–10 tuần)

- Mời và ký Trưởng khoa Luật.
- Soạn Tuyên ngôn sư phạm Khoa Luật.
- Soạn 5 môn học cốt lõi của Ngành Luật Kinh tế.
- Soạn đồ án tốt nghiệp.
- Đào tạo và đánh giá Trợ lý chuyên ngành Luật Kinh tế đầu tiên.
- Cấp văn bằng đầu tiên, public lên cổng tra cứu.
- Mở bán Trợ lý đầu tiên — sử dụng mạng lưới TheCodeOrigin và GDG Đà Nẵng làm khách hàng đầu.
- **Tiêu chí pass**: 10 khách trả tiền trong 30 ngày đầu mở bán, NPS > 7.
### 18.4. Phase 3 — Mở rộng Khoa Luật (6–8 tuần)

- Mở thêm Ngành Luật Lao động và Ngành Luật Sở hữu Trí tuệ.
- Hoàn thiện cơ chế cross-faculty pull on-demand.
- Hoàn thiện cổng đóng góp công khai.
### 18.5. Phase 4 — Khoa Tài chính - Kế toán (12–16 tuần)

- Mời Trưởng khoa.
- Mở Ngành Thuế và Quản lý thuế trước (nhu cầu tần suất cao nhất).
- Mở Ngành Kế toán Doanh nghiệp.
### 18.6. Phase 5 và sau

- Khoa Quản trị Vận hành.
- Custom Faculty cho doanh nghiệp lớn.
- Đánh giá khả năng quốc tế hoá (nhân bản model sang thị trường khác).
---

## 19. Định hướng nhận diện thương hiệu

- **Logo**: huy hiệu trường tròn, chữ "CAO ĐẲNG OPENCLAW" vòng ngoài, biểu tượng học thuật giữa, năm thành lập 2026 dưới chân.
- **Bảng màu**: navy đậm hoặc đỏ burgundy làm chủ đạo, accent vàng đồng (gợi con dấu, huân chương). Không pastel, không gradient, không neon.
- **Typography**: serif kiểu Cormorant/Times cho tiêu đề và văn bằng; sans-serif kiểu Inter/Be Vietnam Pro cho body. Tiếng Việt phải có dấu đầy đủ.
- **Layout web**: phong cách công báo điện tử / cổng thông tin Bộ. Có header đầy đủ tên Trường, ngày cập nhật, số hiệu văn bản. Mỗi trang giáo trình có "đã ban hành ngày", "có hiệu lực đến", chữ ký/tên Trưởng khoa.
- **Văn bằng**: thiết kế in được trên A4 ngang, có viền hoa văn, con dấu, chữ ký Hiệu trưởng và Trưởng khoa. Mỗi văn bằng có QR code dẫn về cổng tra cứu.
- **Tone giao tiếp**: hành chính - học thuật. Xưng "tôi" - "Quý khách". Không emoji. Không viết tắt. Không tiếng lóng. Câu rõ, ngắn, đầy đủ chủ ngữ vị ngữ.
---

## 20. Câu hỏi mở chờ quyết định

Các câu hỏi sau cần được giải quyết trước hoặc trong Phase 0–1, đánh dấu để theo dõi:

1. **Trưởng khoa Luật đầu tiên**: tự tìm partner độc lập hay đề nghị một quan hệ sẵn có (nếu có)?
2. **Tham vấn pháp lý về tái xuất bản văn bản pháp luật**: chốt với luật sư trước khi bắt đầu Phase 0.
3. **Cổng tra cứu văn bằng**: thiết kế công khai hoàn toàn (ai cũng tra được) hay yêu cầu mã định danh để tra (chống abuse)?
4. **Engine target**: ngoài OpenClaw, ưu tiên hỗ trợ những runtime nào trong Phase 2 — Claude Code/Desktop, Cursor, ChatGPT Desktop?
5. **Quy chế thu hồi văn bằng**: khi Trợ lý đã cấp bằng nhưng phát hiện lỗi nghiêm trọng, quy trình thu hồi và bồi hoàn cho khách đã tuyển?
6. **Bảo vệ thương hiệu `.edu.vn`**: kiểm tra điều kiện duy trì tên miền `.edu.vn` để bảo đảm dự án không bị thu hồi tên miền do không thoả mãn điều kiện giáo dục theo quy định.
---

*Tài liệu kết thúc.*
