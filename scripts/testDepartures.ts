// Calls the API from H to T for today and outputs result to console
// tsx scripts/testDepartures.ts
import fetch from 'node-fetch';

function getTodayISODate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

async function testDeparturesAPI(from = 'H', to = 'T') {
  const date = getTodayISODate();

  const query = new URLSearchParams({ date, from, to }).toString();
  const url = `http://localhost:3000/api/departures?${query}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    // If departures exist, add departureLocalTime and arrivalLocalTime fields parsed from ISO datetimes
    let output = result;
    if (result && Array.isArray(result.departures)) {
      output = {
        ...result,
        departures: result.departures.map((d: any) => {
          const depDt = d.departureDateTime;
          const arrDt = d.arrivalDateTime;

          let departureLocalTime: string | null = null;
          let arrivalLocalTime: string | null = null;

          if (depDt) {
            const dateObj = new Date(depDt);
            if (!Number.isNaN(dateObj.getTime())) {
              departureLocalTime = dateObj.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
            }
          }

          if (arrDt) {
            const dateObj = new Date(arrDt);
            if (!Number.isNaN(dateObj.getTime())) {
              arrivalLocalTime = dateObj.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
            }
          }

          return {
            ...d,
            departureLocalTime: departureLocalTime ?? d.departureTime,
            arrivalLocalTime: arrivalLocalTime ?? d.arrivalTime,
          };
        }),
      };
    }

    console.log('✅ Response:', JSON.stringify(output, null, 2));
  } catch (error) {
    console.error('❌ Failed to fetch:', error);
  }
}

testDeparturesAPI(); // Run the test
