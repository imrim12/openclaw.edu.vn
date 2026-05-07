const BODY = `# Cao đẳng OpenClaw

Apex llms.txt — đây là chỉ mục agent-facing.
Chỉ mục đầy đủ ở: https://cdn-openclaw-edu.opencloud.com.vn/llms.txt
Manifest máy đọc được: https://cdn-openclaw-edu.opencloud.com.vn/api/manifest.json
`

export const onRequest: PagesFunction = () => {
  return new Response(BODY, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
