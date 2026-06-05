'use client';
import { useEffect, useRef, useState } from 'react';
import type { MapDataPoint } from '@/lib/api';

interface ScamMapProps {
  data: MapDataPoint[];
  onFilterChange?: (days: number | null) => void;
}

const RISK_COLORS: Record<string, string> = {
  CRITICAL:    '#DC2626',
  LIKELY_SCAM: '#D97706',
  SUSPICIOUS:  '#CA8A04',
  SAFE:        '#16A34A',
};

export function ScamMap({ data, onFilterChange }: ScamMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const heatLayerRef = useRef<boolean>(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number | null>(30);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<MapDataPoint | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) { console.warn('Missing NEXT_PUBLIC_MAPBOX_TOKEN'); return; }

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-98.5795, 39.8283],
        zoom: 3.5,
        projection: { name: 'mercator' } as any,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-right');

      map.on('load', () => {
        // State boundaries
        map.addSource('states', {
          type: 'geojson',
          data: 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
        });
        map.addLayer({
          id: 'state-borders',
          type: 'line',
          source: 'states',
          paint: { 'line-color': '#1E3A5F', 'line-width': 1, 'line-opacity': 0.8 },
        });

        // Heatmap source
        map.addSource('scam-heat', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({
          id: 'scam-heatmap',
          type: 'heatmap',
          source: 'scam-heat',
          maxzoom: 9,
          layout: { visibility: 'none' },
          paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'count'], 0, 0, 100, 1],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(30,58,95,0)', 0.2, '#1E3A5F', 0.4, '#2563EB',
              0.6, '#D97706', 0.8, '#DC2626', 1, '#7F1D1D'
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 20, 9, 40],
            'heatmap-opacity': 0.7,
          },
        });

        setMapLoaded(true);
        mapRef.current = map;
      });
    });

    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      // Clear existing markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const heatFeatures: any[] = [];

      data.forEach(point => {
        const color = RISK_COLORS[point.risk_level] || '#2563EB';
        const radius = Math.min(8 + Math.log2(point.incident_count + 1) * 4, 32);

        // Custom marker element
        const el = document.createElement('div');
        el.style.cssText = `
          width: ${radius * 2}px; height: ${radius * 2}px;
          border-radius: 50%; background: ${color}33;
          border: 2px solid ${color}; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s;
        `;
        const inner = document.createElement('div');
        inner.style.cssText = `
          width: ${radius}px; height: ${radius}px;
          border-radius: 50%; background: ${color};
        `;
        el.appendChild(inner);

        el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.2)'; });
        el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

        const popup = new mapboxgl.Popup({
          offset: 25,
          className: 'scam-popup',
          closeButton: true,
        }).setHTML(`
          <div style="background:#162232;border:1px solid #1E3A5F;border-radius:8px;padding:12px;min-width:200px;color:white;font-family:monospace;">
            <div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Area Code ${point.area_code}</div>
            <div style="display:grid;gap:4px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#94a3b8">City/State</span>
                <span>${point.city || ''}, ${point.state}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#94a3b8">Incidents</span>
                <span style="color:${color};font-weight:bold">${point.incident_count.toLocaleString()}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#94a3b8">Risk Level</span>
                <span style="color:${color}">${point.risk_level.replace('_',' ')}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#94a3b8">Top Signal</span>
                <span>${point.top_signal}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#94a3b8">Last Seen</span>
                <span>${new Date(point.last_seen).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([point.lng, point.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);

        heatFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [point.lng, point.lat] },
          properties: { count: point.incident_count },
        });
      });

      // Update heatmap source
      const src = map.getSource('scam-heat') as any;
      if (src) src.setData({ type: 'FeatureCollection', features: heatFeatures });
    });
  }, [data, mapLoaded]);

  // Toggle heatmap layer
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    if (map.getLayer('scam-heatmap')) {
      map.setLayoutProperty('scam-heatmap', 'visibility', showHeatmap ? 'visible' : 'none');
    }
  }, [showHeatmap, mapLoaded]);

  const timeFilters = [
    { label: '7d',  days: 7 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
    { label: 'All', days: null },
  ];

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />

      {/* Time filter */}
      <div className="absolute top-4 left-4 z-10 flex gap-1 bg-[#0F1923]/90 border border-[#1E3A5F] rounded-lg p-1 backdrop-blur-sm">
        {timeFilters.map(f => (
          <button
            key={f.label}
            onClick={() => { setSelectedDays(f.days); onFilterChange?.(f.days); }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
              selectedDays === f.days
                ? 'bg-[#2563EB] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#1E3A5F]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Heatmap toggle */}
      <div className="absolute top-4 right-14 z-10">
        <button
          onClick={() => setShowHeatmap(h => !h)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors backdrop-blur-sm ${
            showHeatmap
              ? 'bg-[#2563EB] border-[#2563EB] text-white'
              : 'bg-[#0F1923]/90 border-[#1E3A5F] text-gray-400 hover:text-white'
          }`}
        >
          🔥 Heatmap
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-10 bg-[#0F1923]/90 border border-[#1E3A5F] rounded-lg p-3 backdrop-blur-sm">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Risk Level</p>
        {[
          { level: 'CRITICAL',    color: '#DC2626', label: 'Critical (90+)' },
          { level: 'LIKELY_SCAM', color: '#D97706', label: 'Likely Scam (70-89)' },
          { level: 'SUSPICIOUS',  color: '#CA8A04', label: 'Suspicious (40-69)' },
        ].map(item => (
          <div key={item.level} className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-xs text-gray-300">{item.label}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-[#1E3A5F]">
          <p className="text-gray-500 text-xs">Marker size = incident count</p>
        </div>
      </div>

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F1923] rounded-xl">
          <div className="text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
