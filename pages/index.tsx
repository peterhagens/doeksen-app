import { useState, useEffect } from 'react';

export default function Home() {
const dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const dagNaam = (date: Date) => dagen[date.getDay()];

const isSameOrAfter = (d1: Date, d2: Date) => {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return date1 >= date2;
};




  const today = new Date();
  const [date, setDate] = useState(today);
  const [departures, setDepartures] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDepartures = async (date: Date) => {
    const isoDate = date.toISOString().split('T')[0];
    const res = await fetch(`/api/departures?date=${isoDate}`);
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
    fetchDepartures(date);
  }, [date]);

  // Knop om terug te gaan, mag niet voor vandaag
    const prevDay = () => {
      const prev = new Date(date);
      prev.setDate(prev.getDate() - 1);
      if (isSameOrAfter(prev, today)) {
        setDate(prev);
      }
    };

  // Knop om een dag vooruit
  const nextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    setDate(next);
  };

  // Handlers voor input type=date
  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = new Date(e.target.value);
    if (selected >= today) {
      setDate(selected);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Rederijk Doeksen dienstregeling</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={prevDay} disabled={date <= today}>
          &lt; Vorige dag
        </button>
        <input
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={onChangeDate}
          min={today.toISOString().split('T')[0]}
          style={{ margin: '0 10px' }}
        />
        <button onClick={nextDay}>Volgende dag &gt;</button>
      </div>

      <p>
        Datum: {dagNaam(date)} ({date.toISOString().split('T')[0]})
      </p>

      {message && <p>{message}</p>}


      <ul>
        {departures.map((dep: any) => (
          <li key={dep.code}>
            <strong>{dep.vesselName}</strong> - Vertrek: {dep.departureTime} - Aankomst: {dep.arrivalTime}
          </li>
        ))}
      </ul>
    </main>
  );
}
