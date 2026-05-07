// TODO: Phase 2 — sign scripts with a checksum/signature before serving real install scripts

const KNOWN_SLUGS = new Set([
  'luat-thuong-mai',
  'ke-toan-doanh-nghiep',
  'quan-tri-van-hanh-doanh-nghiep',
])

export const onRequest: PagesFunction<Record<string, unknown>, 'slug'> = (context) => {
  const slug = context.params.slug

  if (typeof slug !== 'string' || !KNOWN_SLUGS.has(slug)) {
    return new Response(
      'Trợ lý không tồn tại. Xem danh sách tại https://openclaw.edu.vn/tuyen-dung',
      { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    )
  }

  const body = `#!/usr/bin/env bash
echo "Trợ lý ${slug} chưa ra mắt — đặt lịch nhận tin tại https://openclaw.edu.vn/tuyen-dung"
exit 1
`

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/x-shellscript; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
