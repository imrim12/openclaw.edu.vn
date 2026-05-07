import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const routesPath = 'dist/_routes.json'
const routes = JSON.parse(readFileSync(routesPath, 'utf-8'))

// Keep /llms.txt in the exclude list so the custom Pages Function handles it (not the Nitro worker)
routes.exclude = routes.exclude.filter(r => r !== '/robots.txt')
if (!routes.exclude.includes('/llms.txt')) {
  routes.exclude.push('/llms.txt')
}

writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`)
console.log(`Patched dist/_routes.json: kept /llms.txt in exclude for Pages Function`)

// Remove static llms.txt so the Nitro routeRule redirect takes effect
const staticLlms = 'dist/llms.txt'
if (existsSync(staticLlms)) {
  rmSync(staticLlms)
  console.log('Removed dist/llms.txt so Nitro redirect takes effect')
}

// Remove any stale /llms.txt 404 line from _redirects so the routeRule 302 wins
const redirectsPath = 'dist/_redirects'
const redirects = readFileSync(redirectsPath, 'utf-8')
const patched = redirects
  .split('\n')
  .filter(line => !line.startsWith('/llms.txt') || line.includes('302'))
  .join('\n')
if (patched !== redirects) {
  writeFileSync(redirectsPath, patched)
  console.log('Patched dist/_redirects: removed stale /llms.txt 404 entry')
}
