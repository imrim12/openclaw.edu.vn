<template>
  <section>
    <div class="container">
      <p class="section-eyebrow">
        Block 04
      </p>
      <h2 class="section-title">
        Tại sao chọn OpenClaw
      </h2>

      <div class="why-grid">
        <div class="why-card">
          <p class="why-num">
            01
          </p>
          <h3 class="why-title">
            Cơ chế đơn giản
          </h3>
          <p class="why-desc">
            Đôi khi context engineering sẽ cho bạn bất ngờ với khả năng của chúng
          </p>
        </div>
        <div class="why-card">
          <p class="why-num">
            02
          </p>
          <h3 class="why-title">
            Kho kiến thức chuẩn
          </h3>
          <p class="why-desc">
            Kho kiến thức trực tiếp từ vbpl.vn và các nguồn uy tín khác
          </p>
        </div>
        <div class="why-card">
          <p class="why-num">
            03
          </p>
          <h3 class="why-title">
            Bảo trì tích cực
          </h3>
          <p class="why-desc">
            Chúng tôi lắng nghe và liên tục cải thiện giáo trình cho trợ lý
          </p>
        </div>
        <div class="why-card">
          <p class="why-num">
            04
          </p>
          <h3 class="why-title">
            Hạ tầng vẫn chắc
          </h3>
          <p class="why-desc">
            Dự án chạy 100% trên hạ tầng của Cloudflare, đảm bảo tốc độ truy cập 24/7
          </p>
        </div>
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
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 28px;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.why-card {
  background: var(--surface);
  padding: 32px 28px;
  transition: background 0.2s;
}

.why-card:hover {
  background: var(--surface-2);
}

.why-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--coral);
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.why-title {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--text);
  margin-bottom: 12px;
}

.why-desc {
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.65;
}

@media (max-width: 720px) {
  section {
    padding: 56px 0;
  }

  .why-card {
    padding: 26px 22px;
  }
}
</style>
