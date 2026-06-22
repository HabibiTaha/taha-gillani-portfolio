import React, { useState, useEffect } from 'react';

const API_URL = "https://pjmzyckvkh.execute-api.ca-west-1.amazonaws.com/market-data";

export default function MarketDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to communicate with AWS API Gateway");
      
      const result = await response.json();
      if (result.status === "success") {
        setData(result.records);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[650px] mx-auto p-6 bg-[#09090b] text-[#00f2ff] border border-[#27272a] rounded-lg shadow-2xl font-mono text-xs flex flex-col gap-3">
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
      <div className="w-full max-w-[650px] mx-auto p-6 bg-[#09090b] text-[#ff4545] border border-[#ff4545]/30 rounded-lg shadow-2xl font-mono text-xs flex flex-col gap-3">
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

  return (
    <div className="w-full max-w-[650px] mx-auto bg-[#09090b] text-[#fafafa] border border-[#27272a] rounded-lg shadow-2xl overflow-hidden font-mono text-xs" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.9)' }}>
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
          onClick={fetchMarketData} 
          className="px-3 py-1.5 bg-[#18181b] text-[#00f2ff] border border-[#00f2ff]/30 hover:border-[#00f2ff] hover:bg-[#00f2ff]/5 hover:shadow-[0_0_10px_rgba(0,242,255,0.2)] rounded text-[10px] font-bold tracking-widest cursor-pointer transition-all duration-300 active:scale-95 uppercase"
        >
          SYNC DATA
        </button>
      </div>

      {/* Terminal Content / Table Grid */}
      <div className="p-5 flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272a] text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider">
                <th className="pb-2 font-semibold">ASSET</th>
                <th className="pb-2 text-right font-semibold">PRICE (USD)</th>
                <th className="pb-2 text-right font-semibold">24H VOLUME</th>
                <th className="pb-2 text-center font-semibold w-28">VU-METER</th>
                <th className="pb-2 text-right font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 2).map((item, idx) => {
                const rawVol = parseFloat(item.Volume) || 0;
                const maxVolScale = item.AssetType === 'BTC-USD' ? 30000000000 : 10000000000;
                const visualizerPercentage = Math.min(Math.round((rawVol / maxVolScale) * 100), 100);

                return (
                  <tr key={idx} className="border-b border-[#18181b]/50 hover:bg-[#18181b]/20 transition-all duration-150">
                    {/* Asset Name */}
                    <td className="py-3.5 font-bold text-[#fafafa] tracking-wide text-[10px]">
                      {item.AssetType}
                    </td>
                    {/* Price */}
                    <td className="py-3.5 text-right font-semibold text-[#00f2ff] tracking-wide text-[10px]">
                      ${parseFloat(item.Price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    {/* Volume */}
                    <td className="py-3.5 text-right text-[#a1a1aa] text-[10px]">
                      ${rawVol.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    {/* VU Meter */}
                    <td className="py-3.5 px-4 text-center">
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
                    <td className="py-3.5 text-right">
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
      </div>
      
      {/* Terminal Footer */}
      <div className="px-5 py-2.5 bg-[#18181b]/30 border-t border-[#27272a] flex justify-between items-center text-[8px] text-[#a1a1aa] tracking-widest uppercase">
        <span>SYS: SECURE // API_GATEWAY: OK</span>
        <span>NODE: AWS-CA-WEST-1 | CALGARY</span>
      </div>
    </div>
  );
}
