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

    // If departures exist, add a departureLocalTime field parsed from departureDateTime
    let output = result;
    if (result && Array.isArray(result.departures)) {
      output = {
        ...result,
        departures: result.departures.map((d: any) => {
          const dt = d.departureDateTime;
          let departureLocalTime = null;
          if (dt) {
            const dateObj = new Date(dt);
            if (!Number.isNaN(dateObj.getTime())) {
              departureLocalTime = dateObj.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
            }
          }

          return { ...d, departureLocalTime: departureLocalTime ?? d.departureTime };
        }),
      };
    }

    console.log('✅ Response:', JSON.stringify(output, null, 2));
  } catch (error) {
    console.error('❌ Failed to fetch:', error);
  }
}

testDeparturesAPI(); // Run the test
