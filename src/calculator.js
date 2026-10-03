export function calculateTrade(input) {
  const margin = Math.max(0, Number(input.margin) || 0)
  const leverage = Math.max(1, Number(input.leverage) || 1)
  const entryPrice = Math.max(0, Number(input.entryPrice) || 0)
  const exitPrice = Math.max(0, Number(input.exitPrice) || 0)
  const feeRate = Math.max(0, Number(input.feeRate) || 0) / 100
  const rebateRate = Math.min(100, Math.max(0, Number(input.rebateRate) || 0)) / 100
  const stopLoss = Math.max(0, Number(input.stopLoss) || 0)
  const takeProfit = Math.max(0, Number(input.takeProfit) || 0)
  const direction = input.direction === 'short' ? -1 : 1

  const notional = margin * leverage
  const quantity = entryPrice ? notional / entryPrice : 0
  const grossPnl = quantity * (exitPrice - entryPrice) * direction
  const entryFee = notional * feeRate
  const exitFee = quantity * exitPrice * feeRate
  const totalFee = entryFee + exitFee
  const rebate = totalFee * rebateRate
  const netPnl = grossPnl - totalFee + rebate
  const roi = margin ? (netPnl / margin) * 100 : 0

  const targetPnl = (price) => {
    if (!price || !entryPrice) return null
    const gross = quantity * (price - entryPrice) * direction
    const fees = entryFee + quantity * price * feeRate
    return gross - fees + fees * rebateRate
  }

  return {
    notional,
    quantity,
    grossPnl,
    entryFee,
    exitFee,
    totalFee,
    rebate,
    netPnl,
    roi,
    stopLossPnl: targetPnl(stopLoss),
    takeProfitPnl: targetPnl(takeProfit),
  }
}
