// Studio 24 - Netlify Function: Database API
// Uses Netlify Blobs as persistent key-value store

const { getStore } = require("@netlify/blobs");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
  "Content-Type": "application/json",
};

const VALID_KEYS = ["s24_inv", "s24_sales", "s24_cust", "s24_exp", "s24_products"];

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  try {
    const store = getStore("studio24");
    const { httpMethod, queryStringParameters, body } = event;
    const key = queryStringParameters?.key;

    // ── GET: fetch a value ────────────────────────────────────────────────────
    if (httpMethod === "GET") {
      if (!key || !VALID_KEYS.includes(key)) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Invalid key" }) };
      }
      const value = await store.get(key);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ key, value: value ? JSON.parse(value) : null }),
      };
    }

    // ── POST: save a value ────────────────────────────────────────────────────
    if (httpMethod === "POST") {
      const payload = JSON.parse(body || "{}");
      const { key: pKey, value } = payload;

      if (!pKey || !VALID_KEYS.includes(pKey)) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Invalid key" }) };
      }

      await store.set(pKey, JSON.stringify(value));
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ ok: true, key: pKey }),
      };
    }

    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err) {
    console.error("DB function error:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
