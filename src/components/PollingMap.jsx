import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../lib/maps";

const DEFAULT_CENTER = { lat: 39.5, lng: -98.35 };

export default function PollingMap({ apiKey, locations }) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const initMap = async () => {
      if (!apiKey) return;
      setStatus("loading");
      setError("");
      try {
        const maps = await loadGoogleMaps(apiKey);
        if (!isActive) return;

        if (!mapRef.current && mapElRef.current) {
          mapRef.current = new maps.Map(mapElRef.current, {
            center: DEFAULT_CENTER,
            zoom: 4,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
        }

        if (!mapRef.current) return;

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const geocoder = new maps.Geocoder();
        const bounds = new maps.LatLngBounds();
        let hasBounds = false;

        for (const loc of locations.slice(0, 6)) {
          const addressText = loc.address || loc.name || "";
          if (!addressText) continue;

          const results = await geocoder.geocode({ address: addressText });
          if (!results?.results?.length) continue;

          const position = results.results[0].geometry.location;
          const marker = new maps.Marker({
            map: mapRef.current,
            position,
            title: loc.name || "Polling location",
          });
          markersRef.current.push(marker);
          bounds.extend(position);
          hasBounds = true;
        }

        if (hasBounds) {
          mapRef.current.fitBounds(bounds);
        } else {
          mapRef.current.setCenter(DEFAULT_CENTER);
          mapRef.current.setZoom(4);
        }

        setStatus("ready");
      } catch (err) {
        if (!isActive) return;
        setError(err?.message || "Failed to load map");
        setStatus("error");
      }
    };

    initMap();

    return () => {
      isActive = false;
    };
  }, [apiKey, locations]);

  return (
    <div className="map-panel">
      <div className="map-canvas" ref={mapElRef} />
      {status === "loading" && <div className="map-overlay">Loading map…</div>}
      {status === "error" && <div className="map-overlay error">{error}</div>}
    </div>
  );
}
