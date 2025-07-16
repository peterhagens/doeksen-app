// If you're using Node.js < 18, install: npm install node-fetch
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

    console.log('✅ Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Failed to fetch:', error);
  }
}

testDeparturesAPI(); // Run the test
