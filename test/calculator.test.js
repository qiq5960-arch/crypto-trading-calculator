import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateTrade } from '../src/calculator.js'

test('做多交易正确计算手续费、返佣和净盈亏', () => {
  const result = calculateTrade({ margin: 1000, leverage: 10, entryPrice: 50000, exitPrice: 55000, feeRate: 0.05, rebateRate: 20, direction: 'long' })
  assert.equal(result.notional, 10000)
  assert.equal(result.grossPnl, 1000)
  assert.equal(result.entryFee, 5)
  assert.equal(result.exitFee, 5.5)
  assert.equal(result.rebate, 2.1)
  assert.ok(Math.abs(result.netPnl - 991.6) < 1e-10)
  assert.ok(Math.abs(result.roi - 99.16) < 1e-10)
})

test('做空交易及止盈止损正确计算', () => {
  const result = calculateTrade({ margin: 500, leverage: 5, entryPrice: 100, exitPrice: 90, feeRate: 0, rebateRate: 0, stopLoss: 105, takeProfit: 80, direction: 'short' })
  assert.equal(result.grossPnl, 250)
  assert.equal(result.stopLossPnl, -125)
  assert.equal(result.takeProfitPnl, 500)
})

test('空值与非法负值不会产生 NaN', () => {
  const result = calculateTrade({ margin: -1, leverage: 0, entryPrice: '', exitPrice: '' })
  assert.equal(result.notional, 0)
  assert.equal(result.quantity, 0)
  assert.equal(result.roi, 0)
  assert.equal(result.stopLossPnl, null)
})
