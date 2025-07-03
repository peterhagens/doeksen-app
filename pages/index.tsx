// pages/index.tsx

import { useEffect, useState } from 'react';

type Departure = {
  code: string;
  vesselName: string;
  vessel: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  status: string;
};

export default function Home() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/departures')
      .then((res) => res.json())
      .then((data) => {
        setDepartures(data);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>⛴️ Harlingen → Terschelling</h1>
      {loading ? (
        <p>Ophalen van afvaarten...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {departures.map((dep) => (
            <li
              key={dep.code}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
              }}
            >
              <strong>{dep.vesselName}</strong> ({dep.vessel})<br />
              🕗 <strong>{dep.departureTime}</strong> → {dep.arrivalTime}<br />
              ⏱️ Duur: {dep.duration} min<br />
              📶 Status: {dep.status}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
