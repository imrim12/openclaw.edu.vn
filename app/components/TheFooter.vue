<script setup lang="ts">
import TheSeal from '~/components/TheSeal.vue'
</script>

<template>
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>Trường</h4>
          <ul>
            <li><a href="/gioi-thieu">Giới thiệu</a></li>
            <li><a href="/hoi-dong-hoc-thuat">Hội đồng học thuật</a></li>
            <li><a href="/quy-che">Quy chế</a></li>
            <li><a href="/dong-gop">Đóng góp giáo trình</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Nội dung</h4>
          <ul>
            <li><a href="/tuyen-dung">Tuyển dụng Trợ lý</a></li>
            <li><a href="/khoa">Các Khoa đào tạo</a></li>
            <li><a href="/tra-cuu-van-bang">Tra cứu văn bằng <span class="phase-note">(Phase 2)</span></a></li>
            <li><a href="https://cdn-openclaw-edu.opencloud.com.vn/van-ban-goc/" target="_blank" rel="noopener">Kho văn bản pháp luật</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Hạ tầng</h4>
          <ul>
            <li><a href="https://opencloud.com.vn" target="_blank" rel="noopener">OpenCloud CDN</a></li>
            <li><a href="https://cdn-openclaw-edu.opencloud.com.vn/llms.txt" target="_blank" rel="noopener">llms.txt</a></li>
          </ul>
        </div>
        <div class="footer-col footer-brand">
          <TheSeal :size="56" />
          <span class="footer-brand-name">Cao đẳng OpenClaw</span>
          <span class="footer-brand-domain">openclaw.edu.vn</span>
        </div>
      </div>
      <p class="footer-bottom">
        Tên miền <code>.edu.vn</code> được cấp phép bởi Bộ Giáo dục và Đào tạo Việt Nam. Hạ tầng lưu trữ và phân phối thuộc OpenCloud (opencloud.com.vn). Cao đẳng OpenClaw là dự án độc lập, không liên kết với cơ quan nhà nước nào ngoài quan hệ cấp phép tên miền.
      </p>
    </div>
  </footer>
</template>

<style scoped>
footer {
  border-top: 1px solid var(--border);
  padding: 64px 0 36px;
  margin-top: 40px;
  background: var(--bg-deep);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 40px;
  margin-bottom: 48px;
}

.footer-col h4 {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 18px;
  letter-spacing: -0.005em;
}

.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col a {
  color: var(--text-dim);
  font-size: 14px;
}

.footer-col a:hover {
  color: var(--cyan);
}

.phase-note {
  color: var(--text-faint);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-brand-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.footer-brand-domain {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--cyan);
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 28px;
  font-size: 12.5px;
  color: var(--text-faint);
  line-height: 1.7;
  max-width: 720px;
}

.footer-bottom code {
  font-family: var(--font-mono);
  color: var(--text-dim);
  font-size: 12px;
}
</style>
