const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx4jo54CdOA3Ud930Fyf6FNFLIPSoHx0IvNzce9B0VcLCQktt4zbpK7S003xOec13AQ/exec';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  const method = event.httpMethod || 'POST';
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: 'Method Not Allowed'
    };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    payload = {};
  }

  const ids = Array.isArray(payload.ids) ? payload.ids : [];
  const body = JSON.stringify({ action: 'clearOrders', ids });

  try {
    const resp = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    const text = await resp.text();
    return {
      statusCode: resp.status || 200,
      headers: {
        ...corsHeaders,
        'Content-Type': resp.headers.get('content-type') || 'application/json'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: 'proxy_error' })
    };
  }
};
