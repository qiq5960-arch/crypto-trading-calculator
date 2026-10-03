import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const root = resolve(process.argv[2] || '.')
const port = Number(process.env.PORT) || 4173
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' }

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  let file = join(root, pathname === '/' ? 'index.html' : pathname)
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html')
  response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' })
  createReadStream(file).pipe(response)
}).listen(port, '0.0.0.0', () => console.log(`ApexCalc 已启动：http://localhost:${port}`))
