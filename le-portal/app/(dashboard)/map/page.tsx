'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getMapData, type MapDataPoint } from '@/lib/api';
import { areaCodeCoordinates } from '@/lib/areaCodeCoordinates';

const ScamMap = dynamic(() => import('@/components/ScamMap').then(m => ({ default: m.ScamMap })), { ssr: false });

export default function MapPage() {
  const [rawData, setRawData] = useState<MapDataPoint[]>([]);
  const [data, setData] = useState<MapDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<number | null>(30);
  const [stats, setStats] = useState({ total: 0, critical: 0, states: new Set<string>() });

  const fetchData = async (d: number | null) => {
    try {
      const raw = await getMapData(d ?? undefined);
      // Enrich with coordinates from local map if missing
      const enriched = raw.map(point => {
        const coords = areaCodeCoordinates[point.area_code];
        return coords ? { ...point, lat: coords.lat, lng: coords.lng, city: coords.city } : point;
      }).filter(p => p.lat && p.lng);
      setData(enriched);
      const crit = enriched.filter(p => p.risk_level === 'CRITICAL').length;
      const states = new Set(enriched.map(p => p.state));
      setStats({ total: enriched.reduce((s, p) => s + p.incident_count, 0), critical: crit, states });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(days); }, []);

  const handleFilterChange = (d: number | null) => {
    setDays(d);
    setLoading(true);
    fetchData(d);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1E3A5F] flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">🗺️ GPS Scam Heat Map</h1>
          <p className="text-gray-500 text-sm">Real-time scam call origin mapping by area code</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-white font-mono">{data.length}</p>
            <p className="text-gray-500 text-xs">Active Zones</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400 font-mono">{stats.critical}</p>
            <p className="text-gray-500 text-xs">Critical</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white font-mono">{stats.total.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">Total Incidents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#2563EB] font-mono">{stats.states.size}</p>
            <p className="text-gray-500 text-xs">States</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-[#162232] rounded-xl">
            <div className="text-center">
              <div className="text-5xl mb-4 animate-pulse">🗺️</div>
              <p className="text-gray-400">Loading map data...</p>
            </div>
          </div>
        ) : (
          <ScamMap data={data} onFilterChange={handleFilterChange} />
        )}
      </div>
    </div>
  );
}
