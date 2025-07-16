// Utility to merge departures with passenger/vehicle info
export interface Departure {
  code: string;
  [key: string]: any;
}

export interface DeparturesData {
  departures: Departure[];
  [key: string]: any;
}

export interface AvailabilityData {
  departureCode: string;
  passengers: number | null;
  vehicles: number | null;
}

export function mergeDeparturesWithStats(
  departuresData: DeparturesData,
  availabilityData: AvailabilityData[]
): DeparturesData {
  if (!departuresData?.departures || !Array.isArray(availabilityData)) return departuresData;

  // Create a lookup for stats by departureCode
  const statsMap: Record<string, AvailabilityData> = Object.fromEntries(
    availabilityData.map((stat: AvailabilityData) => [stat.departureCode, stat])
  );

  // Merge stats into departures
  const mergedDepartures = departuresData.departures.map((dep: Departure) => {
    const stats = statsMap[dep.code];
    return {
      ...dep,
      passengers: stats?.passengers ?? null,
      vehicles: stats?.vehicles ?? null,
    };
  });

  return { ...departuresData, departures: mergedDepartures };
}
