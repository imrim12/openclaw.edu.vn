<template>
  <section id="co-che">
    <div class="container">
      <p class="section-eyebrow">
        Block 01
      </p>
      <h2 class="section-title">
        Cơ chế hoạt động
      </h2>
      <p class="section-intro">
        Cao đẳng OpenClaw cung cấp bộ Trợ lý AI chuyên ngành, được đào tạo và chuẩn bị sẵn cho các nghiệp vụ phổ biến tại doanh nghiệp Việt Nam.
      </p>

      <ol class="steps">
        <li class="step">
          <span class="step-num">01</span>
          <div class="step-body">
            Nhắn với OpenClaw: <em>"Hãy vào openclaw.edu.vn/tuyen-dung và tuyển cho tôi một Trợ lý chuyên ngành Kế toán Doanh nghiệp."</em>
          </div>
        </li>
        <li class="step">
          <span class="step-num">02</span>
          <div class="step-body">
            Trang <code>/tuyen-dung</code> là danh sách các Trợ lý có thể tuyển.
          </div>
        </li>
        <li class="step">
          <span class="step-num">03</span>
          <div class="step-body">
            Các Trợ lý được đào tạo bài bản — kho kiến thức rộng, chính thống, có trích dẫn theo Thông tư, Luật và Nghị định gốc.
          </div>
        </li>
        <li class="step">
          <span class="step-num">04</span>
          <div class="step-body">
            OpenClaw tự tải và cài đặt Trợ lý, bộ kỹ năng và dữ liệu cần thiết vào <code>OPENCLAW_ROOT/agents/&lt;tên-trợ-lý&gt;/</code>.
          </div>
        </li>
      </ol>

      <p class="trust-note">
        Toàn bộ kho văn bản pháp luật nguồn — đã chuẩn hoá thành Markdown — được công bố công khai và phân phối qua tên miền <code>cdn-openclaw-edu.opencloud.com.vn</code>.
      </p>
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

.section-intro {
  font-size: 17px;
  color: var(--text-dim);
  max-width: 680px;
  line-height: 1.7;
  margin-bottom: 48px;
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-top: 1px solid var(--border);
}

.step {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 28px;
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
  align-items: baseline;
}

.step-num {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  color: var(--coral);
  letter-spacing: -0.02em;
}

.step-body {
  font-size: 17px;
  color: var(--text);
  line-height: 1.7;
}

.step-body code {
  font-family: var(--font-mono);
  font-size: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--cyan);
}

.step-body em {
  font-style: italic;
  color: var(--text-dim);
}

.trust-note {
  margin-top: 36px;
  padding: 20px 24px;
  background: var(--surface);
  border-left: 2px solid var(--cyan);
  font-style: italic;
  color: var(--text-dim);
  font-size: 15px;
  line-height: 1.7;
}

.trust-note code {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--cyan);
}

@media (max-width: 720px) {
  section {
    padding: 56px 0;
  }

  .step {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .step-num {
    font-size: 22px;
  }
}
</style>
