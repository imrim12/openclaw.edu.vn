<script setup lang="ts">
import KhoaCard from '~/components/KhoaCard.vue'
import TheSeal from '~/components/TheSeal.vue'

const cdnBase = 'https://cdn-openclaw-edu.opencloud.com.vn'

interface KhoaEntry {
  name: string
  slug: string
  status: string
  phase: string
  progress: number
  teaser: string
  cta: string
}

const khoaList = [
  {
    name: 'Khoa Luật',
    slug: 'luat',
    phase: 'Phase 2 · Q3 2026',
    status: 'Đang chuẩn bị · ra mắt Phase 2 · Q3 2026',
    progress: 35,
    teaser: 'Hỗ trợ soạn thảo và rà soát hợp đồng dịch vụ, hợp đồng lao động, hợp đồng nguyên tắc giữa các pháp nhân Việt Nam theo Bộ luật Dân sự 2015 và Luật Thương mại 2005. Trợ lý biết từ chối các nội dung ngoài thẩm quyền và đề xuất Khoa phù hợp.',
    cta: 'Đăng ký nhận tin',
  },
  {
    name: 'Khoa Tài chính - Kế toán',
    slug: 'tai-chinh-ke-toan',
    phase: 'Phase 3+',
    status: 'Đang chuẩn bị · ra mắt Phase 3+',
    progress: 10,
    teaser: 'Hỗ trợ kê khai thuế giá trị gia tăng (GTGT), soạn tờ khai hằng tháng, trích dẫn Thông tư 40/2021/TT-BTC và các Thông tư hiện hành. Phù hợp cho chủ doanh nghiệp và kế toán dịch vụ cần tăng năng suất xử lý hồ sơ thuế định kỳ.',
    cta: 'Đăng ký nhận tin',
  },
  {
    name: 'Khoa Quản trị Vận hành',
    slug: 'quan-tri-van-hanh',
    phase: 'Phase 3+',
    status: 'Đang chuẩn bị · ra mắt Phase 3+',
    progress: 5,
    teaser: 'Hỗ trợ xử lý hồ sơ đấu thầu, soạn thảo quy trình nội bộ, quản lý hợp đồng vận hành và thủ tục hành chính doanh nghiệp. Được thiết kế cho doanh nghiệp 30–200 nhân sự cần chuẩn hoá quy trình vận hành.',
    cta: 'Đăng ký nhận tin',
  },
] satisfies KhoaEntry[]

useSeoMeta({
  title: 'Cao đẳng OpenClaw — Trường nghề đào tạo Trợ lý chuyên ngành cho doanh nghiệp Việt Nam',
  description: 'Cao đẳng OpenClaw đào tạo và cấp văn bằng cho Trợ lý chuyên ngành — Luật, Tài chính-Kế toán, Quản trị Vận hành. Giáo trình công khai, bằng cấp xác thực, hành nghề có giới hạn. Phục vụ doanh nghiệp Việt Nam.',
  ogTitle: 'Cao đẳng OpenClaw — Trường nghề đào tạo Trợ lý chuyên ngành',
  ogDescription: 'Đào tạo Trợ lý chuyên ngành cho doanh nghiệp Việt Nam. Giáo trình công khai, văn bằng xác thực, phạm vi hành nghề rõ ràng.',
  ogImage: 'https://openclaw.edu.vn/og-home.png',
  ogUrl: 'https://openclaw.edu.vn',
  ogType: 'website',
  ogLocale: 'vi_VN',
})

useHead({
  htmlAttrs: { lang: 'vi' },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': 'Cao đẳng OpenClaw',
        'url': 'https://openclaw.edu.vn',
        'description': 'Trường nghề đào tạo và cấp văn bằng cho Trợ lý chuyên ngành tại Việt Nam. Giáo trình công khai, bằng cấp xác thực, hành nghề có giới hạn.',
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
      <div class="container">
        <div class="hero__identity">
          <TheSeal :size="96" />
          <div class="hero__wordmark">
            <span class="hero__school-name">Cao đẳng OpenClaw</span>
            <span class="hero__est">EST. 2026</span>
          </div>
        </div>

        <h1 class="hero__tagline">
          Trường nghề đào tạo Trợ lý chuyên ngành<br class="hero__br">
          cho doanh nghiệp Việt Nam
        </h1>

        <p class="hero__sub">
          Giáo trình công khai. Bằng cấp xác thực. Hành nghề có giới hạn.
        </p>

        <div class="hero__ctas">
          <a href="#tro-ly" class="btn btn--primary">
            Khám phá Trợ lý
          </a>
          <a href="#noi-dung" class="btn btn--secondary">
            Khám phá giáo trình
          </a>
        </div>
      </div>
    </section>

    <!-- ============================================================
         WHAT IT IS — §3 Tuyên ngôn
    ============================================================ -->
    <section class="section section--surface">
      <div class="container container--narrow">
        <h2 class="section__heading">
          Trường là gì
        </h2>
        <p class="section__body">
          Cao đẳng OpenClaw đào tạo và cấp văn bằng cho các Trợ lý trí tuệ nhân tạo (AI) theo từng ngành nghề cụ thể, với giáo trình công khai, quy trình minh bạch, và phạm vi hành nghề rõ ràng. Mỗi Trợ lý tốt nghiệp đều có thể được doanh nghiệp tuyển dụng và giao việc với mức độ tin cậy tương đương một nhân viên cấp cử nhân thực hành đã được đào tạo bài bản — soạn thảo hợp đồng, kê khai thuế, xử lý hồ sơ hành chính — mà không cần người dùng hiểu về kỹ thuật hay lắp ghép công cụ.
        </p>
        <p class="section__body">
          Khác với ChatGPT hay các công cụ AI tổng quát, Trợ lý của Trường được đào tạo chuyên biệt cho nghiệp vụ pháp luật và kế toán Việt Nam, có trích dẫn văn bản pháp luật cụ thể theo từng điều khoản, và được thiết kế để từ chối các việc ngoài thẩm quyền chuyên môn. Thay vì tự làm hoặc thuê thêm nhân sự, doanh nghiệp tuyển một Trợ lý đã tốt nghiệp và giao việc bằng ngôn ngữ tự nhiên.
        </p>
        <div class="tuyen-ngon">
          <span>Giáo trình công khai</span>
          <span class="tuyen-ngon__sep" aria-hidden="true">·</span>
          <span>Bằng cấp xác thực</span>
          <span class="tuyen-ngon__sep" aria-hidden="true">·</span>
          <span>Hành nghề có giới hạn</span>
        </div>
        <p class="section__body section__body--trust">
          Mọi Trợ lý tốt nghiệp đều có văn bằng có mã định danh duy nhất, có thể tra cứu công khai. Giáo trình từng Khoa do Trưởng khoa là chuyên gia có chứng chỉ hành nghề thật duyệt và chịu trách nhiệm. Kho văn bản pháp luật nguồn — mục tiêu gần 500.000 văn bản — được chuẩn hoá thành Markdown, công khai hoàn toàn, và phân phối tại tên miền
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
          Trường đang chuẩn bị ba Khoa đào tạo đầu tiên. Khoa Luật ra mắt Phase 2 — Q3 2026. Đăng ký nhận tin để được thông báo khi Trợ lý đầu tiên ra mắt.
        </p>
        <div class="khoa-grid">
          <KhoaCard
            v-for="khoa in khoaList"
            :key="khoa.slug"
            :name="khoa.name"
            :status="khoa.status"
            :phase="khoa.phase"
            :progress="khoa.progress"
            :teaser="khoa.teaser"
            :cta="khoa.cta"
          />
        </div>
        <p class="section__note">
          Khoá đầu tiên ra mắt Phase 2. Chưa có Trợ lý nào đang hoạt động ở Phase 1 — tất cả đang trong giai đoạn đào tạo và chuẩn bị giáo trình.
        </p>
      </div>
    </section>

    <!-- ============================================================
         QUICK START FOR AGENTS
    ============================================================ -->
    <section class="section section--surface">
      <div class="container container--narrow">
        <h2 class="section__heading">
          Tích hợp vào agent runtime
        </h2>
        <p class="section__body">
          Toàn bộ giáo trình, định nghĩa Trợ lý và văn bản pháp luật nguồn được phân phối dưới dạng Markdown thuần qua hạ tầng CDN của OpenCloud tại tên miền <code class="code-inline">cdn-openclaw-edu.opencloud.com.vn</code>. OpenCloud là nhà cung cấp hạ tầng lưu trữ cho Cao đẳng OpenClaw — toàn bộ nội dung học thuật của Trường được lưu trữ và phân phối qua dịch vụ này.
        </p>
        <pre class="code-block"><code><!-- fetch a Trợ lý definition — example for Phase 2 -->
fetch('https://cdn-openclaw-edu.opencloud.com.vn/tro-ly/luat-kinh-te/ho-so.md')
  .then(r => r.text())
  .then(md => /* load into your agent context */)

<!-- enumerate all available paths -->
fetch('https://cdn-openclaw-edu.opencloud.com.vn/llms.txt')</code></pre>
        <p class="section__body">
          Mỗi file trả về <code class="code-inline">Content-Type: text/markdown; charset=utf-8</code>. Agent runtime chỉ cần đọc file và nạp vào context — không cần API key, không cần SDK.
        </p>
      </div>
    </section>

    <!-- ============================================================
         WHAT'S INCLUDED
    ============================================================ -->
    <section id="noi-dung" class="section">
      <div class="container">
        <h2 class="section__heading">
          Nội dung công khai
        </h2>
        <div class="included-grid">
          <div class="included-item">
            <h3 class="included-item__title">
              Giáo trình Khoa
            </h3>
            <p class="included-item__desc">
              Toàn bộ môn học, quy trình hành nghề, boundary và test case của từng ngành — công khai, phiên bản hoá bằng git.
            </p>
          </div>
          <div class="included-item">
            <h3 class="included-item__title">
              Kho văn bản pháp luật
            </h3>
            <p class="included-item__desc">
              Gần 500.000 văn bản quy phạm pháp luật Việt Nam đã chuẩn hoá Markdown, có đầy đủ metadata số hiệu, ngày ban hành, hiệu lực.
            </p>
          </div>
          <div class="included-item">
            <h3 class="included-item__title">
              Chỉ mục cho agent
            </h3>
            <p class="included-item__desc">
              <a
                :href="`${cdnBase}/llms.txt`"
                target="_blank"
                rel="noopener external"
                class="link"
                title="OpenCloud CDN — chỉ mục nội dung Cao đẳng OpenClaw"
              >llms.txt</a> và <a
                :href="`${cdnBase}/api/manifest.json`"
                target="_blank"
                rel="noopener external"
                class="link"
                title="OpenCloud CDN — manifest JSON của Cao đẳng OpenClaw"
              >manifest.json</a> cập nhật theo mỗi lần deploy — agent runtime tự đồng bộ corpus mà không cần tải lại thủ công.
            </p>
          </div>
          <div class="included-item">
            <h3 class="included-item__title">
              Văn bằng tra cứu công khai
            </h3>
            <p class="included-item__desc">
              Mỗi Trợ lý tốt nghiệp có mã định danh duy nhất, tra cứu được tại cổng xác thực văn bằng của Trường.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         VĂN BẰNG
    ============================================================ -->
    <section class="section section--surface">
      <div class="container container--narrow">
        <h2 class="section__heading">
          Văn bằng đã cấp
        </h2>
        <p class="section__body">
          Khoá đầu tiên ra mắt Phase 2. Sau khi Trợ lý đầu tiên hoàn thành chương trình đào tạo và được Hội đồng học thuật cấp bằng, danh sách văn bằng sẽ được công bố tại đây với mã định danh có thể tra cứu công khai.
        </p>
        <p class="section__body">
          Mọi Trợ lý tốt nghiệp đều được cấp văn bằng có mã định danh dạng <code class="code-inline">7380107.2026.xxxxxx</code>. Người dùng và đối tác có thể tra cứu xác thực văn bằng tại <code class="code-inline">openclaw.edu.vn/tra-cuu-van-bang/</code>.
        </p>
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
              <li><a href="/gioi-thieu" class="footer__link">Giới thiệu</a></li>
              <li><a href="/hoi-dong-hoc-thuat" class="footer__link">Hội đồng học thuật</a></li>
              <li><a href="/quy-che" class="footer__link">Quy chế</a></li>
              <li><a href="/dong-gop" class="footer__link">Đóng góp giáo trình</a></li>
            </ul>
          </div>
          <div class="footer__links">
            <h4 class="footer__col-title">
              Nội dung
            </h4>
            <ul class="footer__list">
              <li><a href="/khoa/" class="footer__link">Các Khoa đào tạo</a></li>
              <li><a href="/tro-ly/" class="footer__link">Danh sách Trợ lý</a></li>
              <li><a href="/tra-cuu-van-bang/" class="footer__link">Tra cứu văn bằng</a></li>
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
   CSS custom properties — impl-plan §3.1
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

.hero__identity {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.hero__wordmark {
  display: flex;
  flex-direction: column;
}

.hero__school-name {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--text-primary);
  line-height: 1.2;
}

.hero__est {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--coral-bright);
  margin-top: 0.125rem;
}

.hero__tagline {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.15;
  background: linear-gradient(135deg, var(--text-primary) 40%, var(--cyan-bright) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.25rem;
}

.hero__br {
  display: block;
}

.hero__sub {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
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
   Tuyên ngôn
============================================================ */
.tuyen-ngon {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-block: 1.5rem;
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--coral-bright);
  letter-spacing: 0.02em;
}

.tuyen-ngon__sep {
  color: var(--text-muted);
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

  .hero__br {
    display: none;
  }

  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }

  .hero__identity {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
