"use client";

import { useEffect, useRef } from "react";
import { Lead } from "@/types/lead";

const ZONES: Record<string, [number, number]> = {
  Lisboa: [38.72, -9.13],
  Porto: [41.15, -8.62],
  Braga: [41.55, -8.42],
  Aveiro: [40.64, -8.65],
  "Setúbal": [38.52, -8.89],
  Faro: [37.01, -7.93],
  Leiria: [39.74, -8.8],
  Coimbra: [40.2, -8.41],
  Viseu: [40.65, -7.91],
  "Santarém": [39.23, -8.68],
};

interface Props {
  leads: Lead[];
}

export default function LeadsMap({ leads }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      // @ts-ignore - CSS import for leaflet styles
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, { zoomControl: false }).setView(
        [39.5, -8.1],
        6.3
      );

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      ).addTo(map);

      mapInstance.current = map;
      updateMarkers(L, map, leads);
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default;
      updateMarkers(L, mapInstance.current, leads);
    };
    loadLeaflet();
  }, [leads]);

  return (
    <div className="card-on8">
      <h6 className="font-bold mb-3 text-gray-500 text-xs uppercase">
        Localização de Leads
      </h6>
      <div ref={mapRef} className="w-full rounded-xl" style={{ minHeight: 500 }} />
    </div>
  );
}

function updateMarkers(L: any, map: any, leads: Lead[]) {
  // Clear existing markers
  map.eachLayer((layer: any) => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  const counts: Record<string, number> = {};
  leads.forEach((l) => {
    if (l.Zone && ZONES[l.Zone]) {
      counts[l.Zone] = (counts[l.Zone] || 0) + 1;
    }
  });

  Object.entries(counts).forEach(([zone, count]) => {
    const coords = ZONES[zone];
    if (coords) {
      L.marker(coords, {
        icon: L.divIcon({
          className: "map-badge",
          html: String(count),
          iconSize: [30, 30],
        }),
      }).addTo(map);
    }
  });
}
