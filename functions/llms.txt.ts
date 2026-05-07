const CDN_LLMS_TXT = 'https://cdn-openclaw-edu.opencloud.com.vn/llms.txt'

export const onRequest: PagesFunction = () => {
  return Response.redirect(CDN_LLMS_TXT, 302)
}
