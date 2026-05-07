<template>
  <section id="giao-trinh">
    <div class="container">
      <p class="section-eyebrow">
        Block 05
      </p>
      <h2 class="section-title">
        Giáo trình công khai
      </h2>

      <div class="curriculum-body">
        <p>
          Toàn bộ giáo trình đào tạo Trợ lý — bao gồm môn học, quy trình hành nghề, phạm vi thẩm quyền, và tình huống kiểm thử — được công bố công khai dưới dạng Markdown và quản lý phiên bản bằng git. Bất kỳ ai cũng có thể đọc, đối chiếu, và đánh giá chất lượng đào tạo mà không cần đăng nhập hay xin phép.
        </p>
        <p>
          Đây là cơ chế kiểm chứng chất lượng thực chất nhất mà Trường có thể cung cấp ở giai đoạn hiện tại: giáo trình mở, không che giấu phương pháp, không tự chứng nhận.
        </p>

        <a href="https://cdn-openclaw-edu.opencloud.com.vn" class="curriculum-cta" target="_blank" rel="noopener">
          cdn-openclaw-edu.opencloud.com.vn <span class="arrow">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 80px 0;
  border-top: 1px solid var(--border);
}

.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-eyebrow::before {
  content: "";
  width: 24px;
  height: 1px;
  background: var(--coral);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4.5vw, 48px);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 28px;
}

.curriculum-body p {
  font-size: 17px;
  color: var(--text-dim);
  line-height: 1.75;
  margin-bottom: 22px;
  max-width: 760px;
}

.curriculum-body p:last-of-type {
  color: var(--text);
}

.curriculum-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 14px 22px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--cyan);
  transition: all 0.2s;
}

.curriculum-cta:hover {
  border-color: var(--cyan);
  background: var(--cyan-soft);
  color: var(--cyan);
}

.curriculum-cta .arrow {
  transition: transform 0.2s;
}

.curriculum-cta:hover .arrow {
  transform: translateX(3px);
}

@media (max-width: 720px) {
  section {
    padding: 56px 0;
  }
}
</style>
