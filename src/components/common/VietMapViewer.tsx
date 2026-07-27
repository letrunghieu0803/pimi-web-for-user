import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { vietmapService } from '@/services/vietmapService';
import { MapPin, Navigation, Building2 } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface VietMapViewerProps {
  lat?: number;
  lng?: number;
  roomName: string;
  address: string;
  height?: string;
}

export const VietMapViewer: React.FC<VietMapViewerProps> = ({
  lat = 21.0285,
  lng = 105.8542,
  roomName,
  address,
  height = '350px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([lat, lng], 15);

      // VietMap Tiles
      L.tileLayer(vietmapService.getTileLayerUrl(), {
        attribution: '&copy; VietMap',
        maxZoom: 20,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-vietmap-marker',
        html: `<div style="
          background: linear-gradient(135deg, #4F46E5 0%, #10B981 100%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.45);
          border: 3px solid white;
          color: white;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 42],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <strong style="color: #0F172A; font-size: 13px; display: block; margin-bottom: 2px;">${roomName}</strong>
          <span style="color: #64748B; font-size: 11px;">${address}</span>
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 15);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, roomName, address]);

  const openNavigation = () => {
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>Vị Trí Định Vị Bản Đồ VietMap</span>
        </div>
        <button
          onClick={openNavigation}
          className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Chỉ đường tới đây</span>
        </button>
      </div>

      <div
        className="rounded-3xl overflow-hidden border border-slate-200 shadow-md relative"
        style={{ height }}
      >
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>
    </div>
  );
};
