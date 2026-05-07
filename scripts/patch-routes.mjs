import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const routesPath = 'dist/_routes.json'
const routes = JSON.parse(readFileSync(routesPath, 'utf-8'))

routes.exclude = routes.exclude.filter(r => r !== '/robots.txt' && r !== '/llms.txt')

writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`)
console.log(`Patched dist/_routes.json: removed /robots.txt and /llms.txt from exclude list`)

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
