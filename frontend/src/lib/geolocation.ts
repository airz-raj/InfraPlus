export type GeoPoint = {
  latitude?: number;
  longitude?: number;
};

export async function getOptionalLocation(): Promise<GeoPoint> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return {};
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 60_000,
      });
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch {
    return {};
  }
}
