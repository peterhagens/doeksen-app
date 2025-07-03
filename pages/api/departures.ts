// pages/api/departures.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { date } = req.query;

  // Validatie & fallback
  let selectedDate: Date;
  if (typeof date === 'string') {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      selectedDate = parsed;
    } else {
      selectedDate = new Date(); // vandaag
    }
  } else {
    selectedDate = new Date(); // vandaag
  }

  // Datum in ISO string (YYYY-MM-DD)
  const isoDate = selectedDate.toISOString().split('T')[0];
  const url = `https://api-2021.rederij-doeksen.nl/departures/H/T/${isoDate}T00:00:00.000Z`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.departures || data.departures.length === 0) {
      return res.status(200).json({ message: 'Geen afvaarten meer vandaag', departures: [] });
    }

    res.status(200).json({ departures: data.departures });
  } catch (err) {
    res.status(500).json({ error: 'Fout bij ophalen van afvaarten' });
  }
}
