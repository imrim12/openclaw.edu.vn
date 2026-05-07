// TODO: Phase 2 — sign scripts with a checksum/signature before serving real install scripts

const ALLOWED_SLUGS: ReadonlySet<string> = new Set([
  'luat-thuong-mai',
  'ke-toan-doanh-nghiep',
  'quan-tri-van-hanh',
])

export const onRequest: PagesFunction<Record<string, unknown>, 'slug'> = (context) => {
  const slug = context.params.slug

  if (typeof slug !== 'string' || !ALLOWED_SLUGS.has(slug)) {
    return new Response('Not Found', { status: 404 })
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
