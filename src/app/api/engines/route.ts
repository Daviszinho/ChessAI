import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  const apiUrl = 'https://chessengineapi.calmdesert-d6fcfdbe.centralus.azurecontainerapps.io/api/engines';
  
  return new Promise((resolve) => {
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const jsonData = JSON.parse(data);
             if (jsonData.success && Array.isArray(jsonData.response)) {
               const engines = jsonData.response.map((engine: any) => engine.id);
               resolve(NextResponse.json(engines));
             } else {
               console.error('API response for engines is not in expected format:', jsonData);
               resolve(NextResponse.json({ error: 'Failed to fetch engines from external API.' }, { status: 500 }));
             }
          } else {
            console.error(`HTTP error fetching engines! Status: ${res.statusCode}, Body: ${data}`);
            resolve(NextResponse.json({ error: 'Failed to fetch engines, invalid status code.' }, { status: res.statusCode || 500 }));
          }
        } catch (e: any) {
          console.error('Failed to parse engines API response:', e.message, 'Body:', data);
          resolve(NextResponse.json({ error: 'Failed to parse engines API response.' }, { status: 500 }));
        }
      });
    }).on('error', (e) => {
      console.error('Error fetching engines from API:', e);
      resolve(NextResponse.json({ error: `Failed to fetch engines: ${e.message}` }, { status: 500 }));
    });
  });
}
