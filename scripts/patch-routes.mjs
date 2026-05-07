import { readFileSync, writeFileSync } from 'node:fs'

const routesPath = 'dist/_routes.json'
const routes = JSON.parse(readFileSync(routesPath, 'utf-8'))

// /robots.txt and /llms.txt are handled by the compiled Pages Functions in the Worker bundle
routes.exclude = routes.exclude.filter(r => r !== '/robots.txt' && r !== '/llms.txt')

writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`)
console.log(`Patched dist/_routes.json: removed /robots.txt and /llms.txt from exclude list`)
