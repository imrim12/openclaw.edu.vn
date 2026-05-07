<script setup lang="ts">
import KhoaCard from '~/components/KhoaCard.vue'

interface KhoaData {
  name: string
  phaseBadge: string
  status: string
  progressPct: number
  teaser: string
  ctaHref: string
}

const khoaList = [
  {
    name: 'Khoa Luật',
    phaseBadge: 'Phase 2 · Q3 2026',
    status: 'Đang chuẩn bị · ra mắt Phase 2 · Q3 2026',
    progressPct: 32,
    teaser: 'Soạn thảo và rà soát hợp đồng dân sự — thương mại, lao động, sở hữu trí tuệ. Tra cứu văn bản pháp luật, đối chiếu hiệu lực, dẫn chiếu Thông tư - Luật - Nghị định.',
    ctaHref: '/tuyen-dung#khoa-luat',
  },
  {
    name: 'Khoa Tài chính - Kế toán',
    phaseBadge: 'Phase 4 · Q1 2027',
    status: 'Đang chuẩn bị · ra mắt Phase 4 · Q1 2027',
    progressPct: 14,
    teaser: 'Kê khai và quyết toán thuế GTGT - TNCN - TNDN. Hạch toán nghiệp vụ kế toán doanh nghiệp. Kiểm toán nội bộ và đối chiếu chuẩn mực kế toán Việt Nam.',
    ctaHref: '/tuyen-dung#khoa-tai-chinh-ke-toan',
  },
  {
    name: 'Khoa Quản trị Vận hành',
    phaseBadge: 'Phase 5 · 2027',
    status: 'Đang chuẩn bị · ra mắt Phase 5 · 2027',
    progressPct: 6,
    teaser: 'Kinh doanh quốc tế và thủ tục xuất nhập khẩu. Quản trị đấu thầu. Kinh tế xây dựng. Quản trị hành chính doanh nghiệp.',
    ctaHref: '/tuyen-dung#khoa-quan-tri-van-hanh',
  },
] satisfies KhoaData[]
</script>

<template>
  <section id="khoa">
    <div class="container">
      <p class="section-eyebrow">
        Block 02
      </p>
      <h2 class="section-title">
        Khám phá Trợ lý theo Khoa
      </h2>
      <p class="section-intro">
        Cao đẳng OpenClaw đang chuẩn bị ba Khoa đào tạo đầu tiên. Chọn một Khoa để xem danh sách Trợ lý có thể tuyển.
      </p>

      <div class="faculty-grid">
        <KhoaCard
          v-for="khoa in khoaList"
          :key="khoa.name"
          :name="khoa.name"
          :phase-badge="khoa.phaseBadge"
          :status="khoa.status"
          :progress-pct="khoa.progressPct"
          :teaser="khoa.teaser"
          :cta-href="khoa.ctaHref"
        />
      </div>

      <p class="faculty-note">
        Khoá đầu tiên sẽ ra mắt tại Phase 2. Hiện tại chưa có Trợ lý nào đang hoạt động — tất cả đang trong giai đoạn đào tạo và chuẩn bị giáo trình.
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

.faculty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.faculty-note {
  margin-top: 28px;
  font-size: 14px;
  color: var(--text-faint);
  font-style: italic;
}

@media (max-width: 720px) {
  section {
    padding: 56px 0;
  }
}
</style>
