// TODO: Phase 2 — sign scripts with a checksum/signature before serving real install scripts

export const onRequest: PagesFunction<Record<string, unknown>, 'slug'> = (context) => {
  const slug = context.params.slug as string

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
