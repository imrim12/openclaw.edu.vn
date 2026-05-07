import { readFileSync, writeFileSync } from 'node:fs'

const path = 'dist/_routes.json'
const routes = JSON.parse(readFileSync(path, 'utf-8'))

routes.exclude = routes.exclude.filter(r => r !== '/robots.txt' && r !== '/llms.txt')

writeFileSync(path, `${JSON.stringify(routes, null, 2)}\n`)
console.log(`Patched dist/_routes.json: removed /robots.txt and /llms.txt from exclude list`)
