import { useState, useEffect } from 'react';

const dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const dagNaam = (date: Date) => dagen[date.getDay()];

const isSameOrAfter = (d1: Date, d2: Date) => {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return date1 >= date2;
};

// Boot icon zoals eerder
const BootIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: 12 }}
  >
    <path
      d="M2 44h60l-10-20H12l-10 20z"
      fill="#4A90E2"
      stroke="#1C3D6D"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <rect x="20" y="24" width="24" height="10" fill="#90CAF9" />
    <path d="M32 12v12" stroke="#1C3D6D" strokeWidth="2" />
    <path d="M26 24h12" stroke="#1C3D6D" strokeWidth="2" />
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
                Vertrek: <span style={{ color: '#34495e' }}>{dep.departureTime}</span> &nbsp;&nbsp;
                Aankomst: <span style={{ color: '#34495e' }}>{dep.arrivalTime}</span>
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
