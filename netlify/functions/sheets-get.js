const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx4jo54CdOA3Ud930Fyf6FNFLIPSoHx0IvNzce9B0VcLCQktt4zbpK7S003xOec13AQ/exec';

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Method Not Allowed'
    };
  }

  try {
    const resp = await fetch(`${SHEETS_WEBAPP_URL}?mode=orders`, {
      method: 'GET'
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
