import { z } from 'zod'

const isoDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const isoDateOrNull = z.union([isoDateString, z.null()])

// §11.5 van-ban-goc frontmatter — strict schema used by pipeline 4 and validated by §5.6
export const vanBanGocFrontmatterSchema = z.object({
  loai: z.literal('van-ban-goc'),
  loai_van_ban: z.string().min(1),
  so_hieu: z.string(),
  ten_van_ban: z.string().min(1),
  co_quan_ban_hanh: z.string(),
  ngay_ban_hanh: isoDateOrNull,
  ngay_hieu_luc: isoDateOrNull,
  ngay_het_hieu_luc: isoDateOrNull,
  trang_thai_hieu_luc: z.string(),
  trich_yeu: z.string(),
  van_ban_thay_the: z.string().nullable(),
  van_ban_huong_dan: z.array(z.string()),
  nguon_crawl: z.string().url(),
  ngay_crawl: isoDateString,
  checksum: z.string().regex(/^[0-9a-f]{64}$/),
  canonical_url: z.string().url().startsWith('https://cdn-openclaw-edu.opencloud.com.vn/'),
})

export type VanBanGocFrontmatter = z.infer<typeof vanBanGocFrontmatterSchema>

// Generic loose schema for any .md file in the corpus (pipelines 5, 6, and validators)
export const frontmatterSchema = z.object({
  loai: z.enum(['van-ban-goc', 'mon', 'nganh', 'khoa', 'tro-ly', 'quy-che']),
  loai_van_ban: z.string().nullable().optional(),
  so_hieu: z.string().nullable().optional(),
  ten_van_ban: z.string().nullable().optional(),
  co_quan_ban_hanh: z.string().nullable().optional(),
  ngay_ban_hanh: z.string().nullable().optional(),
  ngay_hieu_luc: z.string().nullable().optional(),
  ngay_het_hieu_luc: z.string().nullable().optional(),
  van_ban_thay_the: z.string().nullable().optional(),
  van_ban_huong_dan: z.array(z.string()).nullable().optional(),
  nguon_crawl: z.string().nullable().optional(),
  ngay_crawl: z.string().nullable().optional(),
  checksum: z.string().nullable().optional(),
  canonical_url: z.string().nullable().optional(),
  trang_thai: z.enum(['ban-hanh', 'du-thao', 'het-hieu-luc']).nullable().optional(),
  phien_ban: z.union([z.string(), z.number()]).nullable().optional(),
  ngay_cap_nhat: z.string().nullable().optional(),
  hieu_luc_den: z.union([z.string(), z.literal('vinh-vien')]).nullable().optional(),
  truong_khoa_phu_trach: z.string().nullable().optional(),
  ma_dinh_danh: z.string().nullable().optional(),
}).passthrough()

export type Frontmatter = z.infer<typeof frontmatterSchema>
