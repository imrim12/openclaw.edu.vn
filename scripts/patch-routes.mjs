import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const routesPath = 'dist/_routes.json'
const routes = JSON.parse(readFileSync(routesPath, 'utf-8'))

routes.exclude = routes.exclude.filter(r => r !== '/robots.txt' && r !== '/llms.txt')

writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`)
console.log(`Patched dist/_routes.json: removed /robots.txt and /llms.txt from exclude list`)

// Remove static llms.txt so the Pages Function redirect takes effect
const staticLlms = 'dist/llms.txt'
if (existsSync(staticLlms)) {
  rmSync(staticLlms)
  console.log('Removed dist/llms.txt so Pages Function redirect takes effect')
}
