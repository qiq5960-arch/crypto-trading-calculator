import './style.css'
import { calculateTrade } from './calculator.js'

const coins = {
  BTC: { name: 'Bitcoin', mark: '₿', color: '#f7931a', price: 67250 },
  ETH: { name: 'Ethereum', mark: '◆', color: '#627eea', price: 3520 },
  SOL: { name: 'Solana', mark: 'S', color: '#9b7bff', price: 148.5 },
  BNB: { name: 'BNB', mark: 'B', color: '#f3ba2f', price: 595 },
}

const app = document.querySelector('#app')
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="ApexCalc 首页"><span class="brand-icon">A</span><span>APEX<span>CALC</span></span></a>
    <div class="status"><i></i> 计算引擎在线</div>
  </header>
  <main>
    <section class="hero">
      <div class="eyebrow"><span></span> PERPETUAL FUTURES TOOLKIT</div>
      <h1>合约交易<span>计算器</span></h1>
      <p>在下单之前，看清每一笔交易的收益与风险。</p>
    </section>
    <section class="terminal">
      <div class="panel input-panel">
        <div class="panel-heading"><div><small>TRADE SETUP</small><h2>交易参数</h2></div><button id="reset" class="text-button">↻ 重置</button></div>
        <div class="label">交易币种</div>
        <div class="coin-tabs" role="radiogroup">
          ${Object.entries(coins).map(([symbol, coin], i) => `<button class="coin ${i === 0 ? 'active' : ''}" data-coin="${symbol}" style="--coin:${coin.color}" role="radio" aria-checked="${i === 0}"><b>${coin.mark}</b><span>${symbol}<small>${coin.name}</small></span></button>`).join('')}
        </div>
        <div class="label">交易方向</div>
        <div class="direction-tabs">
          <button class="direction long active" data-direction="long"><span>↗</span><b>做多</b><small>LONG</small></button>
          <button class="direction short" data-direction="short"><span>↘</span><b>做空</b><small>SHORT</small></button>
        </div>
        <div class="form-grid">
          <label><span>保证金 <em>USDT</em></span><div class="input-wrap"><input id="margin" type="number" min="0" value="1000"><i>USDT</i></div></label>
          <label><span>杠杆倍数</span><div class="input-wrap"><input id="leverage" type="number" min="1" max="125" value="10"><i>×</i></div><div class="quick-leverage">${[5,10,20,50].map(x => `<button data-value="${x}" class="${x===10?'active':''}">${x}×</button>`).join('')}</div></label>
          <label><span>开仓价格 <em>USDT</em></span><div class="input-wrap"><input id="entryPrice" type="number" min="0" value="67250"><i>USDT</i></div></label>
          <label><span>平仓价格 <em>USDT</em></span><div class="input-wrap"><input id="exitPrice" type="number" min="0" value="70000"><i>USDT</i></div></label>
          <label><span>手续费率 <em>单边</em></span><div class="input-wrap"><input id="feeRate" type="number" min="0" step="0.001" value="0.05"><i>%</i></div></label>
          <label><span>返佣比例</span><div class="input-wrap"><input id="rebateRate" type="number" min="0" max="100" value="20"><i>%</i></div></label>
          <label><span>止损价格 <em>可选</em></span><div class="input-wrap"><input id="stopLoss" type="number" min="0" placeholder="未设置"><i>USDT</i></div></label>
          <label><span>止盈价格 <em>可选</em></span><div class="input-wrap"><input id="takeProfit" type="number" min="0" placeholder="未设置"><i>USDT</i></div></label>
        </div>
      </div>
      <div class="panel result-panel">
        <div class="panel-heading"><div><small>POSITION ANALYSIS</small><h2>仓位分析</h2></div><span id="position-badge" class="badge long-badge">BTC · 做多 10×</span></div>
        <div class="primary-result">
          <div class="result-label">最终净盈亏 <span title="毛盈亏减去手续费，加上返佣">?</span></div>
          <div id="netPnl" class="net-value positive">+ 0.00 <small>USDT</small></div>
          <div id="roi" class="roi positive">↗ 保证金收益率 +0.00%</div>
          <div class="meter"><i id="meter-fill"></i></div>
        </div>
        <div class="metrics">
          <div><span>名义仓位</span><strong id="notional"></strong><small id="quantity"></small></div>
          <div><span>毛盈亏</span><strong id="grossPnl"></strong><small>未扣除手续费</small></div>
          <div><span>开仓手续费</span><strong id="entryFee"></strong><small>按开仓名义价值</small></div>
          <div><span>平仓手续费</span><strong id="exitFee"></strong><small>按平仓名义价值</small></div>
          <div><span>手续费合计</span><strong id="totalFee"></strong><small>开仓 + 平仓</small></div>
          <div><span>返佣金额</span><strong id="rebate"></strong><small id="rebate-note"></small></div>
        </div>
        <div class="targets">
          <div class="target stop"><span class="target-icon">⌄</span><div><small>止损预估盈亏</small><strong id="stopLossPnl">未设置</strong></div></div>
          <div class="target take"><span class="target-icon">⌃</span><div><small>止盈预估盈亏</small><strong id="takeProfitPnl">未设置</strong></div></div>
        </div>
        <p class="notice">ⓘ 计算结果仅供参考，未计入资金费率、滑点与强平费用。实际结果以交易所为准。</p>
      </div>
    </section>
    <footer><span>APEXCALC</span><p>清晰计算 · 理性交易 · 控制风险</p><small>本工具不构成任何投资建议</small></footer>
  </main>
`

let selectedCoin = 'BTC'
let direction = 'long'
const inputIds = ['margin','leverage','entryPrice','exitPrice','feeRate','rebateRate','stopLoss','takeProfit']
const inputs = Object.fromEntries(inputIds.map(id => [id, document.querySelector(`#${id}`)]))
const money = (n, sign = false) => `${sign && n >= 0 ? '+ ' : n < 0 ? '− ' : ''}${Math.abs(n).toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT`

function render() {
  const result = calculateTrade({...Object.fromEntries(inputIds.map(id => [id, inputs[id].value])), direction})
  const signClass = result.netPnl >= 0 ? 'positive' : 'negative'
  const coin = coins[selectedCoin]
  document.querySelector('#position-badge').textContent = `${selectedCoin} · ${direction === 'long' ? '做多' : '做空'} ${inputs.leverage.value || 1}×`
  document.querySelector('#position-badge').className = `badge ${direction}-badge`
  document.querySelector('#netPnl').innerHTML = `${result.netPnl >= 0 ? '+ ' : '− '}${Math.abs(result.netPnl).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})} <small>USDT</small>`
  document.querySelector('#netPnl').className = `net-value ${signClass}`
  document.querySelector('#roi').textContent = `${result.roi >= 0 ? '↗' : '↘'} 保证金收益率 ${result.roi >= 0 ? '+' : ''}${result.roi.toFixed(2)}%`
  document.querySelector('#roi').className = `roi ${signClass}`
  document.querySelector('#meter-fill').style.width = `${Math.min(100, Math.abs(result.roi))}%`
  document.querySelector('#meter-fill').className = signClass
  ;['notional','grossPnl','entryFee','exitFee','totalFee','rebate'].forEach(id => document.querySelector(`#${id}`).textContent = money(result[id], id === 'grossPnl'))
  document.querySelector('#grossPnl').className = result.grossPnl >= 0 ? 'positive' : 'negative'
  document.querySelector('#rebate').className = 'positive'
  document.querySelector('#quantity').textContent = `≈ ${result.quantity.toFixed(6)} ${selectedCoin}`
  document.querySelector('#rebate-note').textContent = `手续费的 ${inputs.rebateRate.value || 0}%`
  ;[['stopLossPnl', result.stopLossPnl], ['takeProfitPnl', result.takeProfitPnl]].forEach(([id,value]) => {
    const el = document.querySelector(`#${id}`); el.textContent = value === null ? '未设置' : money(value, true); el.className = value === null ? '' : value >= 0 ? 'positive' : 'negative'
  })
}

document.querySelectorAll('.coin').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.coin').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-checked','false') })
  button.classList.add('active'); button.setAttribute('aria-checked','true'); selectedCoin = button.dataset.coin
  inputs.entryPrice.value = coins[selectedCoin].price; inputs.exitPrice.value = coins[selectedCoin].price; render()
}))
document.querySelectorAll('.direction').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.direction').forEach(x => x.classList.remove('active')); button.classList.add('active'); direction = button.dataset.direction; render()
}))
document.querySelectorAll('.quick-leverage button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.quick-leverage button').forEach(x => x.classList.remove('active')); button.classList.add('active'); inputs.leverage.value = button.dataset.value; render()
}))
inputIds.forEach(id => inputs[id].addEventListener('input', render))
document.querySelector('#reset').addEventListener('click', () => location.reload())
render()
