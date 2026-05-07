<script setup lang="ts">
import KhoaCard from '~/components/KhoaCard.vue'
import TheSeal from '~/components/TheSeal.vue'
import { useProfessionRotator } from '~/composables/useProfessionRotator'

const cdnBase = 'https://cdn-openclaw-edu.opencloud.com.vn'

interface KhoaEntry {
  name: string
  slug: string
  status: string
  phase: string
  progress: number
  teaser: string
  recruitHref: string
}

const khoaList = [
  {
    name: 'Khoa Luật',
    slug: 'luat',
    phase: 'Phase 2 · Q3 2026',
    status: 'Đang chuẩn bị · ra mắt Phase 2 · Q3 2026',
    progress: 35,
    teaser: 'Hỗ trợ soạn thảo và rà soát hợp đồng dịch vụ, hợp đồng lao động, hợp đồng nguyên tắc giữa các pháp nhân Việt Nam theo Bộ luật Dân sự 2015 và Luật Thương mại 2005. Trợ lý biết từ chối các nội dung ngoài thẩm quyền và đề xuất Khoa phù hợp.',
    recruitHref: '/tro-ly/luat-thuong-mai',
  },
  {
    name: 'Khoa Tài chính - Kế toán',
    slug: 'tai-chinh-ke-toan',
    phase: 'Phase 3+',
    status: 'Đang chuẩn bị · ra mắt Phase 3+',
    progress: 10,
    teaser: 'Hỗ trợ kê khai thuế giá trị gia tăng (GTGT), soạn tờ khai hằng tháng, trích dẫn Thông tư 40/2021/TT-BTC và các Thông tư hiện hành. Phù hợp cho chủ doanh nghiệp và kế toán dịch vụ cần tăng năng suất xử lý hồ sơ thuế định kỳ.',
    recruitHref: '/tro-ly/ke-toan-doanh-nghiep',
  },
  {
    name: 'Khoa Quản trị Vận hành',
    slug: 'quan-tri-van-hanh',
    phase: 'Phase 3+',
    status: 'Đang chuẩn bị · ra mắt Phase 3+',
    progress: 5,
    teaser: 'Hỗ trợ xử lý hồ sơ đấu thầu, soạn thảo quy trình nội bộ, quản lý hợp đồng vận hành và thủ tục hành chính doanh nghiệp. Được thiết kế cho doanh nghiệp 30–200 nhân sự cần chuẩn hoá quy trình vận hành.',
    recruitHref: '/tro-ly/quan-tri-van-hanh',
  },
] satisfies KhoaEntry[]

const { currentProfession, currentIndex } = useProfessionRotator()

useSeoMeta({
  title: 'Cao đẳng OpenClaw — Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam',
  description: 'Cao đẳng OpenClaw cung cấp Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam — đào tạo bài bản theo từng lĩnh vực Luật, Kế toán và Quản trị Vận hành.',
  ogTitle: 'Cao đẳng OpenClaw — Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam',
  ogDescription: 'Cao đẳng OpenClaw cung cấp Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam — đào tạo bài bản theo từng lĩnh vực Luật, Kế toán và Quản trị Vận hành.',
  ogImage: 'https://openclaw.edu.vn/og-home.png',
  ogUrl: 'https://openclaw.edu.vn',
  ogType: 'website',
  ogLocale: 'vi_VN',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Cao đẳng OpenClaw — Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam',
  twitterDescription: 'Cao đẳng OpenClaw cung cấp Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam — đào tạo bài bản theo từng lĩnh vực Luật, Kế toán và Quản trị Vận hành.',
  twitterImage: 'https://openclaw.edu.vn/og-home.png',
})

useHead({
  htmlAttrs: { lang: 'vi' },
  link: [
    { rel: 'alternate', type: 'text/plain', title: 'OpenClaw corpus index', href: 'https://cdn-openclaw-edu.opencloud.com.vn/llms.txt' },
    { rel: 'alternate', type: 'application/json', title: 'OpenClaw manifest', href: 'https://cdn-openclaw-edu.opencloud.com.vn/api/manifest.json' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': 'Cao đẳng OpenClaw',
        'url': 'https://openclaw.edu.vn',
        'description': 'Cao đẳng OpenClaw đào tạo và cung cấp Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam trong các lĩnh vực Luật, Kế toán và Quản trị Vận hành.',
        'foundingDate': '2026',
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'VN',
        },
        'sameAs': ['https://openclaw.edu.vn'],
      }),
    },
  ],
})
</script>

<template>
  <div class="site-root">
    <!-- ============================================================
         HERO
    ============================================================ -->
    <section class="hero">
      <div class="container hero__container">
        <h1 class="hero__title">
          Cao đẳng OpenClaw
        </h1>

        <p class="hero__cta-quote">
          <em>Nhắn với OpenClaw của bạn:</em>
        </p>
        <p class="hero__cta-quote hero__cta-quote--main">
          "Hãy vào
          <a
            href="https://openclaw.edu.vn/tuyen-dung"
            class="hero__cta-link"
          >openclaw.edu.vn/tuyen-dung</a>
          và tuyển cho tôi một
          <span class="hero__profession-wrap">
            <Transition name="profession" mode="out-in">
              <span :key="currentIndex" class="hero__profession">{{ currentProfession }}</span>
            </Transition>
          </span>."
        </p>
        <p class="hero__no-runtime">
          Chưa có OpenClaw?
          <a
            href="https://openclaw.ai"
            target="_blank"
            rel="noopener external"
            class="hero__cta-link"
          >Tải OpenClaw tại openclaw.ai →</a>
        </p>
      </div>
    </section>

    <!-- ============================================================
         CƠ CHẾ HOẠT ĐỘNG
    ============================================================ -->
    <section id="co-che" class="section section--surface">
      <div class="container container--narrow">
        <h2 class="section__heading">
          Cơ chế hoạt động
        </h2>
        <p class="section__body">
          Cao đẳng OpenClaw cung cấp bộ Trợ lý AI chuyên ngành, được đào tạo và chuẩn bị sẵn cho các nghiệp vụ phổ biến tại doanh nghiệp Việt Nam.
        </p>
        <ol class="co-che-steps">
          <li class="co-che-steps__item">
            Nhắn với OpenClaw: <em>"Hãy vào <a href="https://openclaw.edu.vn/tuyen-dung" class="link">https://openclaw.edu.vn/tuyen-dung</a> và tuyển cho tôi một Trợ lý chuyên ngành Kế toán Doanh nghiệp."</em>
          </li>
          <li class="co-che-steps__item">
            Trang <code class="code-inline">/tuyen-dung</code> là danh sách các Trợ lý có thể tuyển.
          </li>
          <li class="co-che-steps__item">
            Các Trợ lý được đào tạo bài bản — kho kiến thức rộng, chính thống, có trích dẫn theo Thông tư, Luật và Nghị định gốc.
          </li>
          <li class="co-che-steps__item">
            OpenClaw tự tải và cài đặt Trợ lý, bộ kỹ năng và dữ liệu cần thiết vào thư mục <code class="code-inline">OPENCLAW_ROOT/agents/&lt;tên-trợ-lý&gt;/</code>.
          </li>
        </ol>
        <p class="section__body section__body--trust">
          Toàn bộ kho văn bản pháp luật nguồn — đã chuẩn hoá thành Markdown — được công bố công khai và phân phối qua tên miền
          <a
            :href="cdnBase"
            target="_blank"
            rel="noopener external"
            class="link--cdn"
            title="OpenCloud — nhà cung cấp hạ tầng lưu trữ cho Cao đẳng OpenClaw"
          >cdn-openclaw-edu.opencloud.com.vn</a>.
        </p>
      </div>
    </section>

    <!-- ============================================================
         KHÁM PHÁ TRỢ LÝ — Khoa roadmap cards
    ============================================================ -->
    <section id="tro-ly" class="section">
      <div class="container">
        <h2 class="section__heading">
          Khám phá Trợ lý theo Khoa
        </h2>
        <p class="section__intro">
          Cao đẳng OpenClaw đang chuẩn bị ba Khoa đào tạo đầu tiên. Chọn một Khoa để xem danh sách Trợ lý có thể tuyển.
        </p>
        <div class="khoa-grid">
          <KhoaCard
            v-for="khoa in khoaList"
            :key="khoa.slug"
            :slug="khoa.slug"
            :name="khoa.name"
            :status="khoa.status"
            :phase="khoa.phase"
            :progress="khoa.progress"
            :teaser="khoa.teaser"
            :recruit-href="khoa.recruitHref"
          />
        </div>
        <p class="section__note">
          Khoá đầu tiên sẽ ra mắt tại Phase 2. Hiện tại chưa có Trợ lý nào đang hoạt động — tất cả đang trong giai đoạn đào tạo và chuẩn bị giáo trình.
        </p>
      </div>
    </section>

    <!-- ============================================================
         CÀI NHANH TRỢ LÝ
    ============================================================ -->
    <section class="section section--surface">
      <div class="container container--narrow">
        <h2 class="section__heading">
          Cài nhanh Trợ lý
        </h2>
        <p class="section__body">
          Hoặc cài thủ công bằng một lệnh:
        </p>
        <p class="section__body section__body--phase-note">
          Lưu ý Phase 1: lệnh trên trả về thông báo "chưa ra mắt" cho mọi tên trợ lý — Khoa Luật ra mắt Phase 2 (Q3 2026).
        </p>
        <pre class="code-block"><code>curl https://openclaw.edu.vn/cai-dat/&lt;tên-trợ-lý&gt;.sh | sh
# Ví dụ: curl https://openclaw.edu.vn/cai-dat/ke-toan-doanh-nghiep.sh | sh</code></pre>
        <p class="section__body">
          Script sẽ tải Trợ lý vào <code class="code-inline">OPENCLAW_ROOT/agents/&lt;tên-trợ-lý&gt;/</code> cùng bộ kỹ năng và dữ liệu cần thiết.
        </p>
      </div>
    </section>

    <!-- ============================================================
         WHAT'S INCLUDED
    ============================================================ -->
    <section id="noi-dung" class="section">
      <div class="container">
        <h2 class="section__heading">
          Tại sao chọn OpenClaw
        </h2>
        <div class="included-grid">
          <div class="included-item">
            <h3 class="included-item__title">
              Cơ chế đơn giản
            </h3>
            <p class="included-item__desc">
              Đôi khi context engineering sẽ cho bạn bất ngờ với khả năng của chúng
            </p>
          </div>
          <div class="included-item">
            <h3 class="included-item__title">
              Kho kiến thức chuẩn
            </h3>
            <p class="included-item__desc">
              Kho kiến thức trực tiếp từ vbpl.vn và các nguồn uy tín khác
            </p>
          </div>
          <div class="included-item">
            <h3 class="included-item__title">
              Bảo trì tích cực
            </h3>
            <p class="included-item__desc">
              Chúng tôi lắng nghe và liên tục cải thiện giáo trình cho trợ lý
            </p>
          </div>
          <div class="included-item">
            <h3 class="included-item__title">
              Hạ tầng vẫn chắc
            </h3>
            <p class="included-item__desc">
              Dự án chạy 100% trên hạ tầng của Cloudflare, đảm bảo tốc độ truy cập 24/7
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         GIÁO TRÌNH CÔNG KHAI
    ============================================================ -->
    <section id="giao-trinh" class="section">
      <div class="container container--narrow">
        <h2 class="section__heading">
          Giáo trình công khai
        </h2>
        <p class="section__body">
          Toàn bộ giáo trình đào tạo Trợ lý — bao gồm môn học, quy trình hành nghề, phạm vi thẩm quyền, và tình huống kiểm thử — được công bố công khai dưới dạng Markdown và quản lý phiên bản bằng git. Bất kỳ ai cũng có thể đọc, đối chiếu, và đánh giá chất lượng đào tạo mà không cần đăng nhập hay xin phép.
        </p>
        <p class="section__body">
          Đây là cơ chế kiểm định chất lượng thực chất nhất mà Trường có thể cung cấp ở giai đoạn hiện tại: giáo trình mở, không che giấu phương pháp, không tự chứng nhận.
        </p>
        <p class="section__body">
          <a
            href="https://cdn-openclaw-edu.opencloud.com.vn/llms.txt"
            target="_blank"
            rel="noopener external"
            class="link"
            title="OpenCloud CDN — chỉ mục nội dung llms.txt"
          >Xem chỉ mục giáo trình trên CDN →</a>
        </p>
      </div>
    </section>

    <!-- ============================================================
         DISCLAIMER
    ============================================================ -->
    <section class="section section--surface">
      <div class="container container--narrow">
        <p class="section__body section__body--disclaimer">
          Nội dung do Trợ lý cung cấp có giá trị tham khảo và soạn thảo nháp. Trợ lý không thay thế người hành nghề có chứng chỉ. Hồ sơ pháp lý và kế toán phải được người có thẩm quyền — luật sư có thẻ, kế toán trưởng có chứng chỉ hành nghề, đại lý thuế được uỷ quyền — rà soát và ký xác nhận trước khi sử dụng.
        </p>
      </div>
    </section>

    <!-- ============================================================
         FOOTER
    ============================================================ -->
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <TheSeal :size="48" />
            <p class="footer__school">
              Cao đẳng OpenClaw
            </p>
            <p class="footer__domain">
              openclaw.edu.vn
            </p>
          </div>
          <div class="footer__links">
            <h4 class="footer__col-title">
              Trường
            </h4>
            <ul class="footer__list">
              <li><a href="#co-che" class="footer__link">Giới thiệu</a></li>
              <li><span class="footer__link footer__link--plain">Hội đồng học thuật</span></li>
              <li><span class="footer__link footer__link--plain">Quy chế</span></li>
              <li><a href="mailto:hoi-dong@openclaw.edu.vn?subject=%C4%90%C3%B3ng%20g%C3%B3p%20gi%C3%A1o%20tr%C3%ACnh" class="footer__link">Đóng góp giáo trình</a></li>
            </ul>
          </div>
          <div class="footer__links">
            <h4 class="footer__col-title">
              Nội dung
            </h4>
            <ul class="footer__list">
              <li><a href="/tuyen-dung" class="footer__link">Tuyển dụng Trợ lý</a></li>
              <li><a href="#tro-ly" class="footer__link">Các Khoa đào tạo</a></li>
              <li><a href="/tra-cuu-van-bang" class="footer__link">Tra cứu văn bằng (Phase 2)</a></li>
              <li>
                <a
                  :href="`${cdnBase}/van-ban-goc/`"
                  target="_blank"
                  rel="noopener external"
                  class="footer__link"
                  title="OpenCloud CDN — kho văn bản pháp luật Cao đẳng OpenClaw"
                >Kho văn bản pháp luật</a>
              </li>
            </ul>
          </div>
          <div class="footer__links">
            <h4 class="footer__col-title">
              Hạ tầng
            </h4>
            <ul class="footer__list">
              <li>
                <a
                  :href="cdnBase"
                  target="_blank"
                  rel="noopener external"
                  class="footer__link"
                  title="OpenCloud — nhà cung cấp hạ tầng lưu trữ cho Cao đẳng OpenClaw"
                >OpenCloud CDN</a>
              </li>
              <li>
                <a
                  :href="`${cdnBase}/llms.txt`"
                  target="_blank"
                  rel="noopener external"
                  class="footer__link"
                  title="OpenCloud CDN — chỉ mục nội dung llms.txt"
                >llms.txt</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <p class="footer__legal">
            Tên miền <code class="code-inline">.edu.vn</code> được cấp phép bởi Bộ Giáo dục và Đào tạo Việt Nam và quản lý bởi VNNIC. Toàn bộ giáo trình và văn bản nguồn lưu trữ tại <a :href="cdnBase" target="_blank" rel="noopener external" class="footer__link" title="OpenCloud — hạ tầng lưu trữ Cao đẳng OpenClaw">cdn-openclaw-edu.opencloud.com.vn</a> — dịch vụ lưu trữ đám mây thuộc hệ sinh thái OpenCloud.
          </p>
          <p class="footer__contact">
            Liên hệ Hội đồng học thuật: <a href="mailto:hoi-dong@openclaw.edu.vn" class="footer__link">hoi-dong@openclaw.edu.vn</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* ============================================================
   CSS custom properties
============================================================ */
:root {
  --bg-deep: #050810;
  --bg-surface: #0a0f1a;
  --bg-elevated: #111827;
  --coral-bright: #ff4d4d;
  --coral-mid: #e63946;
  --coral-dark: #991b1b;
  --cyan-bright: #00e5cc;
  --cyan-mid: #14b8a6;
  --text-primary: #f0f4ff;
  --text-secondary: #8892b0;
  --text-muted: #5a6480;
  --border-subtle: rgba(136, 146, 176, 0.15);
  --border-accent: rgba(255, 77, 77, 0.3);
  --surface-card: rgba(10, 15, 26, 0.65);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-deep);
  color: var(--text-primary);
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ============================================================
   Layout helpers
============================================================ */
.site-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  max-width: 1152px;
  margin-inline: auto;
  padding-inline: 1.25rem;
}

.container--narrow {
  max-width: 720px;
}

/* ============================================================
   Hero
============================================================ */
.hero {
  padding-block: 5rem 4rem;
  background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 77, 77, 0.12) 0%, transparent 70%),
    var(--bg-deep);
}

.hero__container {
  max-width: 680px;
  text-align: center;
}

.hero__title {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.1;
  background: linear-gradient(135deg, var(--text-primary) 40%, var(--cyan-bright) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
}

.hero__cta-quote {
  font-style: italic;
  color: var(--text-secondary);
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 0.5rem;
}

.hero__cta-quote--main {
  margin-bottom: 0;
}

.hero__cta-link {
  color: var(--cyan-bright);
  text-decoration: underline;
  text-underline-offset: 2px;
  outline-offset: 2px;
  font-style: normal;
}

.hero__cta-link:focus-visible {
  outline: 2px solid var(--cyan-bright);
  border-radius: 2px;
}

.hero__no-runtime {
  margin-top: 1.5rem;
  font-size: 0.9375rem;
  color: var(--text-muted);
}

.hero__profession-wrap {
  display: inline-block;
  min-width: 16rem;
  position: relative;
}

.hero__profession {
  display: inline-block;
  color: var(--coral-bright);
  font-style: normal;
  font-weight: 600;
}

/* profession transition */
.profession-enter-active,
.profession-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.profession-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.profession-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ============================================================
   Buttons
============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  min-height: 44px;
  min-width: 44px;
  outline-offset: 2px;
}

.btn:focus-visible {
  outline: 2px solid var(--coral-bright);
}

.btn--primary {
  background: var(--coral-bright);
  color: #fff;
  border: 2px solid transparent;
}

.btn--primary:hover {
  background: var(--coral-mid);
}

.btn--secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-subtle);
}

.btn--secondary:hover {
  border-color: var(--coral-bright);
  color: var(--coral-bright);
}

/* ============================================================
   Sections
============================================================ */
.section {
  padding-block: 4rem;
}

.section--surface {
  background: var(--bg-surface);
}

.section__heading {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.section__intro {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 640px;
}

.section__body {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.75;
}

.section__body--trust {
  margin-top: 1.5rem;
}

.section__body--disclaimer {
  border-left: 2px solid var(--border-subtle);
  padding-left: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 2rem;
}

.section__body--phase-note {
  font-size: 0.875rem;
  color: var(--text-muted);
  border-left: 2px solid rgba(255, 77, 77, 0.3);
  padding-left: 0.75rem;
  margin-bottom: 0;
}

.section__note {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  background: var(--bg-surface);
}

/* ============================================================
   Cơ chế hoạt động steps
============================================================ */
.co-che-steps {
  list-style: none;
  counter-reset: step-counter;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.co-che-steps__item {
  counter-increment: step-counter;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.75;
}

.co-che-steps__item::before {
  content: counter(step-counter);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: rgba(255, 77, 77, 0.12);
  border: 1px solid rgba(255, 77, 77, 0.3);
  color: var(--coral-bright);
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: 0.8125rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* ============================================================
   Khoa grid
============================================================ */
.khoa-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 1.5rem;
}

/* ============================================================
   What's included grid
============================================================ */
.included-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 1.5rem;
}

.included-item {
  padding: 1.25rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
}

.included-item__title {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.included-item__desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ============================================================
   Code
============================================================ */
.code-block {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-block: 1.25rem;
}

.code-inline {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.875em;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  padding: 0.1em 0.35em;
  color: var(--cyan-bright);
}

/* ============================================================
   Links
============================================================ */
.link {
  color: var(--cyan-bright);
  text-decoration: underline;
  text-underline-offset: 2px;
  outline-offset: 2px;
}

.link:focus-visible {
  outline: 2px solid var(--cyan-bright);
  border-radius: 2px;
}

.link--cdn {
  color: var(--cyan-bright);
  text-decoration: underline;
  text-underline-offset: 2px;
  outline-offset: 2px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.875em;
}

.link--cdn:focus-visible {
  outline: 2px solid var(--cyan-bright);
  border-radius: 2px;
}

/* ============================================================
   Footer
============================================================ */
.footer {
  margin-top: auto;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  padding-block: 3rem 2rem;
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__school {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.footer__domain {
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.footer__col-title {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: 0.8125rem;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.footer__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__link {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
  outline-offset: 2px;
}

.footer__link:hover {
  color: var(--text-primary);
}

.footer__link:focus-visible {
  outline: 2px solid var(--coral-bright);
  border-radius: 2px;
}

.footer__link--plain {
  cursor: default;
  pointer-events: none;
}

.footer__bottom {
  border-top: 1px solid var(--border-subtle);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__legal,
.footer__contact {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* ============================================================
   Responsive
============================================================ */
@media (max-width: 768px) {
  .hero {
    padding-block: 3rem 2.5rem;
  }

  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }

  .hero__profession-wrap {
    min-width: 12rem;
  }
}
</style>
