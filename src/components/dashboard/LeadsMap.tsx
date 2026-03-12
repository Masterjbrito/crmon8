"use client";

import { useEffect, useRef, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  // Wait for mount to avoid Strict Mode double-init
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    // If already initialized, just update markers
    if (mapInstance.current) {
      const loadL = async () => {
        const L = (await import("leaflet")).default;
        updateMarkers(L, mapInstance.current, leads);
      };
      loadL();
      return;
    }

    let cancelled = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      // @ts-ignore
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      // Guard: check if container already has a map (Strict Mode remount)
      if ((mapRef.current as any)._leaflet_id) {
        return;
      }

      const map = L.map(mapRef.current, { zoomControl: false }).setView(
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
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, leads]);

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
