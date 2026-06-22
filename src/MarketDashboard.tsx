import { useState, useEffect } from 'react';

const API_URL = "https://pjmzyckvkh.execute-api.ca-west-1.amazonaws.com/market-data";

// Helper to pre-generate realistic historic prices based on current price
const generateMockHistory = (currentPrice: number): number[] => {
  const points = 20;
  const history: number[] = [];
  let price = currentPrice * 0.985; // start slightly lower
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.45) * currentPrice * 0.003;
    price = price + change;
    history.push(price);
  }
  history[points - 1] = currentPrice;
  return history;
};

export default function MarketDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC-USD');
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>({});

  const fetchMarketData = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setSyncing(true);
      }
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to communicate with AWS API Gateway");
      
      const result = await response.json();
      if (result.status === "success") {
        setData(result.records);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchMarketData(true);
  }, []);

  // Sync priceHistory whenever data changes
  useEffect(() => {
    if (data.length > 0) {
      const newHistory = { ...priceHistory };
      let updated = false;

      data.forEach(item => {
        const price = parseFloat(item.Price) || 0;
        if (!newHistory[item.AssetType]) {
          newHistory[item.AssetType] = generateMockHistory(price);
          updated = true;
        } else {
          const currentArr = newHistory[item.AssetType];
          if (currentArr[currentArr.length - 1] !== price) {
            const updatedArr = [...currentArr, price];
            if (updatedArr.length > 20) updatedArr.shift();
            newHistory[item.AssetType] = updatedArr;
            updated = true;
          }
        }
      });

      if (updated) {
        setPriceHistory(newHistory);
      }

      if (!data.some(item => item.AssetType === selectedAsset)) {
        setSelectedAsset(data[0].AssetType);
      }
    }
  }, [data]);

  // Simulate real-time price fluctuations every 4 seconds to animate the graph
  useEffect(() => {
    if (loading || error || data.length === 0) return;

    const interval = setInterval(() => {
      setData(prevData => {
        return prevData.map(item => {
          const currentPrice = parseFloat(item.Price) || 0;
          // Fluctuate by random percentage between -0.15% and +0.15%
          const pct = (Math.random() - 0.48) * 0.003; 
          const newPrice = currentPrice * (1 + pct);
          return {
            ...item,
            Price: newPrice.toFixed(2)
          };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [loading, error, data.length]);

  if (loading) {
    return (
      <div className="w-full max-w-[850px] mx-auto p-6 bg-[#09090b] text-[#00f2ff] border border-[#27272a] rounded-lg shadow-2xl font-mono text-xs flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-[#27272a] pb-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff4545] opacity-60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffb800] opacity-60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88] opacity-60"></div>
          </div>
          <span className="text-[10px] tracking-wider opacity-60">SYS: CONNECTING...</span>
        </div>
        <div className="py-8 text-center animate-pulse tracking-widest text-[10px] uppercase">
          INITIALIZING CONNECTION TO CA-WEST-1...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[850px] mx-auto p-6 bg-[#09090b] text-[#ff4545] border border-[#ff4545]/30 rounded-lg shadow-2xl font-mono text-xs flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-[#ff4545]/20 pb-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff4545]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffb800] opacity-60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88] opacity-60"></div>
          </div>
          <span className="text-[10px] tracking-wider text-[#ff4545] font-bold">SYSTEM ERROR</span>
        </div>
        <div className="py-6 text-center text-sm uppercase tracking-wide">
          {error}
        </div>
      </div>
    );
  }

  // Get coordinates for SVG graph
  const history = priceHistory[selectedAsset] || [];
  const minPrice = history.length > 0 ? Math.min(...history) : 0;
  const maxPrice = history.length > 0 ? Math.max(...history) : 100;
  const priceRange = maxPrice - minPrice || 1;

  const pointsStr = history.map((p, i) => {
    const x = (i / (history.length - 1)) * 560;
    const y = 135 - ((p - minPrice) / priceRange) * 115;
    return `${x},${y}`;
  });
  const linePath = history.length > 0 ? `M ${pointsStr.join(' L ')}` : '';
  const areaPath = history.length > 0 ? `${linePath} L 560,150 L 0,150 Z` : '';

  const activeItem = data.find(item => item.AssetType === selectedAsset);

  return (
    <div className="w-full max-w-[850px] mx-auto bg-[#09090b] text-[#fafafa] border border-[#27272a] rounded-lg shadow-2xl overflow-hidden font-mono text-xs" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.9)' }}>
      {/* Terminal Title Bar */}
      <div className="flex justify-between items-center px-5 py-3.5 bg-[#18181b]/50 border-b border-[#27272a] backdrop-blur-md">
        <div className="flex items-center gap-4">
          {/* macOS Style Controls */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff4545]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffb800]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]"></div>
          </div>
          <div className="border-l border-[#27272a] pl-4">
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#fafafa] uppercase">
              CRYPTO CLOUD LIVE FEED
            </h2>
            <div className="text-[8px] text-[#a1a1aa] tracking-widest mt-0.5 uppercase">
              UPDATES EVERY 5 MINUTES
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => fetchMarketData(false)} 
          disabled={syncing}
          className={`px-3 py-1.5 bg-[#18181b] text-[#00f2ff] border border-[#00f2ff]/30 hover:border-[#00f2ff] hover:bg-[#00f2ff]/5 hover:shadow-[0_0_10px_rgba(0,242,255,0.2)] rounded text-[10px] font-bold tracking-widest cursor-pointer transition-all duration-300 active:scale-95 uppercase ${syncing ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
        >
          {syncing ? 'SYNCING...' : 'SYNC DATA'}
        </button>
      </div>

      {/* Terminal Content Grid */}
      <div className="p-5 flex flex-col gap-6">
        
        {/* Assets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272a] text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider">
                <th className="pb-2 font-semibold">ASSET</th>
                <th className="pb-2 text-right font-semibold">PRICE (USD)</th>
                <th className="pb-2 text-right font-semibold">24H VOLUME</th>
                <th className="pb-2 text-center font-semibold w-32">VU-METER</th>
                <th className="pb-2 text-right font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 2).map((item, idx) => {
                const rawVol = parseFloat(item.Volume) || 0;
                const maxVolScale = item.AssetType === 'BTC-USD' ? 30000000000 : 10000000000;
                const visualizerPercentage = Math.min(Math.round((rawVol / maxVolScale) * 100), 100);
                const isSelected = selectedAsset === item.AssetType;

                return (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedAsset(item.AssetType)}
                    className={`border-b border-[#18181b]/50 hover:bg-[#18181b]/30 transition-all duration-150 cursor-pointer ${
                      isSelected ? 'bg-[#00f2ff]/5 border-l-2 border-l-[#00f2ff]' : 'border-l-2 border-l-transparent'
                    }`}
                  >
                    {/* Asset Name */}
                    <td className="py-4 pl-2 font-bold text-[#fafafa] tracking-wide text-[11px]">
                      {item.AssetType}
                    </td>
                    {/* Price */}
                    <td className="py-4 text-right font-semibold text-[#00f2ff] tracking-wide text-[11px]">
                      ${parseFloat(item.Price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    {/* Volume */}
                    <td className="py-4 text-right text-[#a1a1aa] text-[10px]">
                      ${rawVol.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    {/* VU Meter */}
                    <td className="py-4 px-4 text-center">
                      <div className="w-full h-2 bg-[#09090b] rounded-sm overflow-hidden border border-[#27272a] p-[1px]">
                        <div 
                          className="h-full bg-gradient-to-r from-[#004d40] to-[#00ff88] rounded-sm"
                          style={{ 
                            width: `${visualizerPercentage}%`,
                            boxShadow: '0 0 6px rgba(0,255,136,0.3)',
                            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                          }} 
                        />
                      </div>
                    </td>
                    {/* Status */}
                    <td className="py-4 text-right pr-2">
                      <span className="inline-flex items-center gap-1.5 text-[#00ff88] text-[9px] font-bold tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                        LIVE
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Sparkline Area Chart */}
        {activeItem && history.length > 0 && (
          <div className="border border-[#27272a] bg-[#18181b]/20 rounded p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] text-[#a1a1aa]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#fafafa]">{selectedAsset} INTRADAY TREND</span>
              </div>
              <div className="flex gap-3 text-[9px]">
                <span className="text-[#00ff88]">HIGH: ${maxPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className="text-[#ff4545]">LOW: ${minPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* SVG Graph */}
            <div className="w-full h-36 mt-1 relative overflow-hidden flex items-end">
              <svg className="w-full h-full" viewBox="0 0 560 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#00f2ff" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="15" x2="560" y2="15" stroke="#1f1f23" strokeWidth="0.5" strokeDasharray="3 3"/>
                <line x1="0" y1="75" x2="560" y2="75" stroke="#1f1f23" strokeWidth="0.5" strokeDasharray="3 3"/>
                <line x1="0" y1="135" x2="560" y2="135" stroke="#1f1f23" strokeWidth="0.5" strokeDasharray="3 3"/>

                {/* Filled Gradient Area */}
                <path d={areaPath} fill="url(#chart-glow)"/>

                {/* Line Path */}
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="#00f2ff" 
                  strokeWidth="2" 
                  style={{ filter: 'drop-shadow(0 0 3px rgba(0, 242, 255, 0.4))' }}
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Terminal Footer */}
      <div className="px-5 py-2.5 bg-[#18181b]/30 border-t border-[#27272a] flex justify-end items-center text-[8px] text-[#a1a1aa] tracking-widest uppercase">
        <span>NODE: AWS-CA-WEST-1 | CALGARY</span>
      </div>
    </div>
  );
}
