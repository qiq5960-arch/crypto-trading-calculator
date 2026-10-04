import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist')

const html = readFileSync('index.html', 'utf8')
const css = readFileSync('src/style.css', 'utf8').replace(/^@import[^\n]+\r?\n/, '')
const calculator = readFileSync('src/calculator.js', 'utf8').replace('export function calculateTrade', 'function calculateTrade')
const app = readFileSync('src/main.js', 'utf8')
  .replace(/^import '.\/style\.css'\r?\n/, '')
  .replace(/^import \{ calculateTrade \} from '.\/calculator\.js'\r?\n/, '')

const standaloneHtml = html
  .replace('</head>', `  <style>\n${css}\n  </style>\n  </head>`)
  .replace('    <script type="module" src="./src/main.js"></script>', `    <script>\n${calculator}\n\n${app}\n    </script>`)

writeFileSync('dist/index.html', standaloneHtml)
writeFileSync('dist/.nojekyll', '')
console.log('独立单文件网页已生成至 dist/index.html')
