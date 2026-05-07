export interface KhoaEntry {
  slug: string
  name: string
  status: string
  phase: string
  phaseBadge: string
  progressPct: number
  teaser: string
  recruitHref: string
  sectionId: string
}

export const khoaList = [
  {
    slug: 'luat',
    name: 'Khoa Luật',
    phaseBadge: 'Phase 2 · Q3 2026',
    phase: 'Phase 2',
    status: 'Đang chuẩn bị · ra mắt Phase 2 · Q3 2026',
    progressPct: 32,
    teaser: 'Soạn thảo và rà soát hợp đồng dân sự — thương mại, lao động, sở hữu trí tuệ. Tra cứu văn bản pháp luật, đối chiếu hiệu lực, dẫn chiếu Thông tư - Luật - Nghị định.',
    recruitHref: '/tuyen-dung#khoa-luat',
    sectionId: 'khoa-luat',
  },
  {
    slug: 'tai-chinh-ke-toan',
    name: 'Khoa Tài chính - Kế toán',
    phaseBadge: 'Phase 4 · Q1 2027',
    phase: 'Phase 4',
    status: 'Đang chuẩn bị · ra mắt Phase 4 · Q1 2027',
    progressPct: 14,
    teaser: 'Kê khai và quyết toán thuế GTGT - TNCN - TNDN. Hạch toán nghiệp vụ kế toán doanh nghiệp. Kiểm toán nội bộ và đối chiếu chuẩn mực kế toán Việt Nam.',
    recruitHref: '/tuyen-dung#khoa-tai-chinh-ke-toan',
    sectionId: 'khoa-tai-chinh-ke-toan',
  },
  {
    slug: 'quan-tri-van-hanh',
    name: 'Khoa Quản trị Vận hành',
    phaseBadge: 'Phase 5 · 2027',
    phase: 'Phase 5',
    status: 'Đang chuẩn bị · ra mắt Phase 5 · 2027',
    progressPct: 6,
    teaser: 'Kinh doanh quốc tế và thủ tục xuất nhập khẩu. Quản trị đấu thầu. Kinh tế xây dựng. Quản trị hành chính doanh nghiệp.',
    recruitHref: '/tuyen-dung#khoa-quan-tri-van-hanh',
    sectionId: 'khoa-quan-tri-van-hanh',
  },
] satisfies KhoaEntry[]
