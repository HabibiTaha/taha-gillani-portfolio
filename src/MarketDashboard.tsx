import { useState, useEffect } from 'react';

const API_URL = "https://pjmzyckvkh.execute-api.ca-west-1.amazonaws.com/market-data";

export default function MarketDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
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
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  if (loading) return <div style={{ padding: '20px', color: '#00ffcc', fontFamily: 'monospace' }}>INITIALIZING CONNECTION TO CA-WEST-1...</div>;
  if (error) return <div style={{ padding: '20px', color: '#ff6b6b' }}>SYSTEM ERROR: {error}</div>;

  return (
    <div style={{ padding: '25px', backgroundColor: '#0a0a0a', color: '#fff', borderRadius: '12px', border: '1px solid #333', maxWidth: '650px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '2px', color: '#e0e0e0' }}>LIVE CLOUD DATA FEED</h2>
        <button onClick={fetchMarketData} style={{ padding: '8px 16px', background: '#1a1a1a', color: '#00ffcc', border: '1px solid #00ffcc', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', transition: 'all 0.2s' }}>
          SYNC DATA
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {data.slice(0, 2).map((item, idx) => {
          const rawVol = parseFloat(item.Volume) || 0;
          const maxVolScale = item.AssetType === 'BTC-USD' ? 30000000000 : 10000000000;
          const visualizerPercentage = Math.min(Math.round((rawVol / maxVolScale) * 100), 100);

          return (
            <div key={idx} style={{ background: '#141414', padding: '18px', borderRadius: '8px', borderLeft: '5px solid #00ffcc', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '800', letterSpacing: '1px', fontSize: '1.1rem' }}>{item.AssetType}</span>
                <span style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  ${parseFloat(item.Price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '6px', letterSpacing: '1px' }}>24H VOL / VU-METER</div>
              <div style={{ width: '100%', height: '14px', background: '#000', borderRadius: '4px', overflow: 'hidden', border: '1px solid #222' }}>
                <div style={{ 
                  width: `${visualizerPercentage}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #004d40, #00ffcc)', 
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#555', marginTop: '6px', fontFamily: 'monospace' }}>
                <span>MIN</span>
                <span>${rawVol.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '0.7rem', color: '#444', textAlign: 'right', fontFamily: 'monospace', letterSpacing: '1px' }}>
        NODE: AWS-CA-WEST-1 | CALGARY
      </div>
    </div>
  );
}
