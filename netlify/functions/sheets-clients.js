const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx4jo54CdOA3Ud930Fyf6FNFLIPSoHx0IvNzce9B0VcLCQktt4zbpK7S003xOec13AQ/exec';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  const method = event.httpMethod || 'GET';
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (method === 'GET') {
    try {
      const resp = await fetch(`${SHEETS_WEBAPP_URL}?mode=clients`, {
        method: 'GET'
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

  const action = payload.action || 'upsertClient';
  let body = '';
  if (action === 'deleteClient') {
    body = JSON.stringify({
      action: 'deleteClient',
      tel: payload.tel || (payload.client && payload.client.tel) || ''
    });
  } else {
    body = JSON.stringify({
      action: 'upsertClient',
      client: payload.client || payload
    });
  }

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
