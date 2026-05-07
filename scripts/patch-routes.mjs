import { readFileSync, writeFileSync } from 'node:fs'

const routesPath = 'dist/_routes.json'
const routes = JSON.parse(readFileSync(routesPath, 'utf-8'))

// /llms.txt must be in the exclude list so the Nitro Worker skips it and the Pages Function handles it
routes.exclude = routes.exclude.filter(r => r !== '/robots.txt')
if (!routes.exclude.includes('/llms.txt')) {
  routes.exclude.push('/llms.txt')
}

writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`)
console.log(`Patched dist/_routes.json: removed /robots.txt and /llms.txt from exclude list`)
