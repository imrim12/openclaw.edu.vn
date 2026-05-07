<script setup lang="ts">
import CurriculumSection from '~/components/CurriculumSection.vue'
import DisclaimerSection from '~/components/DisclaimerSection.vue'
import HeroSection from '~/components/HeroSection.vue'
import InstallSection from '~/components/InstallSection.vue'
import KhoaSection from '~/components/KhoaSection.vue'
import MechanismSection from '~/components/MechanismSection.vue'
import WhySection from '~/components/WhySection.vue'

useSeoMeta({
  title: 'Cao đẳng OpenClaw — Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam',
  description: 'Cao đẳng OpenClaw cung cấp bộ Trợ lý AI chuyên ngành đã được đào tạo và chuẩn bị sẵn cho các nghiệp vụ phổ biến tại doanh nghiệp Việt Nam.',
  ogTitle: 'Cao đẳng OpenClaw — Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam',
  ogDescription: 'Cao đẳng OpenClaw cung cấp bộ Trợ lý AI chuyên ngành đã được đào tạo và chuẩn bị sẵn cho các nghiệp vụ phổ biến tại doanh nghiệp Việt Nam.',
  ogImage: 'https://openclaw.edu.vn/og-home.png',
  ogUrl: 'https://openclaw.edu.vn',
  ogType: 'website',
  ogLocale: 'vi_VN',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Cao đẳng OpenClaw — Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam',
  twitterDescription: 'Cao đẳng OpenClaw cung cấp bộ Trợ lý AI chuyên ngành đã được đào tạo và chuẩn bị sẵn cho các nghiệp vụ phổ biến tại doanh nghiệp Việt Nam.',
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
        'address': { '@type': 'PostalAddress', 'addressCountry': 'VN' },
        'sameAs': ['https://openclaw.edu.vn'],
      }),
    },
  ],
})
</script>

<template>
  <HeroSection />
  <MechanismSection />
  <KhoaSection />
  <InstallSection />
  <WhySection />
  <CurriculumSection />
  <DisclaimerSection />
</template>
