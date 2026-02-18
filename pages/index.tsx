import { useState, useEffect } from 'react';

const dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const dagNaam = (date: Date) => dagen[date.getDay()];

const isSameOrAfter = (d1: Date, d2: Date) => {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return date1 >= date2;
};

// Boot icon (optimized from custom design)
const BootIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: 12 }}
  >
    {/* Hull */}
    <path d="M8 27 L80 27 L92 23 L96 20 L96 30 L12 32 Z" fill="#1C3D6D" />

    {/* Upper body */}
    <path d="M18 20 L72 20 L80 24 L88 24 L80 28 L18 28 Z" fill="#4A90E2" />

    {/* Bridge */}
    <polygon points="72,17 88,17 92,24 80,24" fill="#1C3D6D" />

    {/* Windows strip */}
    <rect x="22" y="22" width="48" height="3" fill="#90CAF9" rx="1" />

    {/* Upper deck */}
    <rect x="32" y="14" width="32" height="4" fill="#4A90E2" rx="1" />

    {/* Funnel */}
    <rect x="44" y="8" width="6" height="6" fill="#1C3D6D" rx="1" />

    {/* Mast */}
    <line x1="47" y1="8" x2="47" y2="2" stroke="#1C3D6D" strokeWidth="1" />

    {/* Wave accent */}
    <path
      d="M15 35 Q25 32 35 35 T55 35 T75 35 T95 35"
      stroke="#90CAF9"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

export default function Home() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [departures, setDepartures] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  // Hier toggle tussen routes
  const [route, setRoute] = useState<'H-T' | 'T-H'>('H-T');

  const fetchDepartures = async (date: Date, route: 'H-T' | 'T-H') => {
    const isoDate = date.toISOString().split('T')[0];
    const [from, to] = route.split('-');
    const res = await fetch(`/api/departures?date=${isoDate}&from=${from}&to=${to}`);
    const json = await res.json();

    if (json.message) {
      setMessage(json.message);
      setDepartures([]);
    } else {
      setMessage('');
      setDepartures(json.departures);
    }
  };

  useEffect(() => {
    fetchDepartures(date, route);
  }, [date, route]);

  const prevDay = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    if (isSameOrAfter(prev, today)) {
      setDate(prev);
    }
  };

  const nextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    setDate(next);
  };

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = new Date(e.target.value);
    if (isSameOrAfter(selected, today)) {
      setDate(selected);
    }
  };

  // Toggle functie route omdraaien
  const toggleRoute = () => {
    setRoute((prev) => (prev === 'H-T' ? 'T-H' : 'H-T'));
  };

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f4f7fa',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: 24 }}>
        Rederijk Doeksen dienstregeling
      </h1>

      {/* Route toggle */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 16, color: '#555' }}>
          Route: <strong>{route === 'H-T' ? 'Harlingen → Terschelling' : 'Terschelling → Harlingen'}</strong>
        </span>
        <button
          onClick={toggleRoute}
          style={{
            padding: '8px 16px',
            fontSize: 16,
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          aria-label="Toggle route"
        >
          Wissel route
        </button>
      </section>

      {/* Datum selectie en knoppen */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={prevDay}
          disabled={
            !isSameOrAfter(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1), today)
          }
          style={{
            padding: '10px 16px',
            fontSize: 16,
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            opacity: !isSameOrAfter(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1), today)
              ? 0.4
              : 1,
          }}
        >
          &lt; Vorige dag
        </button>

        <input
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={onChangeDate}
          min={today.toISOString().split('T')[0]}
          style={{
            padding: '10px 12px',
            fontSize: 16,
            borderRadius: 6,
            border: '1px solid #ccc',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        />

        <button
          onClick={nextDay}
          style={{
            padding: '10px 16px',
            fontSize: 16,
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Volgende dag &gt;
        </button>
      </section>

      <p style={{ textAlign: 'center', marginBottom: 32, fontSize: 18, color: '#555' }}>
        <strong>{dagNaam(date)}</strong> —{' '}
        {date.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {message && (
        <p style={{ textAlign: 'center', color: '#c0392b', fontWeight: 'bold', fontSize: 18 }}>{message}</p>
      )}

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        {departures.map((dep) => (
          <article
            key={dep.code}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s',
              cursor: 'default',
              flexWrap: 'wrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ flexShrink: 0 }}>
              <BootIcon />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 20, color: '#2c3e50' }}>{dep.vesselName}</h2>
              <p style={{ margin: 0, color: '#7f8c8d', fontWeight: '600', fontSize: 16 }}>
                Vertrek: <span style={{ color: '#34495e' }}>{dep.departureLocalTime ?? dep.departureTime}</span> &nbsp;&nbsp;
                Aankomst: <span style={{ color: '#34495e' }}>{dep.arrivalLocalTime ?? dep.arrivalTime}</span>
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#34495e', fontSize: 15 }}>
                Passagiers: <strong>{dep.passengers ?? 'n.v.t.'}</strong> &nbsp;&nbsp;
                Voertuigen: <strong>{dep.vehicles ?? 'n.v.t.'}</strong>
              </p>
            </div>
          </article>
        ))}
      </section>
      <footer
        style={{
          marginTop: 48,
          padding: '24px 0',
          textAlign: 'center',
          color: '#888',
          fontSize: 14,
          background: 'none',
        }}
      >
        <p>
          <strong>Disclaimer:</strong> Dit is een privé, niet-commercieel project. Het enige doel is om sneller en eenvoudiger de veertijden en beschikbaarheid van Rederij Doeksen te kunnen raadplegen. Deze site is niet verbonden aan of goedgekeurd door Rederij Doeksen.
        </p>
      </footer>

    </main>
  );
}
