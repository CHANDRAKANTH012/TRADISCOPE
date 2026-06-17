import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, Target, TrendingUp, Layers, BarChart2,
  DollarSign, Percent, RefreshCw, ChevronDown, Info
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

/* ─── Shared Input ─────────────────────────────────────── */
const Input = ({ label, value, onChange, placeholder, prefix, suffix, type = "number", step = "any", min }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">{label}</label>
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-gray-500 text-sm pointer-events-none">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        min={min}
        className={`w-full py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm
          focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all
          placeholder-gray-700 ${prefix ? "pl-8" : "pl-3.5"} ${suffix ? "pr-12" : "pr-3.5"}`}
      />
      {suffix && <span className="absolute right-3 text-gray-500 text-xs pointer-events-none">{suffix}</span>}
    </div>
  </div>
);

/* ─── Result Row ────────────────────────────────────────── */
const ResultRow = ({ label, value, color = "text-white", highlight }) => (
  <div className={`flex justify-between items-center py-2.5 ${highlight ? "border-t border-white/10 mt-1 pt-3" : ""}`}>
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`font-semibold text-sm ${color}`}>{value}</span>
  </div>
);

/* ─── Stat Badge ────────────────────────────────────────── */
const StatBadge = ({ label, value, color }) => (
  <div className={`flex-1 min-w-0 rounded-xl p-3.5 border ${color} bg-black/20`}>
    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">{label}</p>
    <p className="text-base font-bold text-white truncate">{value}</p>
  </div>
);

/* ══════════════════════════════════════════════════
   1. POSITION SIZE CALCULATOR
══════════════════════════════════════════════════ */
const PositionSizer = () => {
  const [balance, setBalance] = useState("");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [lotValue, setLotValue] = useState("100000"); // standard forex lot

  const riskAmt = balance && riskPct ? (parseFloat(balance) * parseFloat(riskPct)) / 100 : 0;
  const pipRisk = entry && stop ? Math.abs(parseFloat(entry) - parseFloat(stop)) : 0;
  const lots = riskAmt && pipRisk && lotValue ? riskAmt / (pipRisk * parseFloat(lotValue)) : 0;
  const units = lots * parseFloat(lotValue || 1);

  const rrGood = riskPct <= 2;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3.5">
        <Input label="Account Balance" value={balance} onChange={setBalance} placeholder="10000" prefix="$" />
        <Input label="Risk per Trade" value={riskPct} onChange={setRiskPct} placeholder="1" suffix="%" min="0.1" step="0.1" />
        <Input label="Entry Price" value={entry} onChange={setEntry} placeholder="1.2050" step="0.00001" />
        <Input label="Stop Loss Price" value={stop} onChange={setStop} placeholder="1.2000" step="0.00001" />
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Instrument Type</label>
          <select
            value={lotValue}
            onChange={(e) => setLotValue(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 transition-all"
          >
            <option value="100000">Forex Standard Lot (100,000)</option>
            <option value="10000">Forex Mini Lot (10,000)</option>
            <option value="1000">Forex Micro Lot (1,000)</option>
            <option value="1">Crypto / Stock (1 unit)</option>
          </select>
        </div>
      </div>

      <div className="bg-black/30 border border-white/8 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Results</h3>
          <ResultRow label="Risk Amount" value={riskAmt ? `$${riskAmt.toFixed(2)}` : "—"} color={rrGood ? "text-emerald-400" : "text-red-400"} />
          <ResultRow label="Stop Distance (pips)" value={pipRisk ? pipRisk.toFixed(5) : "—"} />
          <ResultRow label="Lot Size" value={lots ? lots.toFixed(4) : "—"} color="text-blue-400" highlight />
          <ResultRow label="Units" value={units ? units.toLocaleString() : "—"} color="text-white" />
        </div>

        {/* Risk indicator */}
        {riskPct && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Risk Level</span>
              <span className={parseFloat(riskPct) <= 1 ? "text-emerald-400" : parseFloat(riskPct) <= 2 ? "text-yellow-400" : "text-red-400"}>
                {parseFloat(riskPct) <= 1 ? "Conservative" : parseFloat(riskPct) <= 2 ? "Moderate" : "Aggressive"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${Math.min((parseFloat(riskPct) / 5) * 100, 100)}%` }}
                transition={{ duration: 0.4 }}
                className={`h-full rounded-full ${parseFloat(riskPct) <= 1 ? "bg-emerald-400" : parseFloat(riskPct) <= 2 ? "bg-yellow-400" : "bg-red-400"}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   2. RISK / REWARD CALCULATOR
══════════════════════════════════════════════════ */
const RRCalculator = () => {
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [target, setTarget] = useState("");
  const [direction, setDirection] = useState("buy");

  const e = parseFloat(entry), s = parseFloat(stop), t = parseFloat(target);
  const risk = e && s ? Math.abs(e - s) : 0;
  const reward = e && t ? Math.abs(t - e) : 0;
  const rr = risk > 0 ? reward / risk : 0;
  const breakeven = rr > 0 ? ((1 / (1 + rr)) * 100) : 0;

  const rrColor = rr >= 2 ? "text-emerald-400" : rr >= 1 ? "text-yellow-400" : "text-red-400";

  // Visual price levels
  const levels = e && s && t ? [
    { label: "SL", price: s, color: "#f87171" },
    { label: "Entry", price: e, color: "#60a5fa" },
    { label: "TP", price: t, color: "#34d399" },
  ].sort((a, b) => a.price - b.price) : [];

  const priceRange = levels.length ? levels[levels.length - 1].price - levels[0].price : 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3.5">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Direction</label>
          <div className="flex gap-2">
            {["buy", "sell"].map((d) => (
              <button key={d} onClick={() => setDirection(d)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${direction === d
                  ? d === "buy" ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400" : "bg-red-500/20 border border-red-500/50 text-red-400"
                  : "bg-black/30 border border-white/10 text-gray-500 hover:text-white"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <Input label="Entry Price" value={entry} onChange={setEntry} placeholder="1.2050" step="0.00001" />
        <Input label="Stop Loss" value={stop} onChange={setStop} placeholder="1.2000" step="0.00001" />
        <Input label="Take Profit" value={target} onChange={setTarget} placeholder="1.2150" step="0.00001" />
      </div>

      <div className="flex flex-col gap-4">
        {/* RR Display */}
        <div className="bg-black/30 border border-white/8 rounded-xl p-5">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Results</h3>
          <div className="flex gap-3 mb-4">
            <StatBadge label="RR Ratio" value={rr ? `1 : ${rr.toFixed(2)}` : "—"} color={rr >= 2 ? "border-emerald-500/30" : rr >= 1 ? "border-yellow-500/30" : "border-white/10"} />
            <StatBadge label="Breakeven WR" value={breakeven ? `${breakeven.toFixed(1)}%` : "—"} color="border-white/10" />
          </div>
          <ResultRow label="Risk (pips/pts)" value={risk ? risk.toFixed(5) : "—"} color="text-red-400" />
          <ResultRow label="Reward (pips/pts)" value={reward ? reward.toFixed(5) : "—"} color="text-emerald-400" />
          <ResultRow label="RR Verdict" value={rr >= 2 ? "✅ Excellent" : rr >= 1.5 ? "👍 Good" : rr >= 1 ? "⚠️ Marginal" : rr > 0 ? "❌ Poor" : "—"}
            color={rrColor} highlight />
        </div>

        {/* Visual price ladder */}
        {levels.length === 3 && (
          <div className="bg-black/30 border border-white/8 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Price Levels</p>
            <div className="relative pl-6">
              {levels.map((l, i) => (
                <div key={i} className="flex items-center gap-3 mb-3 last:mb-0 relative">
                  <div className="absolute left-0 w-2 h-2 rounded-full" style={{ backgroundColor: l.color, top: "50%", transform: "translateY(-50%) translateX(-50%)" }} />
                  <div className="flex-1 h-px" style={{ backgroundColor: l.color, opacity: 0.3 }} />
                  <span className="text-xs font-mono" style={{ color: l.color }}>{l.label}: {l.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   3. COMPOUNDING GROWTH PROJECTOR
══════════════════════════════════════════════════ */
const CompoundingProjector = () => {
  const [balance, setBalance] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");
  const [rr, setRr] = useState("2");
  const [winRate, setWinRate] = useState("55");
  const [trades, setTrades] = useState("50");

  const simulate = useCallback(() => {
    const b = parseFloat(balance) || 0;
    const r = parseFloat(riskPct) / 100 || 0;
    const rrVal = parseFloat(rr) || 0;
    const wr = parseFloat(winRate) / 100 || 0;
    const n = Math.min(parseInt(trades) || 0, 200);

    let bal = b;
    const data = [{ trade: 0, balance: Math.round(bal) }];
    for (let i = 1; i <= n; i++) {
      const win = Math.random() < wr;
      bal = win ? bal * (1 + r * rrVal) : bal * (1 - r);
      data.push({ trade: i, balance: Math.round(bal) });
    }
    return data;
  }, [balance, riskPct, rr, winRate, trades]);

  const [chartData, setChartData] = useState(() => simulate());
  const expectedEdge = ((parseFloat(winRate) / 100) * parseFloat(rr) - (1 - parseFloat(winRate) / 100)).toFixed(3);
  const finalBal = chartData[chartData.length - 1]?.balance || 0;
  const pnl = finalBal - (parseFloat(balance) || 0);
  const pnlPct = parseFloat(balance) ? ((pnl / parseFloat(balance)) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Input label="Start Balance" value={balance} onChange={setBalance} placeholder="10000" prefix="$" />
        <Input label="Risk/Trade" value={riskPct} onChange={setRiskPct} placeholder="1" suffix="%" />
        <Input label="RR Ratio" value={rr} onChange={setRr} placeholder="2" suffix="R" />
        <Input label="Win Rate" value={winRate} onChange={setWinRate} placeholder="55" suffix="%" />
        <Input label="Trades" value={trades} onChange={setTrades} placeholder="50" />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          <StatBadge label="Edge (EV)" value={expectedEdge > 0 ? `+${expectedEdge}R` : `${expectedEdge}R`} color={expectedEdge > 0 ? "border-emerald-500/30" : "border-red-500/30"} />
          <StatBadge label="Final Balance" value={`$${finalBal.toLocaleString()}`} color={pnl >= 0 ? "border-emerald-500/30" : "border-red-500/30"} />
          <StatBadge label="Return" value={`${pnl >= 0 ? "+" : ""}${pnlPct}%`} color={pnl >= 0 ? "border-emerald-500/30" : "border-red-500/30"} />
        </div>
        <button onClick={() => setChartData(simulate())}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/8 hover:bg-white/15 text-sm text-gray-300 hover:text-white transition-all border border-white/10">
          <RefreshCw className="w-3.5 h-3.5" /> Resimulate
        </button>
      </div>

      <div className="bg-black/30 border border-white/8 rounded-xl p-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={pnl >= 0 ? "#34d399" : "#f87171"} stopOpacity={0.25} />
                <stop offset="95%" stopColor={pnl >= 0 ? "#34d399" : "#f87171"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="trade" tick={{ fill: "#4b5563", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4b5563", fontSize: 11 }} axisLine={false} tickLine={false} width={60}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(v) => [`$${v.toLocaleString()}`, "Balance"]}
            />
            <Area type="monotone" dataKey="balance" stroke={pnl >= 0 ? "#34d399" : "#f87171"}
              strokeWidth={2} fill="url(#balGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   4. LEVERAGE & MARGIN CALCULATOR
══════════════════════════════════════════════════ */
const MarginCalc = () => {
  const [balance, setBalance] = useState("");
  const [leverage, setLeverage] = useState("100");
  const [lotSize, setLotSize] = useState("1");
  const [lotUnits, setLotUnits] = useState("100000");
  const [assetPrice, setAssetPrice] = useState("1");

  const positionValue = parseFloat(lotSize) * parseFloat(lotUnits) * parseFloat(assetPrice) || 0;
  const marginRequired = parseFloat(leverage) > 0 ? positionValue / parseFloat(leverage) : 0;
  const freeMargin = (parseFloat(balance) || 0) - marginRequired;
  const marginLevel = balance && marginRequired ? ((parseFloat(balance) / marginRequired) * 100) : 0;
  const danger = marginLevel > 0 && marginLevel < 150;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3.5">
        <Input label="Account Balance" value={balance} onChange={setBalance} placeholder="5000" prefix="$" />
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Leverage</label>
          <select value={leverage} onChange={(e) => setLeverage(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 transition-all">
            {["10","20","30","50","100","200","500"].map(l => <option key={l} value={l}>1:{l}</option>)}
          </select>
        </div>
        <Input label="Lot Size" value={lotSize} onChange={setLotSize} placeholder="0.1" step="0.01" />
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Lot Type</label>
          <select value={lotUnits} onChange={(e) => setLotUnits(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 transition-all">
            <option value="100000">Standard (100,000)</option>
            <option value="10000">Mini (10,000)</option>
            <option value="1000">Micro (1,000)</option>
          </select>
        </div>
        <Input label="Asset Price (base in USD)" value={assetPrice} onChange={setAssetPrice} placeholder="1.0" step="0.0001" />
      </div>

      <div className="bg-black/30 border border-white/8 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Results</h3>
          <ResultRow label="Position Value" value={positionValue ? `$${positionValue.toLocaleString()}` : "—"} />
          <ResultRow label="Margin Required" value={marginRequired ? `$${marginRequired.toFixed(2)}` : "—"} color="text-yellow-400" />
          <ResultRow label="Free Margin" value={freeMargin ? `$${freeMargin.toFixed(2)}` : "—"} color={freeMargin >= 0 ? "text-emerald-400" : "text-red-400"} highlight />
          <ResultRow label="Margin Level" value={marginLevel ? `${marginLevel.toFixed(0)}%` : "—"} color={danger ? "text-red-400" : "text-emerald-400"} />
        </div>

        {marginLevel > 0 && (
          <div className="mt-4 p-3 rounded-lg border text-xs leading-relaxed"
            style={{ borderColor: danger ? "rgba(248,113,113,0.3)" : "rgba(52,211,153,0.3)", color: danger ? "#f87171" : "#6b7280" }}>
            {danger
              ? "⚠️ Margin level below 150% — risk of margin call. Reduce lot size or add balance."
              : "✅ Margin level healthy. Monitor if price moves against you significantly."}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   5. PIP VALUE CALCULATOR
══════════════════════════════════════════════════ */
const PipValueCalc = () => {
  const [pair, setPair] = useState("EURUSD");
  const [lotSize, setLotSize] = useState("1");
  const [lotType, setLotType] = useState("100000");
  const [accountCurrency, setAccountCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState("1");

  // Standard pip = 0.0001 for most pairs, 0.01 for JPY pairs
  const isJpy = pair.includes("JPY");
  const pipSize = isJpy ? 0.01 : 0.0001;
  const units = parseFloat(lotSize) * parseFloat(lotType) || 0;
  const pipValueInQuote = units * pipSize;
  // Convert to account currency
  const pipValueInAcct = pipValueInQuote / parseFloat(exchangeRate || 1);
  const pipValue10 = pipValueInAcct * 10;
  const pipValue100 = pipValueInAcct * 100;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3.5">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Currency Pair</label>
          <select value={pair} onChange={(e) => setPair(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 transition-all">
            {["EURUSD","GBPUSD","USDJPY","USDCHF","AUDUSD","NZDUSD","USDCAD","EURJPY","GBPJPY","XAUUSD"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <Input label="Lot Size" value={lotSize} onChange={setLotSize} placeholder="1" step="0.01" />
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Lot Type</label>
          <select value={lotType} onChange={(e) => setLotType(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 transition-all">
            <option value="100000">Standard (1.0 lot)</option>
            <option value="10000">Mini (0.1 lot)</option>
            <option value="1000">Micro (0.01 lot)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Account Currency</label>
          <select value={accountCurrency} onChange={(e) => setAccountCurrency(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 transition-all">
            {["USD","EUR","GBP","JPY","AUD","CAD","CHF"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Quote/Account Rate (if not USD acct)" value={exchangeRate} onChange={setExchangeRate} placeholder="1.00" step="0.0001" />
      </div>

      <div className="bg-black/30 border border-white/8 rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Results</h3>
        <ResultRow label="Pip Size" value={isJpy ? "0.01" : "0.0001"} />
        <ResultRow label="Units Traded" value={units ? units.toLocaleString() : "—"} />
        <ResultRow label="Pip Value (1 pip)" value={pipValueInAcct ? `${accountCurrency} ${pipValueInAcct.toFixed(2)}` : "—"} color="text-blue-400" highlight />
        <ResultRow label="Value of 10 pips" value={pipValue10 ? `${accountCurrency} ${pipValue10.toFixed(2)}` : "—"} color="text-white" />
        <ResultRow label="Value of 100 pips" value={pipValue100 ? `${accountCurrency} ${pipValue100.toFixed(2)}` : "—"} color="text-white" />

        <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-xs text-gray-400">
          💡 For USD account with USD as quote currency, exchange rate = 1. For EUR/USD with EUR account, use 1/rate.
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   6. WIN RATE / EXPECTANCY CALCULATOR
══════════════════════════════════════════════════ */
const ExpectancyCalc = () => {
  const [wins, setWins] = useState("");
  const [losses, setLosses] = useState("");
  const [avgWin, setAvgWin] = useState("");
  const [avgLoss, setAvgLoss] = useState("");

  const totalTrades = (parseFloat(wins) || 0) + (parseFloat(losses) || 0);
  const winRate = totalTrades ? ((parseFloat(wins) || 0) / totalTrades) * 100 : 0;
  const lossRate = 100 - winRate;
  const rr = avgWin && avgLoss ? parseFloat(avgWin) / parseFloat(avgLoss) : 0;
  const expectancy = avgWin && avgLoss && totalTrades
    ? ((winRate / 100) * parseFloat(avgWin)) - ((lossRate / 100) * parseFloat(avgLoss))
    : 0;
  const monthlyEst = expectancy * totalTrades;
  const isPositive = expectancy > 0;

  // Win rate distribution bar
  const segments = totalTrades > 0 ? [
    { pct: winRate, color: "#34d399", label: "Wins" },
    { pct: lossRate, color: "#f87171", label: "Losses" },
  ] : [];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Winning Trades" value={wins} onChange={setWins} placeholder="55" />
          <Input label="Losing Trades" value={losses} onChange={setLosses} placeholder="45" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Avg Win ($)" value={avgWin} onChange={setAvgWin} placeholder="200" prefix="$" />
          <Input label="Avg Loss ($)" value={avgLoss} onChange={setAvgLoss} placeholder="100" prefix="$" />
        </div>

        {segments.length > 0 && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Wins: {winRate.toFixed(1)}%</span>
              <span>Losses: {lossRate.toFixed(1)}%</span>
            </div>
            <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
              {segments.map((s, i) => (
                <motion.div key={i} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.5 }}
                  className="h-full rounded-full" style={{ backgroundColor: s.color }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-black/30 border border-white/8 rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Results</h3>
        <ResultRow label="Total Trades" value={totalTrades || "—"} />
        <ResultRow label="Win Rate" value={winRate ? `${winRate.toFixed(1)}%` : "—"} color={winRate >= 50 ? "text-emerald-400" : "text-yellow-400"} />
        <ResultRow label="RR Ratio" value={rr ? `1 : ${rr.toFixed(2)}` : "—"} />
        <ResultRow label="Expectancy / Trade" value={expectancy ? `$${expectancy.toFixed(2)}` : "—"}
          color={isPositive ? "text-emerald-400" : "text-red-400"} highlight />
        <ResultRow label="Est. Profit (same sample)" value={monthlyEst ? `$${monthlyEst.toFixed(0)}` : "—"}
          color={monthlyEst >= 0 ? "text-white" : "text-red-400"} />

        {expectancy !== 0 && (
          <div className={`mt-4 p-3 rounded-lg border text-xs leading-relaxed ${isPositive ? "border-emerald-500/20 text-emerald-400/80" : "border-red-500/20 text-red-400/80"}`}>
            {isPositive
              ? `✅ Positive expectancy (+$${expectancy.toFixed(2)}/trade). This system is statistically profitable — protect it with strict discipline.`
              : `❌ Negative expectancy ($${expectancy.toFixed(2)}/trade). Improve win rate or increase reward:risk ratio before trading live.`}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
const tabs = [
  { key: "position", label: "Position Size", icon: Scale, color: "text-emerald-400", desc: "Calculate exact lot size based on your risk" },
  { key: "rr", label: "Risk / Reward", icon: Target, color: "text-cyan-400", desc: "Visualise your trade's RR and breakeven rate" },
  { key: "compound", label: "Equity Growth", icon: TrendingUp, color: "text-blue-400", desc: "Monte Carlo simulation of your trading edge" },
  { key: "margin", label: "Leverage & Margin", icon: Layers, color: "text-yellow-400", desc: "Margin required and free margin check" },
  { key: "pip", label: "Pip Value", icon: DollarSign, color: "text-purple-400", desc: "Monetary value of pips per lot size" },
  { key: "expectancy", label: "Expectancy", icon: BarChart2, color: "text-pink-400", desc: "Strategy expectancy from your trade history" },
];

const CalculatorPage = () => {
  const [active, setActive] = useState("position");
  const activeTab = tabs.find((t) => t.key === active);

  const renderCalc = () => {
    switch (active) {
      case "position": return <PositionSizer />;
      case "rr": return <RRCalculator />;
      case "compound": return <CompoundingProjector />;
      case "margin": return <MarginCalc />;
      case "pip": return <PipValueCalc />;
      case "expectancy": return <ExpectancyCalc />;
      default: return <PositionSizer />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Trading Calculators</h1>
          <p className="text-gray-500 text-sm">Professional tools for disciplined risk management</p>
        </motion.div>

        {/* Tab Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-7">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setActive(t.key)}
                className={`flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl border text-center transition-all duration-200 ${
                  active === t.key
                    ? "bg-white/8 border-white/20 shadow-lg"
                    : "border-white/6 hover:border-white/15 hover:bg-white/4"
                }`}>
                <Icon className={`w-4.5 h-4.5 ${active === t.key ? t.color : "text-gray-600"}`} size={18} />
                <span className={`text-xs font-medium leading-tight ${active === t.key ? "text-white" : "text-gray-500"}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Calculator Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-black/40 border border-white/8`}>
                  {activeTab && <activeTab.icon className={`w-4.5 h-4.5 ${activeTab.color}`} size={18} />}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">{activeTab?.label}</h2>
                  <p className="text-xs text-gray-500">{activeTab?.desc}</p>
                </div>
              </div>
            </div>

            {renderCalc()}
          </motion.div>
        </AnimatePresence>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-700 mt-6">
          All calculations are for educational purposes. Always verify with your broker before trading.
        </p>
      </div>
    </div>
  );
};

export default CalculatorPage;
