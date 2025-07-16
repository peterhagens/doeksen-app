// merges the departures data with availability statistics.

import { mergeDeparturesWithStats, DeparturesData, AvailabilityData } from '@/lib/mergeDepartures';

const departuresData: DeparturesData = {
  departures: [
    {
      code: 'FR160720251505',
      departureDateTime: '2025-07-16T15:05:00+02:00',
      departureTime: '3:05 PM',
      arrivalDateTime: '2025-07-16T17:05:00+02:00',
      arrivalTime: '5:05 PM',
      duration: 120,
      vesselName: 'Veerdienst ms. Friesland',
      vessel: 'FR',
      portFrom: { code: 'H', name: 'Harlingen' },
      portTo: { code: 'T', name: 'Terschelling' },
      persons: null,
      meters: null,
      accessibilityLevel: 'Full',
      estimatedDepartureDateTime: '2025-07-16T15:05:00+02:00',
      estimatedArrivalDateTime: '2025-07-16T17:05:00+02:00',
      status: 'OPEN',
    },
    {
      code: 'TI160720251735',
      departureDateTime: '2025-07-16T17:35:00+02:00',
      departureTime: '5:35 PM',
      arrivalDateTime: '2025-07-16T18:25:00+02:00',
      arrivalTime: '6:25 PM',
      duration: 50,
      vesselName: 'Sneldienst',
      vessel: 'TI',
      portFrom: { code: 'H', name: 'Harlingen' },
      portTo: { code: 'T', name: 'Terschelling' },
      persons: null,
      meters: null,
      accessibilityLevel: 'Full',
      estimatedDepartureDateTime: '2025-07-16T17:35:00+02:00',
      estimatedArrivalDateTime: '2025-07-16T18:25:00+02:00',
      status: 'OPEN',
    },
    {
      code: 'FR160720251955',
      departureDateTime: '2025-07-16T19:55:00+02:00',
      departureTime: '7:55 PM',
      arrivalDateTime: '2025-07-16T21:55:00+02:00',
      arrivalTime: '9:55 PM',
      duration: 120,
      vesselName: 'Veerdienst ms. Friesland',
      vessel: 'FR',
      portFrom: { code: 'H', name: 'Harlingen' },
      portTo: { code: 'T', name: 'Terschelling' },
      persons: null,
      meters: null,
      accessibilityLevel: 'Full',
      estimatedDepartureDateTime: '2025-07-16T19:55:00+02:00',
      estimatedArrivalDateTime: '2025-07-16T21:55:00+02:00',
      status: 'OPEN',
    },
  ],
};

const statsArray: AvailabilityData[] = [
  { departureCode: 'FR160720251505', passengers: 622, vehicles: 8 },
  { departureCode: 'TI160720251735', passengers: 314, vehicles: null },
  { departureCode: 'FR160720251955', passengers: 703, vehicles: 154 },
];

const merged = mergeDeparturesWithStats(departuresData, statsArray);
console.log(JSON.stringify(merged, null, 2));
