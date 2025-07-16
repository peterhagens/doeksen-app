// pages/api/departures.ts

import type { NextApiRequest, NextApiResponse } from "next";
import {
  mergeDeparturesWithStats,
  DeparturesData,
  AvailabilityData,
} from "@/lib/mergeDepartures";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date, from = "H", to = "T" } = req.query;

  if (
    typeof date !== "string" ||
    typeof from !== "string" ||
    typeof to !== "string"
  ) {
    res.status(400).json({ error: "Ongeldige parameters" });
    return;
  }

  const url = `https://api-2021.rederij-doeksen.nl/departures/${from}/${to}/${date}T00:00:00.000Z`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.departures || data.departures.length === 0) {
      res
        .status(200)
        .json({ message: "Geen afvaarten meer vandaag", departures: [] });
      return;
    }

    // enrich with availability statistics
    const availabilityUrl = `https://api-2021.rederij-doeksen.nl/departures/availability`;
    
    const availabilityResponse = await fetch(availabilityUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const availabilityData = await availabilityResponse.json();

    const combinedResponse = mergeDeparturesWithStats(data, availabilityData);

    res.status(200).json( combinedResponse );
  } catch (err) {
    res.status(500).json({ error: "Fout bij ophalen van afvaarten" });
  }
}
