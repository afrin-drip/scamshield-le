'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AREA_CODE_COORDINATES } from '@/lib/areaCodeCoordinates';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface MapIncident {
  areaCode: string;
  count: number;
  maxScore: number;
  topSignal: string;
  lastSeen: string;
}

interface ScamMapProps {
  incidents: MapIncident[];
  className?: string;
}

const SOURCE_ID = 'incidents';
const CIRCLE_LAYER = 'incidents-circle';
const HEAT_LAYER = 'incidents-heat';
const LABEL_LAYER = 'incidents-label';

export default function ScamMap({ incidents, className = '' }: ScamMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  // Build GeoJSON from incidents
  const buildGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = [];
    for (const inc of incidents) {
      const coords = AREA_CODE_COORDINATES[inc.areaCode];
      if (!coords) continue;
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [coords.lng, coords.lat] },
        properties: {
          areaCode: inc.areaCode,
          count: inc.count,
          maxScore: inc.maxScore,
          topSignal: inc.topSignal,
          lastSeen: inc.lastSeen,
          city: coords.city,
          state: coords.state,
        },
      });
    }
    return { type: 'FeatureCollection', features };
  }, [incidents]);

  // Init map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5795, 39.8283],
      zoom: 3.5,
      attributionControl: false,
    });
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    map.current.on('load', () => setMapReady(true));
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add / update layers when map ready or data changes
  useEffect(() => {
    if (!mapReady || !map.current) return;
    const m = map.current;
    const geojson = buildGeoJSON();

    // Remove old layers/source
    [HEAT_LAYER, CIRCLE_LAYER, LABEL_LAYER].forEach(l => { if (m.getLayer(l)) m.removeLayer(l); });
    if (m.getSource(SOURCE_ID)) m.removeSource(SOURCE_ID);

    m.addSource(SOURCE_ID, { type: 'geojson', data: geojson });

    // Heatmap layer
    m.addLayer({
      id: HEAT_LAYER,
      type: 'heatmap',
      source: SOURCE_ID,
      maxzoom: 9,
      paint: {
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'count'], 0, 0, 200, 1],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)',
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
        'heatmap-opacity': showHeatmap ? 0.8 : 0,
      },
    });

    // Circle layer
    m.addLayer({
      id: CIRCLE_LAYER,
      type: 'circle',
      source: SOURCE_ID,
      paint: {
        'circle-color': [
          'interpolate', ['linear'], ['get', 'maxScore'],
          0, '#22c55e',
          30, '#eab308',
          60, '#f97316',
          85, '#ef4444',
          100, '#991b1b',
        ],
        'circle-radius': [
          'interpolate', ['linear'], ['get', 'count'],
          1, 4,
          10, 8,
          50, 12,
          200, 20,
        ],
        'circle-opacity': showMarkers ? 0.85 : 0,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': 'rgba(255,255,255,0.3)',
        'circle-stroke-opacity': showMarkers ? 1 : 0,
      },
    });

    // Label layer
    m.addLayer({
      id: LABEL_LAYER,
      type: 'symbol',
      source: SOURCE_ID,
      minzoom: 5,
      layout: {
        'text-field': ['get', 'areaCode'],
        'text-size': 10,
        'text-offset': [0, -1.8],
        'text-anchor': 'bottom',
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': 'rgba(0,0,0,0.7)',
        'text-halo-width': 1,
        'text-opacity': showMarkers ? 1 : 0,
      },
    });

    // Popup on click
    m.on('click', CIRCLE_LAYER, (e) => {
      const feat = e.features?.[0];
      if (!feat) return;
      const p = feat.properties as Record<string, unknown>;
      const lastSeen = new Date(p.lastSeen as string).toLocaleString();
      const score = Number(p.maxScore);
      const scoreColor = score >= 85 ? '#ef4444' : score >= 60 ? '#f97316' : score >= 30 ? '#eab308' : '#22c55e';

      popup.current?.remove();
      popup.current = new mapboxgl.Popup({ offset: 16, className: 'scam-popup', maxWidth: '280px' })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="background:#1e1e2e;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:14px;color:#e2e8f0;font-family:system-ui">
            <div style="font-size:18px;font-weight:700;margin-bottom:2px">+1 (${p.areaCode})</div>
            <div style="font-size:13px;color:#94a3b8;margin-bottom:10px">${p.city}, ${p.state}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
              <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:8px">
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Incidents</div>
                <div style="font-size:20px;font-weight:700;color:#f8fafc">${p.count}</div>
              </div>
              <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:8px">
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Risk Score</div>
                <div style="font-size:20px;font-weight:700;color:${scoreColor}">${score}</div>
              </div>
            </div>
            <div style="margin-bottom:6px">
              <span style="font-size:11px;color:#64748b">TOP SIGNAL</span>
              <div style="font-size:13px;font-weight:600;color:#f1f5f9;margin-top:2px">${p.topSignal}</div>
            </div>
            <div style="font-size:11px;color:#475569">Last seen: ${lastSeen}</div>
          </div>
        `)
        .addTo(m);
    });

    m.on('mouseenter', CIRCLE_LAYER, () => { m.getCanvas().style.cursor = 'pointer'; });
    m.on('mouseleave', CIRCLE_LAYER, () => { m.getCanvas().style.cursor = ''; });
  }, [mapReady, incidents, buildGeoJSON]);

  // Toggle heatmap visibility
  useEffect(() => {
    if (!mapReady || !map.current) return;
    const m = map.current;
    if (m.getLayer(HEAT_LAYER)) m.setPaintProperty(HEAT_LAYER, 'heatmap-opacity', showHeatmap ? 0.8 : 0);
  }, [showHeatmap, mapReady]);

  // Toggle marker visibility
  useEffect(() => {
    if (!mapReady || !map.current) return;
    const m = map.current;
    if (m.getLayer(CIRCLE_LAYER)) {
      m.setPaintProperty(CIRCLE_LAYER, 'circle-opacity', showMarkers ? 0.85 : 0);
      m.setPaintProperty(CIRCLE_LAYER, 'circle-stroke-opacity', showMarkers ? 1 : 0);
    }
    if (m.getLayer(LABEL_LAYER)) m.setPaintProperty(LABEL_LAYER, 'text-opacity', showMarkers ? 1 : 0);
  }, [showMarkers, mapReady]);

  const btnBase = 'px-3 py-1.5 rounded text-xs font-medium transition-colors';
  const btnActive = 'bg-blue-600 text-white';
  const btnInactive = 'bg-white/10 text-slate-300 hover:bg-white/20';

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />

      {/* Controls bar */}
      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
        <div className="flex gap-1 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg p-1">
          {(['24h', '7d', '30d', 'all'] as const).map(t => (
            <button key={t} onClick={() => setTimeFilter(t)}
              className={`${btnBase} ${timeFilter === t ? btnActive : btnInactive}`}>
              {t === 'all' ? 'All' : t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg p-1">
          <button onClick={() => setShowMarkers(v => !v)}
            className={`${btnBase} ${showMarkers ? btnActive : btnInactive}`}>
            Markers
          </button>
          <button onClick={() => setShowHeatmap(v => !v)}
            className={`${btnBase} ${showHeatmap ? 'bg-orange-600 text-white' : btnInactive}`}>
            Heat
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-3 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg p-3 text-xs text-slate-300">
        <div className="font-semibold mb-2 text-slate-100">Risk Score</div>
        {[
          { color: '#22c55e', label: 'Low (0–29)' },
          { color: '#eab308', label: 'Medium (30–59)' },
          { color: '#f97316', label: 'High (60–84)' },
          { color: '#ef4444', label: 'Critical (85+)' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            {label}
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-white/10 text-slate-400">
          Circle size = incident volume
        </div>
      </div>

      {/* Stats badge */}
      <div className="absolute top-3 right-14 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300">
        <span className="font-semibold text-white">{incidents.length}</span> area codes ·{' '}
        <span className="font-semibold text-white">
          {incidents.reduce((s, i) => s + i.count, 0).toLocaleString()}
        </span>{' '}
        incidents
      </div>
    </div>
  );
}
