const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx4jo54CdOA3Ud930Fyf6FNFLIPSoHx0IvNzce9B0VcLCQktt4zbpK7S003xOec13AQ/exec';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Method Not Allowed'
    };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    payload = {};
  }

  try {
    const resp = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markPrinted', id: payload.id || '' })
    });
    const text = await resp.text();
    return {
      statusCode: resp.status || 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': resp.headers.get('content-type') || 'application/json'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: false, error: 'proxy_error' })
    };
  }
};
