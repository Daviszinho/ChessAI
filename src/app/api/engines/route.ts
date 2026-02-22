import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = 'https://chessengineapi.calmdesert-d6fcfdbe.centralus.azurecontainerapps.io/api/engines';
  
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error fetching engines! Status: ${response.status}, Body: ${errorText}`);
      return NextResponse.json({ error: `Failed to fetch engines, status: ${response.status}` }, { status: response.status });
    }

    const jsonData = await response.json();

    if (jsonData && Array.isArray(jsonData.engines)) {
      const engines = jsonData.engines.map((engine: any) => engine.name);
      return NextResponse.json(engines);
    } else {
      console.error('API response for engines is not in expected format:', jsonData);
      return NextResponse.json({ error: 'Failed to fetch engines from external API. Invalid format.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error fetching engines from API:', error);
    return NextResponse.json({ error: `Failed to fetch engines: ${error.message}` }, { status: 500 });
  }
}
