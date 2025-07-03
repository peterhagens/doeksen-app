// pages/api/departures.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const tomorrow = new Date();
   tomorrow.setDate(tomorrow.getDate() + 1);
  const isoDate = tomorrow.toISOString().split('T')[0]; // bv. 2025-07-04
  const url = `https://api-2021.rederij-doeksen.nl/departures/H/T/${isoDate}T00:00:00.000Z`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data.departures);
  } catch (err) {
    res.status(500).json({ error: 'Fout bij ophalen van afvaarten' });
  }
}
