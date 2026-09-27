export interface LocationCoordinate {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  accuracyMeters?: number;
}

// Preset popular scrap hubs and collection zones in Mumbai and major hubs
export const POPULAR_LOCATIONS: LocationCoordinate[] = [
  {
    lat: 19.1136,
    lng: 72.8697,
    address: 'MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093',
    landmark: 'Opposite SEEPZ Gate No. 1',
    city: 'Mumbai',
    pincode: '400093',
  },
  {
    lat: 19.1197,
    lng: 72.8864,
    address: 'Marol Naka, Andheri - Kurla Rd, Marol, Andheri East, Mumbai 400059',
    landmark: 'Near Metro Station',
    city: 'Mumbai',
    pincode: '400059',
  },
  {
    lat: 19.1254,
    lng: 72.8525,
    address: 'Chakala, Sahar Road, Andheri East, Mumbai 400099',
    landmark: 'Near Western Express Highway',
    city: 'Mumbai',
    pincode: '400099',
  },
  {
    lat: 19.0728,
    lng: 72.8797,
    address: 'Kurla West Scrap Market, SG Barve Marg, Kurla, Mumbai 400070',
    landmark: 'Near Kurla Railway Goods Yard',
    city: 'Mumbai',
    pincode: '400070',
  },
  {
    lat: 19.1363,
    lng: 72.9304,
    address: 'Bhandup Industrial Estate, LBS Marg, Bhandup West, Mumbai 400078',
    landmark: 'Near Asian Paints Compound',
    city: 'Mumbai',
    pincode: '400078',
  },
  {
    lat: 19.1176,
    lng: 72.9060,
    address: 'Hiranandani Business Park, Powai, Mumbai 400076',
    landmark: 'Near Powai Lake Plaza',
    city: 'Mumbai',
    pincode: '400076',
  },
  {
    lat: 19.0596,
    lng: 72.8295,
    address: 'Bandra West, Hill Road, Mumbai 400050',
    landmark: 'Near Bandra Station Road',
    city: 'Mumbai',
    pincode: '400050',
  },
  {
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place / Mayapuri Scrap Hub, New Delhi 110001',
    landmark: 'Mayapuri Phase 2 Metal Cluster',
    city: 'New Delhi',
    pincode: '110001',
  },
  {
    lat: 12.9716,
    lng: 77.5946,
    address: 'Peenya Industrial Area, Bengaluru, Karnataka 560058',
    landmark: 'Phase 3 E-Waste Depot',
    city: 'Bengaluru',
    pincode: '560058',
  },
];

export const DEFAULT_LOCATION: LocationCoordinate = POPULAR_LOCATIONS[0];

/**
 * Reverse geocode latitude and longitude to a human-readable street address.
 * Uses OpenStreetMap Nominatim with a resilient fallback to nearest mock landmark.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationCoordinate> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'KabadiwalaEwasteApp/1.0',
        },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const road = addr.road || addr.suburb || addr.neighbourhood || '';
        const city = addr.city || addr.town || addr.county || addr.state_district || 'Mumbai';
        const postcode = addr.postcode || '';
        const landmark = addr.amenity || addr.building || road || '';

        return {
          lat,
          lng,
          address: data.display_name,
          landmark: landmark || 'Pinpoint Location on Map',
          city,
          pincode: postcode,
        };
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding network notice, using nearest location mapping:', err);
  }

  // Fallback: Find closest preset landmark
  let closest = POPULAR_LOCATIONS[0];
  let minDistance = Infinity;

  for (const loc of POPULAR_LOCATIONS) {
    const d = Math.hypot(loc.lat - lat, loc.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      closest = loc;
    }
  }

  return {
    lat,
    lng,
    address: `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E (Near ${closest.address})`,
    landmark: `Near ${closest.landmark || closest.city}`,
    city: closest.city,
    pincode: closest.pincode,
  };
}

/**
 * Geocode text address / landmark to latitude & longitude coordinates.
 */
export async function searchAddressGeocode(query: string): Promise<LocationCoordinate[]> {
  if (!query || query.trim().length < 2) return [];

  const trimmed = query.trim().toLowerCase();
  const localMatches = POPULAR_LOCATIONS.filter(
    (l) =>
      l.address.toLowerCase().includes(trimmed) ||
      (l.landmark && l.landmark.toLowerCase().includes(trimmed)) ||
      (l.city && l.city.toLowerCase().includes(trimmed)) ||
      (l.pincode && l.pincode.includes(trimmed))
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ', India'
      )}&limit=5&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'KabadiwalaEwasteApp/1.0',
        },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const fetched: LocationCoordinate[] = data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          address: item.display_name,
          landmark: item.address?.road || item.address?.suburb || query,
          city: item.address?.city || item.address?.state || 'India',
          pincode: item.address?.postcode || '',
        }));

        // Merge without duplicate coordinates
        return [...fetched, ...localMatches.filter((lm) => !fetched.some((f) => Math.hypot(f.lat - lm.lat, f.lng - lm.lng) < 0.001))];
      }
    }
  } catch (err) {
    console.warn('Geocoding search notice, using local suggestions:', err);
  }

  return localMatches.length > 0 ? localMatches : POPULAR_LOCATIONS.slice(0, 4);
}
